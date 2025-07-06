-- Async Webhook Setup Script
-- This replaces the blocking HTTP webhook with a non-blocking job queue system

-- Step 1: Create webhook jobs table
CREATE TABLE IF NOT EXISTS webhook_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL,
  webhook_url TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Step 2: Create index for efficient job processing
CREATE INDEX IF NOT EXISTS idx_webhook_jobs_status_created 
ON webhook_jobs(status, created_at) 
WHERE status IN ('pending', 'failed');

-- Step 3: Create async webhook trigger function
CREATE OR REPLACE FUNCTION queue_discord_webhook()
RETURNS TRIGGER AS $$
BEGIN
  -- Only queue if not already sent to Discord
  IF NEW.sent_to_discord = FALSE THEN
    INSERT INTO webhook_jobs (question_id, webhook_url, payload)
    VALUES (
      NEW.id,
      'https://malnbadens-camping-git-chatbot-dev-carloaskanders-projects.vercel.app/api/discord-bot',
      jsonb_build_object(
        'record', jsonb_build_object(
          'id', NEW.id,
          'question', NEW.question,
          'bot_response', NEW.bot_response,
          'confidence', NEW.confidence,
          'similarity', NEW.similarity,
          'priority', NEW.priority,
          'created_at', NEW.created_at
        )
      )
    );
    
    RAISE NOTICE 'Webhook job queued for question: %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Drop existing trigger and create new async trigger
DROP TRIGGER IF EXISTS notify_discord_bot ON pending;

CREATE TRIGGER queue_discord_webhook_trigger
  AFTER INSERT ON pending
  FOR EACH ROW
  EXECUTE FUNCTION queue_discord_webhook();

-- Step 5: Create function to get next job (for job processor)
CREATE OR REPLACE FUNCTION get_next_webhook_job()
RETURNS TABLE(
  job_id UUID,
  question_id UUID,
  webhook_url TEXT,
  payload JSONB,
  attempts INTEGER
) AS $$
BEGIN
  RETURN QUERY
  UPDATE webhook_jobs 
  SET status = 'processing',
      processed_at = now()
  WHERE id = (
    SELECT webhook_jobs.id 
    FROM webhook_jobs 
    WHERE status = 'pending' 
    OR (status = 'failed' AND attempts < max_attempts)
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
  RETURNING webhook_jobs.id, webhook_jobs.question_id, webhook_jobs.webhook_url, 
            webhook_jobs.payload, webhook_jobs.attempts;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create function to mark job as completed
CREATE OR REPLACE FUNCTION complete_webhook_job(job_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE webhook_jobs 
  SET status = 'completed',
      processed_at = now()
  WHERE id = job_id;
  
  -- Also mark the original question as sent to Discord
  UPDATE pending 
  SET sent_to_discord = TRUE
  WHERE id = (SELECT question_id FROM webhook_jobs WHERE id = job_id);
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create function to mark job as failed
CREATE OR REPLACE FUNCTION fail_webhook_job(job_id UUID, error_msg TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE webhook_jobs 
  SET status = 'failed',
      attempts = attempts + 1,
      error_message = error_msg,
      processed_at = now()
  WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create cleanup function for old jobs
CREATE OR REPLACE FUNCTION cleanup_old_webhook_jobs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM webhook_jobs 
  WHERE status = 'completed' 
  AND processed_at < now() - interval '24 hours';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Grant permissions (adjust user as needed)
-- GRANT ALL ON webhook_jobs TO your_user;
-- GRANT EXECUTE ON FUNCTION get_next_webhook_job() TO your_user;
-- GRANT EXECUTE ON FUNCTION complete_webhook_job(UUID) TO your_user;
-- GRANT EXECUTE ON FUNCTION fail_webhook_job(UUID, TEXT) TO your_user;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Async webhook system setup complete!';
  RAISE NOTICE '📋 Tables created: webhook_jobs';
  RAISE NOTICE '🔄 Trigger created: queue_discord_webhook_trigger';
  RAISE NOTICE '⚡ Functions created: get_next_webhook_job, complete_webhook_job, fail_webhook_job';
  RAISE NOTICE '🚀 Ready for async webhook processing!';
END $$; 
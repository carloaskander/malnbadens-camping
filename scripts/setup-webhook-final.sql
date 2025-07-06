-- Final webhook setup for independent Discord bot
-- URL: malnbadens-camping-git-chatbot-dev-carloaskanders-projects.vercel.app

-- 1. Ensure we have the sent_to_discord column
ALTER TABLE pending ADD COLUMN IF NOT EXISTS sent_to_discord BOOLEAN DEFAULT false;

-- 2. Create webhook function to notify Discord bot
CREATE OR REPLACE FUNCTION notify_discord_bot()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify for new rows that aren't sent to Discord yet
    IF TG_OP = 'INSERT' AND NEW.sent_to_discord = false THEN
        PERFORM
            net.http_post(
                url := 'https://malnbadens-camping-git-chatbot-dev-carloaskanders-projects.vercel.app/api/discord-bot',
                headers := '{"Content-Type": "application/json"}'::jsonb,
                body := jsonb_build_object(
                    'record', jsonb_build_object(
                        'id', NEW.id,
                        'question', NEW.question,
                        'priority', NEW.priority,
                        'confidence', NEW.confidence,
                        'similarity', NEW.similarity
                    )
                )
            );
        
        -- Log the webhook call
        RAISE NOTICE 'Discord webhook triggered for question ID: %', NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create database trigger
DROP TRIGGER IF EXISTS trigger_notify_discord_bot ON pending;
CREATE TRIGGER trigger_notify_discord_bot
    AFTER INSERT ON pending
    FOR EACH ROW
    EXECUTE FUNCTION notify_discord_bot();

-- 4. Test the setup
SELECT 'Webhook system ready! 🚀' as status;
SELECT 'Discord bot will be called at: https://malnbadens-camping-git-chatbot-dev-carloaskanders-projects.vercel.app/api/discord-bot' as webhook_url;

-- 5. Show current pending questions for testing
SELECT 
    id, 
    question, 
    priority, 
    confidence, 
    sent_to_discord,
    created_at
FROM pending 
ORDER BY created_at DESC 
LIMIT 5; 
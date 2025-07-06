-- Cleanup script: Remove Ferrari columns and add missing Honda column
-- This gets us back to the simple, working Honda system

-- 1. Add the missing Honda column
ALTER TABLE pending 
ADD COLUMN IF NOT EXISTS sent_to_discord BOOLEAN DEFAULT false;

-- 2. Update existing rows: if job_status = 'completed', mark as sent_to_discord = true
UPDATE pending 
SET sent_to_discord = true 
WHERE job_status = 'completed';

-- 3. Remove Ferrari objects (views, functions, columns)
-- Use CASCADE to force remove all Ferrari dependencies
DROP VIEW IF EXISTS job_queue_status CASCADE;
DROP FUNCTION IF EXISTS get_next_pending_job(TEXT, INTEGER) CASCADE;

-- Force drop columns with CASCADE to remove all dependencies
ALTER TABLE pending DROP COLUMN IF EXISTS worker_id CASCADE;
ALTER TABLE pending DROP COLUMN IF EXISTS completed_at CASCADE;
ALTER TABLE pending DROP COLUMN IF EXISTS processing_started_at CASCADE;
ALTER TABLE pending DROP COLUMN IF EXISTS last_error CASCADE;
ALTER TABLE pending DROP COLUMN IF EXISTS next_retry_at CASCADE;
ALTER TABLE pending DROP COLUMN IF EXISTS max_retries CASCADE;
ALTER TABLE pending DROP COLUMN IF EXISTS retry_count CASCADE;
ALTER TABLE pending DROP COLUMN IF EXISTS job_status CASCADE;

-- 4. Verify the Honda schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'pending' 
ORDER BY ordinal_position;

-- 5. Create index for efficient Discord bot queries
CREATE INDEX IF NOT EXISTS idx_pending_sent_to_discord ON pending (sent_to_discord) WHERE sent_to_discord = false;

-- Success message
SELECT 'Honda system restored! 🚗' as status; 
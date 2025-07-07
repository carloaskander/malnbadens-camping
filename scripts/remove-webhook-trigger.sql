-- Remove Discord webhook trigger and function
-- This script removes the database webhook trigger since we're now calling Discord directly

-- Drop the trigger first
DROP TRIGGER IF EXISTS discord_notify_trigger ON pending;

-- Drop the function
DROP FUNCTION IF EXISTS notify_discord_bot();

-- Verify cleanup
SELECT 'Webhook trigger and function removed successfully' as status; 
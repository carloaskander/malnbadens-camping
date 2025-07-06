-- Fix webhook function to use correct Supabase HTTP extension

-- 1. First, check what HTTP extensions are available
SELECT * FROM pg_available_extensions WHERE name LIKE '%http%';

-- 2. Enable the http extension (run this if not already enabled)
-- You might need to enable this in Supabase Dashboard > Database > Extensions
CREATE EXTENSION IF NOT EXISTS http;

-- 3. Updated webhook function using the correct HTTP extension
CREATE OR REPLACE FUNCTION notify_discord_bot()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify for new rows that aren't sent to Discord yet
    IF TG_OP = 'INSERT' AND NEW.sent_to_discord = false THEN
        
        -- Log the attempt
        RAISE NOTICE 'Discord webhook triggered for question ID: %', NEW.id;
        
        -- Call Discord bot using http extension
        PERFORM http_post(
            'https://malnbadens-camping-git-chatbot-dev-carloaskanders-projects.vercel.app/api/discord-bot',
            jsonb_build_object(
                'record', jsonb_build_object(
                    'id', NEW.id,
                    'question', NEW.question,
                    'priority', NEW.priority,
                    'confidence', NEW.confidence,
                    'similarity', NEW.similarity
                )
            )::text,
            'application/json'
        );
        
        RAISE NOTICE 'Discord webhook called for question: %', NEW.question;
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Recreate the trigger
DROP TRIGGER IF EXISTS trigger_notify_discord_bot ON pending;
CREATE TRIGGER trigger_notify_discord_bot
    AFTER INSERT ON pending
    FOR EACH ROW
    EXECUTE FUNCTION notify_discord_bot();

-- 5. Test the setup
SELECT 'Webhook system fixed! 🚀' as status;
SELECT 'Make sure http extension is enabled in Supabase Dashboard' as note; 
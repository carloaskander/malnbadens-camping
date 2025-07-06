-- Fix webhook function to prevent transaction rollbacks on webhook failures
-- This ensures questions are saved even if Discord webhook times out

-- 1. Enable http extension if not already enabled
CREATE EXTENSION IF NOT EXISTS http;

-- 2. Create robust webhook function with exception handling
CREATE OR REPLACE FUNCTION notify_discord_bot()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify for new rows that aren't sent to Discord yet
    IF TG_OP = 'INSERT' AND NEW.sent_to_discord = false THEN
        
        -- Log the attempt
        RAISE NOTICE 'Discord webhook triggered for question ID: %', NEW.id;
        
        -- Use exception handling to prevent webhook failure from affecting main transaction
        BEGIN
            -- Call Discord bot using http extension with timeout
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
            
            RAISE NOTICE 'Discord webhook completed successfully for question: %', NEW.question;
            
        EXCEPTION 
            WHEN OTHERS THEN
                -- Log the error but don't fail the main transaction
                RAISE WARNING 'Discord webhook failed for question ID %, error: %. Question saved anyway.', NEW.id, SQLERRM;
                
                -- Note: Question is still saved in database and can be processed later
                -- The Discord bot fallback mechanism will pick it up
        END;
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Recreate the trigger (this ensures it uses the new function)
DROP TRIGGER IF EXISTS trigger_notify_discord_bot ON pending;
CREATE TRIGGER trigger_notify_discord_bot
    AFTER INSERT ON pending
    FOR EACH ROW
    EXECUTE FUNCTION notify_discord_bot();

-- 4. Test the setup
SELECT 'Webhook system made transaction-safe! 🚀' as status;
SELECT 'Questions will be saved even if Discord webhook fails' as note;

-- 5. Show current pending questions for verification
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
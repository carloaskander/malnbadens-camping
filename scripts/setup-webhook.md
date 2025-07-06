# Discord Bot Independent Setup

## 🎯 Goal
Make Discord bot work independently - triggered by database changes, not user interactions.

## 📋 Setup Steps

### 1. Create Supabase Webhook Function
```sql
-- Create a function to trigger Discord bot webhook
CREATE OR REPLACE FUNCTION notify_discord_bot()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify for new rows that aren't sent to Discord yet
    IF TG_OP = 'INSERT' AND NEW.sent_to_discord = false THEN
        PERFORM
            net.http_post(
                url := 'https://YOUR_VERCEL_URL/api/discord-bot',
                headers := '{"Content-Type": "application/json"}'::jsonb,
                body := jsonb_build_object(
                    'record', jsonb_build_object(
                        'id', NEW.id,
                        'question', NEW.question,
                        'priority', NEW.priority,
                        'confidence', NEW.confidence
                    )
                )
            );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2. Create Database Trigger
```sql
-- Create trigger to call function on new pending questions
CREATE OR REPLACE TRIGGER trigger_notify_discord_bot
    AFTER INSERT ON pending
    FOR EACH ROW
    EXECUTE FUNCTION notify_discord_bot();
```

### 3. Update Your Vercel URL
Replace `YOUR_VERCEL_URL` with your actual Vercel URL in the webhook function.

## 🔧 How It Works

1. **User asks question** → Chat API logs to database
2. **Database trigger fires** → Calls Discord bot webhook with specific question ID
3. **Discord bot processes** → Only that ONE question, immediately
4. **No more batching** → Each question processed individually
5. **No user blocking** → Completely independent from chat

## ✅ Benefits

- ✅ **Independent**: Discord bot works separately from chat
- ✅ **Individual**: Processes one question at a time
- ✅ **Instant**: Triggered immediately when question is logged
- ✅ **Reliable**: Database ensures delivery
- ✅ **No cron jobs**: Uses database triggers instead

## 🧪 Testing

Test the setup by asking a low-confidence question on your website. You should see:
1. Question logged to database
2. Discord bot triggered automatically
3. Question sent to Discord immediately
4. No batching or delays

## 📝 Manual Testing

You can also test manually:
```bash
curl -X POST https://YOUR_VERCEL_URL/api/discord-bot \
  -H "Content-Type: application/json" \
  -d '{"questionId": "QUESTION_UUID_HERE"}'
``` 
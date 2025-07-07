# Deploy Direct Discord Call Approach

## Overview
This removes the timeout issue by calling Discord directly from Chat API instead of using database triggers.

## Step 1: Remove Webhook Trigger (In Supabase SQL Editor)
```sql
-- Remove Discord webhook trigger and function
-- This script removes the database webhook trigger since we're now calling Discord directly

-- Drop the trigger first
DROP TRIGGER IF EXISTS discord_notify_trigger ON pending;

-- Drop the function
DROP FUNCTION IF EXISTS notify_discord_bot();

-- Verify cleanup
SELECT 'Webhook trigger and function removed successfully' as status;
```

## Step 2: Deploy Updated Code
The following files have been updated:
- `api/chat.js` - Now calls Discord directly after saving to database
- `api/discord-bot-optimized.js` - Handles direct calls from Chat API

## Step 3: Test the Flow
1. Ask a low-confidence question on the website
2. Check logs for: `🚀 Notifying Discord bot directly...`
3. Verify Discord receives the question
4. Check database: question should be saved with `discord_message_id: 'direct-call-processed'`

## Architecture Benefits
- ✅ **No more timeouts** - Database transaction completes instantly
- ✅ **Still instant Discord notifications** - Direct HTTP call happens separately  
- ✅ **Much simpler** - No job queues or complex async systems
- ✅ **Separation of concerns** - Database and Discord calls are independent
- ✅ **Better error handling** - Discord failures don't affect user experience

## Flow Diagram
```
User asks question
       ↓
Chat API processes question
       ↓
Supabase INSERT (completes instantly) ✅
       ↓
Direct Discord API call ✅
       ↓
Discord message posted
```

No more database waiting for HTTP responses! 
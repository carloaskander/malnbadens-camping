-- Add Discord integration columns to pending table
ALTER TABLE pending 
ADD COLUMN IF NOT EXISTS sent_to_discord BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS discord_message_id TEXT,
ADD COLUMN IF NOT EXISTS resolved BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ; 
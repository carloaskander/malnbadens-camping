-- Update pending table to include bot response data
-- Run this in Supabase SQL Editor

-- Add bot_response column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pending' AND column_name = 'bot_response'
  ) THEN
    ALTER TABLE pending ADD COLUMN bot_response TEXT;
    RAISE NOTICE 'Added bot_response column';
  ELSE
    RAISE NOTICE 'bot_response column already exists';
  END IF;
END $$;

-- Add confidence column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pending' AND column_name = 'confidence'
  ) THEN
    ALTER TABLE pending ADD COLUMN confidence TEXT;
    RAISE NOTICE 'Added confidence column';
  ELSE
    RAISE NOTICE 'confidence column already exists';
  END IF;
END $$;

-- Add similarity column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pending' AND column_name = 'similarity'
  ) THEN
    ALTER TABLE pending ADD COLUMN similarity DECIMAL(4,3);
    RAISE NOTICE 'Added similarity column';
  ELSE
    RAISE NOTICE 'similarity column already exists';
  END IF;
END $$;

-- Verify the table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'pending'
ORDER BY ordinal_position; 
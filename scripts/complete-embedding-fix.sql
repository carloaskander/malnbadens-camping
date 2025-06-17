-- Complete fix for text-embedding-3-large (3072 dimensions)
-- Run this entire script in Supabase SQL Editor

-- Step 1: Drop the function first
DROP FUNCTION IF EXISTS match_faq(vector, float, int);

-- Step 2: Check current table structure
SELECT 
  column_name, 
  data_type,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'faq' AND column_name = 'embedding';

-- Step 3: Drop and recreate the embedding column with correct dimensions
ALTER TABLE faq DROP COLUMN IF EXISTS embedding;
ALTER TABLE faq ADD COLUMN embedding vector(3072);

-- Step 4: Recreate the function with correct dimensions
CREATE OR REPLACE FUNCTION match_faq(
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
RETURNS TABLE(
  id uuid,
  question text,
  answer text,
  similarity float
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    faq.id,
    faq.question,
    faq.answer,
    1 - (faq.embedding <=> query_embedding) AS similarity
  FROM faq
  WHERE 1 - (faq.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;

-- Step 5: Verify everything is correct
SELECT 
  column_name, 
  data_type
FROM information_schema.columns 
WHERE table_name = 'faq' AND column_name = 'embedding';

SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name = 'match_faq';

-- Step 6: Check that table is empty and ready for new data
SELECT COUNT(*) as row_count FROM faq; 
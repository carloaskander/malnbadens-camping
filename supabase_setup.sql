-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create FAQ table with vector embeddings
CREATE TABLE IF NOT EXISTS public.faq (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    embedding VECTOR(1536), -- text-embedding-3-small dimension
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pending questions table
CREATE TABLE IF NOT EXISTS public.pending (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending ENABLE ROW LEVEL SECURITY;

-- RLS policies for FAQ table
-- Anon users can only read
CREATE POLICY "Anyone can read FAQ" ON public.faq
    FOR SELECT USING (true);

-- Staff can do everything (you'll need to create staff role)
CREATE POLICY "Staff can manage FAQ" ON public.faq
    FOR ALL USING (auth.jwt() ->> 'role' = 'staff');

-- RLS policies for pending table
-- Only staff can read pending questions
CREATE POLICY "Staff can read pending" ON public.pending
    FOR SELECT USING (auth.jwt() ->> 'role' = 'staff');

-- System can insert pending questions (anon users through API)
CREATE POLICY "System can insert pending" ON public.pending
    FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS faq_embedding_idx ON public.faq 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS pending_created_at_idx ON public.pending (created_at DESC);

-- Function to search FAQ using cosine similarity
CREATE OR REPLACE FUNCTION match_faq(
  query_embedding VECTOR(1536),
  match_threshold FLOAT DEFAULT 0.6,
  match_count INT DEFAULT 3
)
RETURNS TABLE (
  id UUID,
  question TEXT,
  answer TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    faq.id,
    faq.question,
    faq.answer,
    1 - (faq.embedding <=> query_embedding) AS similarity
  FROM public.faq
  WHERE 1 - (faq.embedding <=> query_embedding) > match_threshold
  ORDER BY faq.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_faq_updated_at BEFORE UPDATE ON public.faq
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 
# 🤖 AI Chatbot Setup Guide

## 📋 Prerequisites

1. **OpenAI Account** - Get API key from [OpenAI Platform](https://platform.openai.com)
2. **Supabase Account** - Create project at [Supabase](https://supabase.com)
3. **Vercel Account** - For deployment (already set up)

## 🗄️ Database Setup

### 1. Create Supabase Project
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create new project in EU region
3. Wait for project initialization

### 2. Run SQL Setup
1. Go to **SQL Editor** in Supabase dashboard
2. Copy and paste contents of `supabase_setup.sql`
3. Run the query to create tables and functions

### 3. Enable pgvector Extension
```sql
-- Run this in SQL Editor if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;
```

## 🔑 Environment Variables

### 1. Create `.env` file
Copy `env.example` to `.env` and fill in your values:

```bash
cp env.example .env
```

### 2. Get OpenAI API Key
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create new secret key
3. Set monthly usage limit to $5 in billing settings

### 3. Get Supabase Keys
From your Supabase project **Settings > API**:
- **Project URL** → `SUPABASE_URL`
- **anon public** → `SUPABASE_ANON_KEY`
- **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Add to Vercel
Add environment variables to Vercel:
```bash
vercel env add OPENAI_API_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

## 📊 Initial Data Seeding

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed FAQ Database
```bash
node scripts/seed-faq.js
```

This will:
- Clear existing FAQ entries
- Insert 30 camping-related Q&A pairs
- Generate embeddings for each question
- Store in Supabase with vector search capability

## 🚀 Deployment

### 1. Deploy to Vercel
```bash
git add .
git commit -m "feat: implement AI chatbot with RAG architecture"
git push
```

Vercel will automatically deploy the changes.

### 2. Test API Endpoints
- **Chat API**: `https://your-domain.com/api/chat`
- **Embed FAQ**: `https://your-domain.com/api/embed-faq`

## 🧪 Testing

### 1. Frontend Testing
1. Visit your website
2. Look for floating chat button (bottom right)
3. Click to open chat interface
4. Test with questions like:
   - "Vad kostar det att campa?"
   - "Vilka aktiviteter finns det?"
   - "Hur bokar jag?"

### 2. API Testing
Test the chat API directly:
```bash
curl -X POST https://your-domain.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Vad kostar det att campa?"}'
```

## 📈 Monitoring & Analytics

### 1. Check Usage
Monitor in Supabase dashboard:
```sql
-- Total chats per day
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_questions
FROM pending
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Unanswered questions
SELECT question, created_at 
FROM pending 
ORDER BY created_at DESC 
LIMIT 10;
```

### 2. Success Metrics
After 2 weeks, evaluate:
- **Chats per day** (target: >10)
- **Unanswered rate** (target: <40%)

If metrics are poor, consider removing chat button.

## 🛠️ Maintenance

### 1. Adding New FAQs
Use the embed API to add new Q&A pairs:
```bash
curl -X POST https://your-domain.com/api/embed-faq \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Ny fråga?",
    "answer": "Nytt svar här."
  }'
```

### 2. Reviewing Unanswered Questions
1. Check `pending` table in Supabase
2. Staff can add answers in Supabase Studio
3. System automatically creates FAQ entries when answers are added

### 3. Cost Management
- Monitor OpenAI usage in [Usage Dashboard](https://platform.openai.com/usage)
- $5/month budget should handle ~1000 queries
- Embedding costs: ~$0.01 per 1000 questions

## 🎯 Features Implemented

✅ **RAG Architecture** - Vector search with 0.82 similarity threshold  
✅ **Rate Limiting** - 10 requests per 10 minutes per IP  
✅ **Fallback System** - Static FAQ when API fails  
✅ **Continuous Learning** - Unanswered questions logged  
✅ **Multi-language** - Swedish interface with i18n support  
✅ **Responsive UI** - Mobile-first chat interface  
✅ **Confidence Indicators** - Shows answer reliability  
✅ **Beta Labeling** - Clear disclaimers for users  
✅ **Professional Integration** - Matches site design  

## 🔧 Troubleshooting

### API Not Working
1. Check Vercel function logs
2. Verify environment variables
3. Test Supabase connection
4. Check OpenAI API quota

### No Chat Button
1. Clear browser cache
2. Check console for JavaScript errors
3. Verify component imports

### Poor Answers
1. Review FAQ database quality
2. Add more specific Q&A pairs
3. Adjust similarity threshold in `/api/chat.js`

## 🚨 Important Notes

- **Beta Status**: Always show beta disclaimers
- **Cost Control**: Monitor OpenAI usage closely
- **Data Privacy**: No personal data stored in vectors
- **Fallback**: System degrades gracefully when APIs fail
- **Professional Backup**: Always provide phone number for complex queries

## 📞 Support

For technical issues:
- Check Vercel deployment logs
- Monitor Supabase dashboard
- Review OpenAI usage limits

For business questions:
- Direct users to phone: 0650-132 60
- Keep chatbot focused on basic FAQ items 
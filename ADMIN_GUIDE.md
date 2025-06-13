# Admin Guide - Malnbadens Camping Chatbot

## 🛡️ Security & Rate Limiting

### Multi-Layer Protection System

The chatbot implements comprehensive abuse protection:

#### **Rate Limiting Layers:**
1. **Basic Rate Limit**: 10 requests per 10 minutes per IP
2. **Burst Protection**: Max 3 requests per minute
3. **Daily Limit**: 50 requests per 24 hours per IP
4. **Suspicious Activity Detection**: Automatic flagging and cooldowns

#### **Content Filtering:**
- Message length validation (2-500 characters)
- Repeated identical messages detection
- Rapid-fire request detection
- Pattern-based suspicious content filtering
- Basic profanity filtering

#### **Automatic Responses:**
- **Rate limit exceeded**: 10-minute cooldown
- **Suspicious activity**: 5-30 minute cooldown depending on severity
- **Abuse detected**: 30-minute IP block

## 📊 Monitoring & Analytics

### Admin API Endpoints

#### **1. Pending Questions Management**
```bash
# Get pending questions
GET /api/admin/pending-questions?key=YOUR_ADMIN_KEY&status=pending&limit=50

# Update question status
POST /api/admin/pending-questions
Headers: x-admin-key: YOUR_ADMIN_KEY
Body: {
  "id": "question-uuid",
  "status": "reviewed|added_to_faq|ignored",
  "admin_notes": "Optional notes"
}
```

#### **2. System Monitoring**
```bash
# Get monitoring dashboard data
GET /api/admin/monitoring?key=YOUR_ADMIN_KEY&days=7

# Resolve suspicious activity incident
POST /api/admin/monitoring
Headers: x-admin-key: YOUR_ADMIN_KEY
Body: {
  "incident_id": "incident-uuid",
  "admin_notes": "Resolution notes"
}
```

### Database Views for Analysis

#### **Pending Questions Summary**
```sql
SELECT * FROM pending_questions_summary;
-- Shows daily question counts, unique IPs, and sample questions
```

#### **Suspicious Activity Summary**
```sql
SELECT * FROM suspicious_activity_summary;
-- Shows daily incident counts by IP with reasons
```

## 🔧 FAQ Management

### Adding New FAQs

1. **From Pending Questions:**
   - Review pending questions via admin API
   - Mark relevant questions as "reviewed"
   - Create FAQ entries with proper answers

2. **Manual Addition:**
   ```sql
   INSERT INTO faq (question, answer, embedding) VALUES (
     'Your question here',
     'Your answer here',
     -- Embedding will be generated via API
   );
   ```

### Question Learning System

The system automatically logs all user questions to the `pending` table with:
- Question text
- User IP address
- User agent
- Timestamp
- Status tracking

## 🚨 Security Incident Response

### Suspicious Activity Types

1. **Repeated Messages**: Same message sent multiple times
2. **Rapid Fire**: Too many requests in short time
3. **Invalid Content**: Messages with suspicious patterns
4. **Length Violations**: Messages too short or too long
5. **Pattern Matching**: Spam, profanity, or test patterns

### Response Actions

1. **Automatic**: System applies cooldowns automatically
2. **Manual Review**: Check monitoring dashboard for patterns
3. **IP Blocking**: Extend cooldowns for persistent abuse
4. **Pattern Updates**: Add new suspicious patterns to code

## 📈 Performance Monitoring

### Key Metrics to Track

1. **Request Volume**: Daily/hourly request patterns
2. **Response Quality**: Confidence score distributions
3. **FAQ Hit Rate**: How often FAQs provide direct answers
4. **Abuse Incidents**: Frequency and types of suspicious activity
5. **User Satisfaction**: Indirect via question patterns

### Database Maintenance

#### **Regular Cleanup:**
```sql
-- Clean old pending questions (older than 30 days)
DELETE FROM pending 
WHERE created_at < NOW() - INTERVAL '30 days' 
AND status IN ('ignored', 'added_to_faq');

-- Clean resolved suspicious activity (older than 90 days)
DELETE FROM suspicious_activity 
WHERE created_at < NOW() - INTERVAL '90 days' 
AND resolved = true;
```

## 🔐 Environment Variables

### Required Variables
```env
# Core API Keys
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Admin Access
ADMIN_API_KEY=your-secure-admin-key-here
```

### Security Best Practices

1. **Admin Key**: Use a strong, unique key for admin access
2. **Service Role**: Limit service role permissions in Supabase
3. **HTTPS Only**: Ensure all admin endpoints use HTTPS
4. **IP Whitelisting**: Consider restricting admin access by IP
5. **Audit Logging**: Monitor admin API usage

## 🛠️ Troubleshooting

### Common Issues

1. **High Rate Limit Hits**: Check for legitimate traffic spikes
2. **False Positives**: Review suspicious activity patterns
3. **FAQ Misses**: Analyze pending questions for gaps
4. **Performance Issues**: Monitor database query performance

### Debug Mode

For debugging, temporarily add logging:
```javascript
console.log('Debug info:', { ip, message, rateLimitResult });
```

Remember to remove debug logs before production deployment.

## 📋 Maintenance Checklist

### Daily
- [ ] Check monitoring dashboard for incidents
- [ ] Review new pending questions
- [ ] Monitor system performance

### Weekly
- [ ] Analyze question patterns for FAQ improvements
- [ ] Review and resolve suspicious activity incidents
- [ ] Update content filters if needed

### Monthly
- [ ] Database cleanup (old records)
- [ ] Performance optimization review
- [ ] Security pattern updates
- [ ] FAQ effectiveness analysis

## 🚀 Production Deployment

### Pre-Deployment Checklist
- [ ] All environment variables configured
- [ ] Database schema updated
- [ ] Admin API keys secured
- [ ] Rate limiting tested
- [ ] Monitoring endpoints verified
- [ ] Fallback responses tested

### Post-Deployment Monitoring
- [ ] Monitor error rates
- [ ] Check rate limiting effectiveness
- [ ] Verify FAQ search accuracy
- [ ] Monitor suspicious activity detection 
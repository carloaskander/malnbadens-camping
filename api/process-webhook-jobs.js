import { createClient } from '@supabase/supabase-js';
import https from 'https';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Process webhook jobs asynchronously
async function processWebhookJobs() {
  console.log('🔄 Starting webhook job processing...');
  
  let processed = 0;
  let failed = 0;
  const maxJobs = 10; // Process up to 10 jobs at once
  
  try {
    // Get pending jobs
    const { data: jobs, error } = await supabase
      .rpc('get_next_webhook_job')
      .limit(maxJobs);
    
    if (error) {
      console.error('❌ Error fetching jobs:', error);
      return { success: false, error: error.message };
    }
    
    if (!jobs || jobs.length === 0) {
      console.log('📋 No pending webhook jobs found');
      return { success: true, message: 'No jobs to process', processed: 0, failed: 0 };
    }
    
    console.log(`📋 Found ${jobs.length} pending webhook jobs`);
    
    // Process jobs in parallel (but limit concurrency)
    const promises = jobs.map(job => processWebhookJob(job));
    const results = await Promise.allSettled(promises);
    
    // Count results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.success) {
        processed++;
        console.log(`✅ Job ${jobs[index].job_id} processed successfully`);
      } else {
        failed++;
        console.log(`❌ Job ${jobs[index].job_id} failed:`, result.reason || result.value?.error);
      }
    });
    
    console.log(`🏁 Webhook job processing complete: ${processed} success, ${failed} failed`);
    
    return { 
      success: true, 
      message: `Processed ${processed} jobs, ${failed} failed`,
      processed,
      failed,
      totalJobs: jobs.length
    };
    
  } catch (error) {
    console.error('❌ Error processing webhook jobs:', error);
    return { success: false, error: error.message };
  }
}

// Process a single webhook job
async function processWebhookJob(job) {
  const { job_id, question_id, webhook_url, payload, attempts } = job;
  
  try {
    console.log(`🔄 Processing job ${job_id} for question ${question_id} (attempt ${attempts + 1})`);
    
    // Make HTTP request to Discord bot
    const response = await makeHttpRequest(webhook_url, payload);
    
    if (response.success) {
      // Mark job as completed
      await supabase.rpc('complete_webhook_job', { job_id });
      console.log(`✅ Job ${job_id} completed successfully`);
      return { success: true, jobId: job_id };
    } else {
      // Mark job as failed
      await supabase.rpc('fail_webhook_job', { 
        job_id, 
        error_msg: response.error || 'HTTP request failed' 
      });
      console.log(`❌ Job ${job_id} failed: ${response.error}`);
      return { success: false, jobId: job_id, error: response.error };
    }
    
  } catch (error) {
    console.error(`❌ Error processing job ${job_id}:`, error);
    
    // Mark job as failed
    await supabase.rpc('fail_webhook_job', { 
      job_id, 
      error_msg: error.message 
    });
    
    return { success: false, jobId: job_id, error: error.message };
  }
}

// Make HTTP request to webhook URL
async function makeHttpRequest(url, payload) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(payload);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 30000 // 30 second timeout
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, status: res.statusCode, data });
        } else {
          resolve({ 
            success: false, 
            error: `HTTP ${res.statusCode}: ${data}`,
            status: res.statusCode 
          });
        }
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({ success: false, error: 'Request timeout' });
    });
    
    req.on('error', (error) => {
      resolve({ success: false, error: error.message });
    });
    
    req.write(postData);
    req.end();
  });
}

// Cleanup old completed jobs
async function cleanupOldJobs() {
  try {
    const { data: deletedCount, error } = await supabase
      .rpc('cleanup_old_webhook_jobs');
    
    if (error) {
      console.error('❌ Error cleaning up old jobs:', error);
      return { success: false, error: error.message };
    }
    
    console.log(`🧹 Cleaned up ${deletedCount} old webhook jobs`);
    return { success: true, deletedCount };
    
  } catch (error) {
    console.error('❌ Error in cleanup:', error);
    return { success: false, error: error.message };
  }
}

// API endpoint handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const startTime = Date.now();
    console.log('🚀 Webhook job processor started');
    
    // Process webhook jobs
    const result = await processWebhookJobs();
    
    // Cleanup old jobs (optional)
    if (result.success && result.processed > 0) {
      await cleanupOldJobs();
    }
    
    const duration = Date.now() - startTime;
    console.log(`⏱️ Webhook job processing took ${duration}ms`);
    
    return res.status(200).json({
      ...result,
      duration
    });
    
  } catch (error) {
    console.error('❌ Webhook job processor error:', error);
    return res.status(500).json({ 
      error: 'Job processor error', 
      details: error.message 
    });
  }
} 
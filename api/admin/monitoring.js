import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role key for admin access
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Simple admin authentication
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'your-secure-admin-key';

export default async function handler(req, res) {
  // Check admin authentication
  const apiKey = req.headers['x-admin-key'] || req.query.key;
  if (apiKey !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    return await getMonitoringData(req, res);
  } else if (req.method === 'POST') {
    return await resolveIncident(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function getMonitoringData(req, res) {
  try {
    const { days = 7 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));
    
    // Get suspicious activity summary
    const { data: suspiciousActivity, error: suspiciousError } = await supabase
      .from('suspicious_activity_summary')
      .select('*')
      .gte('date', daysAgo.toISOString().split('T')[0])
      .order('date', { ascending: false });
    
    if (suspiciousError) {
      console.error('Error fetching suspicious activity:', suspiciousError);
    }
    
    // Get recent suspicious incidents (unresolved)
    const { data: recentIncidents, error: incidentsError } = await supabase
      .from('suspicious_activity')
      .select('*')
      .eq('resolved', false)
      .gte('created_at', daysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (incidentsError) {
      console.error('Error fetching recent incidents:', incidentsError);
    }
    
    // Get pending questions summary
    const { data: pendingSummary, error: pendingError } = await supabase
      .from('pending_questions_summary')
      .select('*')
      .gte('date', daysAgo.toISOString().split('T')[0])
      .order('date', { ascending: false });
    
    if (pendingError) {
      console.error('Error fetching pending summary:', pendingError);
    }
    
    // Get system statistics
    const { data: faqCount, error: faqError } = await supabase
      .from('faq')
      .select('id', { count: 'exact' });
    
    const { data: totalPending, error: totalPendingError } = await supabase
      .from('pending')
      .select('id', { count: 'exact' })
      .eq('status', 'pending');
    
    const { data: totalSuspicious, error: totalSuspiciousError } = await supabase
      .from('suspicious_activity')
      .select('id', { count: 'exact' })
      .eq('resolved', false);
    
    // Calculate rate limit statistics (this would be from memory in production)
    const stats = {
      faq_count: faqCount?.length || 0,
      pending_questions: totalPending?.length || 0,
      unresolved_incidents: totalSuspicious?.length || 0,
      monitoring_period_days: parseInt(days)
    };
    
    return res.status(200).json({
      stats,
      suspicious_activity: suspiciousActivity || [],
      recent_incidents: recentIncidents || [],
      pending_summary: pendingSummary || [],
      generated_at: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error in getMonitoringData:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function resolveIncident(req, res) {
  try {
    const { incident_id, admin_notes } = req.body;
    
    if (!incident_id) {
      return res.status(400).json({ error: 'Incident ID is required' });
    }
    
    const { data, error } = await supabase
      .from('suspicious_activity')
      .update({ 
        resolved: true,
        admin_notes,
        resolved_at: new Date().toISOString()
      })
      .eq('id', incident_id)
      .select();
    
    if (error) {
      console.error('Error resolving incident:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    
    return res.status(200).json({ 
      message: 'Incident resolved successfully',
      incident: data[0]
    });
    
  } catch (error) {
    console.error('Error in resolveIncident:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 
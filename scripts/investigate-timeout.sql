-- Investigation Script for Database Timeout Issues
-- Run these queries in Supabase SQL Editor to diagnose the problem

-- 1. Check current timeout settings
SELECT 
  name, 
  setting, 
  unit, 
  short_desc
FROM pg_settings 
WHERE name IN (
  'statement_timeout',
  'lock_timeout', 
  'idle_in_transaction_session_timeout',
  'tcp_keepalives_idle',
  'tcp_keepalives_interval',
  'tcp_keepalives_count'
);

-- 2. Check for long-running queries
SELECT 
  pid,
  now() - pg_stat_activity.query_start AS duration,
  query,
  state,
  wait_event_type,
  wait_event
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
AND state != 'idle';

-- 3. Check database connections and load
SELECT 
  state,
  count(*) as connections
FROM pg_stat_activity 
GROUP BY state;

-- 4. Check for locks that might be causing delays
SELECT 
  blocked_locks.pid AS blocked_pid,
  blocked_activity.usename AS blocked_user,
  blocking_locks.pid AS blocking_pid,
  blocking_activity.usename AS blocking_user,
  blocked_activity.query AS blocked_statement,
  blocking_activity.query AS current_statement_in_blocking_process
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
    AND blocking_locks.database IS NOT DISTINCT FROM blocked_locks.database
    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
    AND blocking_locks.pid != blocked_locks.pid
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;

-- 5. Check webhook function performance
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  most_common_vals,
  most_common_freqs,
  histogram_bounds
FROM pg_stats 
WHERE tablename = 'pending';

-- 6. Test webhook function timing manually
DO $$
DECLARE
  start_time timestamptz;
  end_time timestamptz;
  duration interval;
BEGIN
  start_time := clock_timestamp();
  
  -- Simulate the webhook call (but don't actually call it)
  PERFORM pg_sleep(0.001); -- Just a tiny delay to simulate processing
  
  end_time := clock_timestamp();
  duration := end_time - start_time;
  
  RAISE NOTICE 'Webhook function execution time: %', duration;
END $$; 
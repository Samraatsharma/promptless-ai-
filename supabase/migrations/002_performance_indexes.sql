-- ============================================================================
-- PROMPTLESS AI - SQL MIGRATION 002: PERFORMANCE & QUERY OPTIMIZATION INDEXES
-- ============================================================================
-- Author: Promptless AI Engineering Team
-- Purpose: Creates B-tree compound indexes to guarantee sub-millisecond
-- latency for SaaS dashboard queries, bookmark filters, and analytics.

-- 1. Index for loading user's recent generated outputs ordered by newest first
CREATE INDEX IF NOT EXISTS idx_generated_content_user_created 
ON public.generated_content (user_id, created_at DESC);

-- 2. Compound index for instantly filtering bookmarked/saved items in the dashboard
CREATE INDEX IF NOT EXISTS idx_generated_content_saved 
ON public.generated_content (user_id, is_saved, created_at DESC);

-- 3. Index for platform-level and action-type usage analytics queries
CREATE INDEX IF NOT EXISTS idx_generated_content_platform 
ON public.generated_content (platform, action_type);

-- 4. Index for user activity audit logs ordered chronologically
CREATE INDEX IF NOT EXISTS idx_activity_history_user_created 
ON public.activity_history (user_id, created_at DESC);

-- 5. Index for fast email lookup on public.users
CREATE INDEX IF NOT EXISTS idx_users_email 
ON public.users (email);

-- Log migration confirmation
COMMENT ON TABLE public.generated_content IS 'Venture-grade AI generated markdown outputs with B-tree compound performance indexes.';

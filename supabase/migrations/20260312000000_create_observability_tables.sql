-- Observability tables for custom DB-backed monitoring
-- Replaces Datadog APM/RUM with zero-cost self-hosted observability

-- 1. System Events (structured logs)
CREATE TABLE IF NOT EXISTS system_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('info', 'warn', 'critical')),
  source text NOT NULL,
  message text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_system_events_created_at ON system_events (created_at DESC);
CREATE INDEX idx_system_events_event_type ON system_events (event_type);
CREATE INDEX idx_system_events_severity ON system_events (severity);

-- 2. Health Checks
CREATE TABLE IF NOT EXISTS health_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  status text NOT NULL CHECK (status IN ('ok', 'degraded', 'down')),
  response_time_ms integer NOT NULL DEFAULT 0,
  error_message text,
  checked_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_health_checks_checked_at ON health_checks (checked_at DESC);
CREATE INDEX idx_health_checks_service ON health_checks (service);

-- 3. Agent Alerts
CREATE TABLE IF NOT EXISTS agent_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  agent_name text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('info', 'warn', 'critical')),
  title text NOT NULL,
  message text NOT NULL,
  metadata jsonb DEFAULT '{}',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'resolved', 'dismissed')),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_agent_alerts_status ON agent_alerts (status);
CREATE INDEX idx_agent_alerts_created_at ON agent_alerts (created_at DESC);
CREATE INDEX idx_agent_alerts_agent_name ON agent_alerts (agent_name);

-- 4. AI Usage Logs
CREATE TABLE IF NOT EXISTS ai_usage_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  tool_name text NOT NULL,
  model_id text NOT NULL,
  input_tokens integer NOT NULL DEFAULT 0,
  output_tokens integer NOT NULL DEFAULT 0,
  cache_creation_tokens integer NOT NULL DEFAULT 0,
  cache_read_tokens integer NOT NULL DEFAULT 0,
  estimated_cost_usd numeric(10, 6) NOT NULL DEFAULT 0,
  subsidy_id text,
  section_key text,
  plan text,
  duration_ms integer,
  error_kind text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_usage_logs_created_at ON ai_usage_logs (created_at DESC);
CREATE INDEX idx_ai_usage_logs_user_id ON ai_usage_logs (user_id);
CREATE INDEX idx_ai_usage_logs_tool_name ON ai_usage_logs (tool_name);

-- RLS: service_role can INSERT, admin users can SELECT
ALTER TABLE system_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Service role bypass (for server-side inserts)
CREATE POLICY "service_role_all_system_events" ON system_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_health_checks" ON health_checks
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_agent_alerts" ON agent_alerts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_ai_usage_logs" ON ai_usage_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Admin read access
CREATE POLICY "admin_read_system_events" ON system_events
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admin_read_health_checks" ON health_checks
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admin_read_agent_alerts" ON agent_alerts
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admin_read_ai_usage_logs" ON ai_usage_logs
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));

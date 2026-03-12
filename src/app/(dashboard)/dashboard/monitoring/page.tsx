import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
  title: "監視ダッシュボード",
};

type HealthCheck = {
  service: string;
  status: string;
  response_time_ms: number;
  error_message: string | null;
  checked_at: string;
};

type SystemEvent = {
  event_type: string;
  severity: string;
  source: string;
  message: string;
  created_at: string;
};

type AgentAlert = {
  id: string;
  agent_name: string;
  severity: string;
  title: string;
  message: string;
  status: string;
  created_at: string;
};

type AiUsageSummary = {
  total_requests: number;
  total_cost_usd: number;
  total_input_tokens: number;
  total_output_tokens: number;
};

export default async function MonitoringPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Admin check
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/dashboard");

  // Fetch monitoring data in parallel
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [healthResult, errorsResult, alertsResult, aiUsageResult, webVitalsResult] = await Promise.all([
    supabase
      .from("health_checks")
      .select("service, status, response_time_ms, error_message, checked_at")
      .order("checked_at", { ascending: false })
      .limit(20),
    supabase
      .from("system_events")
      .select("event_type, severity, source, message, created_at")
      .eq("severity", "critical")
      .gte("created_at", oneDayAgo)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("agent_alerts")
      .select("id, agent_name, severity, title, message, status, created_at")
      .in("status", ["open", "acknowledged"])
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("ai_usage_logs")
      .select("estimated_cost_usd, input_tokens, output_tokens")
      .gte("created_at", sevenDaysAgo),
    supabase
      .from("system_events")
      .select("metadata, created_at")
      .eq("event_type", "web_vital")
      .gte("created_at", oneDayAgo)
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const healthChecks = (healthResult.data ?? []) as HealthCheck[];
  const recentErrors = (errorsResult.data ?? []) as SystemEvent[];
  const activeAlerts = (alertsResult.data ?? []) as AgentAlert[];
  const aiUsageRows = aiUsageResult.data ?? [];
  const webVitals = webVitalsResult.data ?? [];

  // Aggregate AI usage
  const aiSummary: AiUsageSummary = aiUsageRows.reduce(
    (acc, row) => ({
      total_requests: acc.total_requests + 1,
      total_cost_usd: acc.total_cost_usd + (Number(row.estimated_cost_usd) || 0),
      total_input_tokens: acc.total_input_tokens + (Number(row.input_tokens) || 0),
      total_output_tokens: acc.total_output_tokens + (Number(row.output_tokens) || 0),
    }),
    { total_requests: 0, total_cost_usd: 0, total_input_tokens: 0, total_output_tokens: 0 }
  );

  // Get latest health per service
  const latestHealth = new Map<string, HealthCheck>();
  for (const check of healthChecks) {
    if (!latestHealth.has(check.service)) {
      latestHealth.set(check.service, check);
    }
  }

  // Web Vitals averages
  const vitalsByName = new Map<string, number[]>();
  for (const v of webVitals) {
    const meta = v.metadata as Record<string, unknown> | null;
    if (meta?.name && meta?.value) {
      const name = meta.name as string;
      if (!vitalsByName.has(name)) vitalsByName.set(name, []);
      vitalsByName.get(name)!.push(Number(meta.value));
    }
  }

  const severityColor = (s: string) =>
    s === "critical" ? "text-red-600 bg-red-50" : s === "warn" ? "text-yellow-600 bg-yellow-50" : "text-blue-600 bg-blue-50";

  const statusColor = (s: string) =>
    s === "ok" ? "text-green-600" : s === "degraded" ? "text-yellow-600" : "text-red-600";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">監視ダッシュボード</h1>

      {/* Service Health */}
      <section>
        <h2 className="text-lg font-semibold mb-3">サービスヘルス</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from(latestHealth.values()).map((check) => (
            <div key={check.service} className="border rounded-lg p-4">
              <div className="text-sm text-gray-500">{check.service}</div>
              <div className={`text-lg font-bold ${statusColor(check.status)}`}>
                {check.status.toUpperCase()}
              </div>
              <div className="text-xs text-gray-400">{check.response_time_ms}ms</div>
              {check.error_message && (
                <div className="text-xs text-red-500 mt-1 truncate">{check.error_message}</div>
              )}
            </div>
          ))}
          {latestHealth.size === 0 && (
            <div className="col-span-4 text-gray-400 text-sm">ヘルスチェックデータなし</div>
          )}
        </div>
      </section>

      {/* AI Usage (7 days) */}
      <section>
        <h2 className="text-lg font-semibold mb-3">AI 使用量（7日間）</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4">
            <div className="text-sm text-gray-500">リクエスト数</div>
            <div className="text-2xl font-bold">{aiSummary.total_requests}</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-sm text-gray-500">推定コスト</div>
            <div className="text-2xl font-bold">${aiSummary.total_cost_usd.toFixed(2)}</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-sm text-gray-500">入力トークン</div>
            <div className="text-2xl font-bold">{(aiSummary.total_input_tokens / 1000).toFixed(1)}K</div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="text-sm text-gray-500">出力トークン</div>
            <div className="text-2xl font-bold">{(aiSummary.total_output_tokens / 1000).toFixed(1)}K</div>
          </div>
        </div>
      </section>

      {/* Web Vitals */}
      {vitalsByName.size > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Web Vitals（24時間平均）</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from(vitalsByName.entries()).map(([name, values]) => {
              const avg = values.reduce((a, b) => a + b, 0) / values.length;
              return (
                <div key={name} className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500">{name}</div>
                  <div className="text-xl font-bold">{avg.toFixed(name === "CLS" ? 3 : 0)}</div>
                  <div className="text-xs text-gray-400">{values.length} samples</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Active Alerts */}
      <section>
        <h2 className="text-lg font-semibold mb-3">
          アクティブアラート
          {activeAlerts.length > 0 && (
            <span className="ml-2 text-sm text-red-600">({activeAlerts.length}件)</span>
          )}
        </h2>
        {activeAlerts.length === 0 ? (
          <p className="text-gray-400 text-sm">アクティブなアラートはありません</p>
        ) : (
          <div className="space-y-2">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${severityColor(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs text-gray-400">{alert.agent_name}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(alert.created_at).toLocaleString("ja-JP")}
                  </span>
                </div>
                <div className="font-medium mt-1">{alert.title}</div>
                <div className="text-sm text-gray-600 mt-1">{alert.message}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Errors */}
      <section>
        <h2 className="text-lg font-semibold mb-3">エラータイムライン（24時間）</h2>
        {recentErrors.length === 0 ? (
          <p className="text-gray-400 text-sm">直近24時間のcriticalエラーなし</p>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {recentErrors.map((event, i) => (
              <div key={i} className="flex items-start gap-2 text-sm border-b py-2">
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(event.created_at).toLocaleTimeString("ja-JP")}
                </span>
                <span className="text-xs text-gray-500">[{event.source}]</span>
                <span className="text-gray-700">{event.message}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

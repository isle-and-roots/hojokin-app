export default function DashboardLoading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded mb-4" />
      <div className="h-4 w-64 bg-muted rounded mb-8" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="h-5 w-40 bg-muted rounded mb-3" />
            <div className="h-4 w-full bg-muted rounded mb-2" />
            <div className="h-4 w-3/4 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

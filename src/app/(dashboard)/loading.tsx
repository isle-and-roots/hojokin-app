export default function DashboardLoading() {
  return (
    <div className="p-8">
      <div className="h-8 w-48 rounded mb-4 skeleton-shimmer" />
      <div className="h-4 w-64 rounded mb-8 skeleton-shimmer" />
      <div className="space-y-4 stagger-children">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="h-5 w-40 rounded mb-3 skeleton-shimmer" />
            <div className="h-4 w-full rounded mb-2 skeleton-shimmer" />
            <div className="h-4 w-3/4 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}

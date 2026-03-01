export default function ApplicationsLoading() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-8 w-32 rounded mb-2 skeleton-shimmer" />
          <div className="h-4 w-56 rounded skeleton-shimmer" />
        </div>
        <div className="h-10 w-28 rounded-lg skeleton-shimmer" />
      </div>
      <div className="space-y-3 stagger-children">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 rounded skeleton-shimmer" />
              <div>
                <div className="h-5 w-48 rounded mb-2 skeleton-shimmer" />
                <div className="h-4 w-32 rounded skeleton-shimmer" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-16 rounded-full skeleton-shimmer" />
              <div className="h-8 w-8 rounded-lg skeleton-shimmer" />
              <div className="h-8 w-8 rounded-lg skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

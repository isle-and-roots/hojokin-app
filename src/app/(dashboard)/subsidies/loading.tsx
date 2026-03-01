export default function SubsidiesLoading() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="h-8 w-40 rounded mb-2 skeleton-shimmer" />
        <div className="h-4 w-64 rounded skeleton-shimmer" />
      </div>
      <div className="mb-6 h-10 w-full rounded-lg skeleton-shimmer" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 stagger-children">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="h-5 w-3/4 rounded mb-3 skeleton-shimmer" />
            <div className="h-4 w-full rounded mb-2 skeleton-shimmer" />
            <div className="h-4 w-2/3 rounded mb-4 skeleton-shimmer" />
            <div className="flex items-center gap-2">
              <div className="h-6 w-16 rounded-full skeleton-shimmer" />
              <div className="h-6 w-20 rounded-full skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

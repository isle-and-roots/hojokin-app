export default function NewApplicationLoading() {
  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-64 rounded mb-2 skeleton-shimmer" />
          <div className="h-4 w-80 rounded skeleton-shimmer" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-24 rounded skeleton-shimmer" />
          <div className="h-10 w-48 rounded-lg skeleton-shimmer" />
        </div>
      </div>
      <div className="mb-6 rounded-lg bg-muted p-3">
        <div className="h-4 w-40 rounded mb-2 skeleton-shimmer" />
        <div className="h-2 rounded-full bg-border" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="hidden lg:block lg:col-span-4 space-y-2 stagger-children">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-full rounded-lg skeleton-shimmer" />
          ))}
        </div>
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="h-6 w-48 rounded mb-4 skeleton-shimmer" />
            <div className="space-y-3 stagger-children">
              <div className="h-4 w-full rounded skeleton-shimmer" />
              <div className="h-4 w-full rounded skeleton-shimmer" />
              <div className="h-4 w-3/4 rounded skeleton-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

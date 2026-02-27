export default function ApplicationsLoading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-muted rounded mb-2" />
          <div className="h-4 w-56 bg-muted rounded" />
        </div>
        <div className="h-10 w-28 bg-muted rounded-lg" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-muted rounded" />
              <div>
                <div className="h-5 w-48 bg-muted rounded mb-2" />
                <div className="h-4 w-32 bg-muted rounded" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-6 w-16 bg-muted rounded-full" />
              <div className="h-8 w-8 bg-muted rounded-lg" />
              <div className="h-8 w-8 bg-muted rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

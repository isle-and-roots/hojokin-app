export default function NewApplicationLoading() {
  return (
    <div className="p-4 sm:p-8 animate-pulse">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-64 bg-muted rounded mb-2" />
          <div className="h-4 w-80 bg-muted rounded" />
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-24 bg-muted rounded" />
          <div className="h-10 w-48 bg-muted rounded-lg" />
        </div>
      </div>
      <div className="mb-6 rounded-lg bg-muted p-3">
        <div className="h-4 w-40 bg-muted/70 rounded mb-2" />
        <div className="h-2 rounded-full bg-border" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="hidden lg:block lg:col-span-4 space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-full bg-muted rounded-lg" />
          ))}
        </div>
        <div className="lg:col-span-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="h-6 w-48 bg-muted rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

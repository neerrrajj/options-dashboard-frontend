export default function PositionalLoading() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Filter skeleton */}
      <div className="h-16 bg-muted rounded-lg animate-pulse" />
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
      </div>
      
      {/* Table skeleton */}
      <div className="h-[500px] bg-muted rounded-lg animate-pulse" />
    </div>
  );
}

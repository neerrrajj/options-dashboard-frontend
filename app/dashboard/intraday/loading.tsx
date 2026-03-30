export default function IntradayLoading() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Filter skeleton */}
      <div className="h-16 bg-muted rounded-lg animate-pulse" />
      
      {/* Chart skeletons */}
      <div className="space-y-6">
        <div className="h-[400px] bg-muted rounded-lg animate-pulse" />
        <div className="h-[400px] bg-muted rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

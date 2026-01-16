export function LoadingSkeleton() {
  return (
    <div className="bg-white md:rounded-4xl md:border border-gray-100 md:shadow-sm p-8 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-20 bg-gray-50 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

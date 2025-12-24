export default function Loading() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-28 bg-gray-200 rounded" />
        <div className="h-28 bg-gray-200 rounded" />
        <div className="h-28 bg-gray-200 rounded" />
      </div>
      <div className="h-64 bg-gray-200 rounded" />
    </div>
  );
}

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
      <p>You don't have permission to view this page.</p>
    </div>
  );
}

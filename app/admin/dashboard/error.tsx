"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-600">Dashboard lỗi</h1>
      <p className="mt-2 text-muted-foreground">{error.message}</p>

      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Thử lại
      </button>
    </div>
  );
}

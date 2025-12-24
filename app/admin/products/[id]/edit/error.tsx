"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold text-red-600">Không tải được sản phẩm</h2>
      <p className="text-muted-foreground mt-2">{error.message}</p>

      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Thử lại
      </button>
    </div>
  );
}

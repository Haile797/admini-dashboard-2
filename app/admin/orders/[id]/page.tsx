export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import StatusButtons from "@/components/admin/orders/StatusButtons";

type OrderItemDTO = {
  id: string;
  price: number;
  quantity: number;
  product: {
    name: string;
  };
};

export default async function OrderDetailPage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      orderItems: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    return <div className="p-8">Không tìm thấy đơn hàng</div>;
  }

  const orderItems = order.orderItems as OrderItemDTO[];

  // 🔥 Tính tổng tiền (STRICT TYPE)
  const calculatedTotal = orderItems.reduce(
    (sum: number, item: OrderItemDTO) =>
      sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Chi tiết đơn hàng</h1>

      {/* ==== Order Summary + Status ==== */}
      <div className="p-6 border rounded-lg bg-white shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg">
              <strong>Mã đơn:</strong> {order.id}
            </p>
            <p className="text-lg mt-1">
              <strong>Khách hàng:</strong>{" "}
              {order.user.name} ({order.user.email})
            </p>
            <p className="text-lg mt-1">
              <strong>Ngày tạo:</strong>{" "}
              {order.createdAt.toLocaleDateString()}
            </p>
          </div>

          {/* Badge Trạng thái */}
          <span
            className={`
              px-4 py-2 rounded-full text-white font-semibold
              ${order.status === "pending" ? "bg-blue-500" : ""}
              ${order.status === "completed" ? "bg-green-600" : ""}
              ${order.status === "cancelled" ? "bg-red-600" : ""}
            `}
          >
            {order.status === "pending" && "Đang xử lý"}
            {order.status === "completed" && "Hoàn thành"}
            {order.status === "cancelled" && "Đã hủy"}
          </span>
        </div>

        {/* Buttons update status */}
        <StatusButtons
          orderId={order.id}
          currentStatus={order.status}
        />

        {/* Tổng tiền */}
        <p className="text-xl font-bold mt-4">
          Tổng tiền:{" "}
          <span className="text-green-700">
            {calculatedTotal.toLocaleString("vi-VN")} ₫
          </span>
        </p>
      </div>

      {/* ==== Order Items Table ==== */}
      <div className="p-6 border rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Sản phẩm</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">Sản phẩm</th>
              <th className="p-3 text-center">Giá</th>
              <th className="p-3 text-center">Số lượng</th>
              <th className="p-3 text-center">Tổng</th>
            </tr>
          </thead>

          <tbody>
            {orderItems.map((item: OrderItemDTO) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{item.product.name}</td>
                <td className="p-3 text-center">
                  {item.price.toLocaleString("vi-VN")} ₫
                </td>
                <td className="p-3 text-center">
                  {item.quantity}
                </td>
                <td className="p-3 text-center font-semibold">
                  {(item.price * item.quantity).toLocaleString(
                    "vi-VN"
                  )}{" "}
                  ₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

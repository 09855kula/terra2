"use client";
import { trpc } from "@/lib/trpc/client";
import { formatDollars } from "@/lib/utils/discount";
import Link from "next/link";

export default function OrdersPage() {
  const { data: orders = [], isLoading } = trpc.orders.getHistory.useQuery();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-zinc-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col max-w-2xl mx-auto w-full px-4 py-6 gap-4">
      <h1 className="text-xl font-bold text-white">Order history</h1>
      {orders.length === 0 ? (
        <p className="text-zinc-400">No orders yet.</p>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => {
            const date = order.deliveryDate
              ? new Date(order.deliveryDate).toLocaleDateString("en-CA", {
                  month: "short",
                  day: "numeric",
                })
              : new Date(order.createdAt).toLocaleDateString("en-CA", {
                  month: "short",
                  day: "numeric",
                });
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 hover:border-zinc-700 transition-colors"
              >
                <div>
                  <p className="font-medium text-white">Order #{order.id}</p>
                  <p className="text-sm text-zinc-400">{date}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">
                    {formatDollars(order.totalAfterDiscount)}
                  </p>
                  <p className="text-xs text-zinc-500 capitalize">
                    {order.status}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

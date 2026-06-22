"use client";
import { use } from "react";
import { trpc } from "@/lib/trpc/client";
import { formatDollars } from "@/lib/utils/discount";
import Link from "next/link";

export default function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: order, isLoading } = trpc.orders.byId.useQuery({
    id: parseInt(id),
  });

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-zinc-500">
        Loading…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-1 items-center justify-center text-zinc-500">
        Order not found
      </div>
    );
  }

  const deliveryDate = order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleDateString("en-CA", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div className="flex flex-1 flex-col max-w-2xl mx-auto w-full px-4 py-6 gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Order #{order.id}</h1>
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300 capitalize">
          {order.status}
        </span>
      </div>

      {deliveryDate && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 space-y-1">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">
            Delivery
          </p>
          <p className="text-white">
            {deliveryDate}
            {order.timeslot ? ` · ${order.timeslot}` : ""}
          </p>
          {order.address && (
            <p className="text-sm text-zinc-400">{order.address}</p>
          )}
        </div>
      )}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between px-4 py-3 text-sm">
            <span className="text-zinc-300">
              {item.productName} × {item.quantity}
            </span>
            <span className="text-white">{formatDollars(item.lineTotal)}</span>
          </div>
        ))}
        <div className="flex justify-between px-4 py-3 font-semibold text-white">
          <span>Total</span>
          <span>{formatDollars(order.totalAfterDiscount)}</span>
        </div>
      </div>

      {order.comment && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 space-y-1">
          <p className="text-xs text-zinc-500 uppercase tracking-wide">
            Instructions
          </p>
          <p className="text-sm text-zinc-300">{order.comment}</p>
        </div>
      )}

      <Link
        href="/orders"
        className="text-center text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        ← Order history
      </Link>
    </div>
  );
}

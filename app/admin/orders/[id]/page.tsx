"use client";
import { use } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { formatDollars } from "@/lib/utils/discount";
import { formatQuantityLabel } from "@/lib/utils/sizeOptions";
import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { DeliveryUpdateButtons } from "@/components/admin/DeliveryUpdateButtons";
import { StatusSelect } from "@/components/admin/StatusSelect";

function formatDateTime(value: string | Date | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const orderId = parseInt(id);

  const { data: order, isLoading } = trpc.admin.orders.byId.useQuery({ id: orderId });

  if (isLoading) return <LoadingScreen />;
  if (!order) return <LoadingScreen>Order not found</LoadingScreen>;

  const customerName =
    [order.customer.firstName, order.customer.lastName].filter(Boolean).join(" ") || "Customer";

  const subtotal = parseFloat(order.total ?? "0");
  const grandTotal = parseFloat(order.totalAfterDiscount ?? "0");
  const discount = subtotal - grandTotal;

  return (
    <PageWrapper className="gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="text-[#616A5C] opacity-70 hover:opacity-100 text-sm transition-opacity"
          >
            ←
          </Link>
          <h1 className="text-xl font-bold text-[#37751A]">
            Order #{order.orderNumber ?? order.id}
          </h1>
        </div>
        <span className="rounded-full border-[2px] border-[#c8d9c2] text-[#3A6426] px-3 py-1 text-xs font-semibold capitalize">
          {order.status.replace(/_/g, " ")}
        </span>
      </div>

      {/* Delivery update */}
      <Card className="px-5 py-4 space-y-3">
        <SectionLabel>Delivery update</SectionLabel>
        <DeliveryUpdateButtons orderId={order.id} />
      </Card>

      {/* Customer */}
      <Card className="px-5 py-4 space-y-1">
        <SectionLabel>Customer</SectionLabel>
        <Link
          href={`/admin/customers/${order.customer.id}`}
          className="text-[#37751A] font-semibold text-[15px] hover:underline"
        >
          {customerName}
        </Link>
        <p className="text-sm text-[#616A5C] opacity-80">{order.customer.phone}</p>
        <p className="text-sm text-[#616A5C] opacity-80">{order.district?.name ?? "No district"}</p>
        <p className="text-sm text-[#616A5C] opacity-80">{order.address ?? "No address on file"}</p>
      </Card>

      {/* Delivery */}
      <Card className="px-5 py-4 space-y-1">
        <SectionLabel>Delivery</SectionLabel>
        <p className="text-sm text-[#616A5C]">
          <span className="opacity-70">Time slot: </span>
          {order.timeslot ?? "—"}
        </p>
        <p className="text-sm text-[#616A5C]">
          <span className="opacity-70">Cutoff: </span>
          {order.cutOffs ?? "—"}
        </p>
        <p className="text-sm text-[#616A5C]">
          <span className="opacity-70">Order date: </span>
          {formatDateTime(order.createdAt)}
        </p>
        <p className="text-sm text-[#616A5C]">
          <span className="opacity-70">Completed: </span>
          {formatDateTime(order.completedAt)}
        </p>
      </Card>

      {/* Items */}
      <Card className="overflow-hidden">
        {order.items.map((item, idx) => (
          <div
            key={item.id}
            className={`flex justify-between px-5 py-3.5 text-sm ${
              idx < order.items.length - 1 ? "border-b border-[#6CAC4F]/20" : ""
            }`}
          >
            <span className="text-[#616A5C] flex items-center gap-1.5">
              {item.productName}{" "}
              {item.unitOfMeasure
                ? `· ${formatQuantityLabel(item.unitOfMeasure, item.shownAs, item.quantity)}`
                : `× ${item.quantity}`}
              {item.lineTotal === "0.00" && (
                <span className="text-[9px] uppercase tracking-wide font-semibold text-white bg-[#6CAC4F] rounded px-1.5 py-0.5">
                  Gift
                </span>
              )}
            </span>
            <span className="text-[#37751A] font-semibold">{formatDollars(item.lineTotal)}</span>
          </div>
        ))}

        <div className="border-t border-[#6CAC4F]/20 px-5 py-3.5 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-[#616A5C] opacity-70">Subtotal</span>
            <span className="text-[#616A5C]">{formatDollars(order.total)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-[#616A5C] opacity-70">Discount</span>
              <span className="text-[#616A5C]">-{formatDollars(discount.toFixed(2))}</span>
            </div>
          )}
          <div className="flex justify-between pt-1">
            <span className="text-[#616A5C] font-medium">Total</span>
            <span className="text-[#4C922C] font-bold text-lg">
              {formatDollars(order.totalAfterDiscount)}
            </span>
          </div>
        </div>

        {order.isUsePoint && (
          <div className="border-t border-[#6CAC4F]/20 px-5 py-3.5 space-y-1">
            <SectionLabel>Points</SectionLabel>
            {order.pointTransactions.length === 0 ? (
              <p className="text-sm text-[#616A5C] opacity-60">No point transactions logged for this order.</p>
            ) : (
              order.pointTransactions.map((tx) => (
                <div key={tx.id} className="flex justify-between text-sm">
                  <span className="text-[#616A5C] opacity-80 capitalize">{tx.reason}</span>
                  <span className={tx.amount < 0 ? "text-red-500" : "text-[#37751A]"}>
                    {tx.amount > 0 ? "+" : ""}
                    {tx.amount} pts
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </Card>

      {/* Notes */}
      {order.comment && (
        <Card className="px-5 py-4 space-y-1">
          <SectionLabel>Notes</SectionLabel>
          <p className="text-sm text-[#616A5C] opacity-90">{order.comment}</p>
        </Card>
      )}

      {/* Status */}
      <Card className="px-5 py-4 space-y-2">
        <SectionLabel>Status</SectionLabel>
        <StatusSelect orderId={order.id} status={order.status} />
      </Card>
    </PageWrapper>
  );
}

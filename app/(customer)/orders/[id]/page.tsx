"use client";
import { use, useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { formatDollars } from "@/lib/utils/discount";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { PageWrapper } from "@/components/ui/PageWrapper";

export default function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [confirming, setConfirming] = useState(false);
  const utils = trpc.useUtils();

  const { data: order, isLoading } = trpc.orders.byId.useQuery({
    id: parseInt(id),
  });

  const cancelOrder = trpc.orders.cancel.useMutation({
    onSuccess: () => {
      utils.orders.byId.invalidate({ id: parseInt(id) });
      utils.orders.getHistory.invalidate();
      setConfirming(false);
    },
    onError: (e) => alert(e.message),
  });

  if (isLoading) return <LoadingScreen />;
  if (!order) return <LoadingScreen>Order not found</LoadingScreen>;

  const deliveryDate = order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleDateString("en-CA", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  const isCancellable = order.status === "pending";
  const isCancelled = order.status === "cancelled";

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/orders"
            className="text-[#616A5C] opacity-70 hover:opacity-100 text-sm transition-opacity"
          >
            ←
          </Link>
          <h1 className="text-xl font-bold text-[#37751A]">Order #{order.id}</h1>
        </div>
        <span
          className={`rounded-full border-[2px] px-3 py-1 text-xs font-semibold capitalize ${
            isCancelled
              ? "border-red-200 text-red-400"
              : "border-[#c8d9c2] text-[#3A6426]"
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Delivery info */}
      {deliveryDate && (
        <Card className="px-5 py-4 space-y-1">
          <SectionLabel>Delivery</SectionLabel>
          <p className="text-[#37751A] font-semibold text-[15px]">
            {deliveryDate}
            {order.timeslot ? ` · ${order.timeslot}` : ""}
          </p>
          {order.address && (
            <p className="text-sm text-[#616A5C] opacity-80">{order.address}</p>
          )}
        </Card>
      )}

      {/* Items */}
      <Card className="overflow-hidden">
        {order.items.map((item, idx) => (
          <div
            key={item.id}
            className={`flex justify-between px-5 py-3.5 text-sm ${
              idx < order.items.length - 1 ? "border-b border-[#6CAC4F]/20" : ""
            }`}
          >
            <span className="text-[#616A5C]">
              {item.productName} × {item.quantity}
            </span>
            <span className="text-[#37751A] font-semibold">
              {formatDollars(item.lineTotal)}
            </span>
          </div>
        ))}
        <div className="flex justify-between px-5 py-4 border-t border-[#6CAC4F]/20">
          <span className="text-[#616A5C] font-medium">Total</span>
          <span className="text-[#4C922C] font-bold text-lg">
            {formatDollars(order.totalAfterDiscount)}
          </span>
        </div>
      </Card>

      {/* Instructions */}
      {order.comment && (
        <Card className="px-5 py-4 space-y-1">
          <SectionLabel>Instructions</SectionLabel>
          <p className="text-sm text-[#616A5C] opacity-90">{order.comment}</p>
        </Card>
      )}

      {/* Cancel */}
      {isCancellable && (
        <div className="mt-2">
          {confirming ? (
            <Card className="px-5 py-4 space-y-3 text-center">
              <p className="text-[#616A5C] text-sm font-medium">Cancel this order?</p>
              <div className="flex gap-3">
                <PillButton
                  onClick={() => setConfirming(false)}
                  variant="outline"
                  className="flex-1 h-12 text-[14px]"
                >
                  Keep order
                </PillButton>
                <PillButton
                  onClick={() => cancelOrder.mutate({ id: order.id })}
                  disabled={cancelOrder.isPending}
                  variant="danger"
                  className="flex-1 h-12 text-[14px]"
                >
                  {cancelOrder.isPending ? "Cancelling…" : "Yes, cancel"}
                </PillButton>
              </div>
            </Card>
          ) : (
            <PillButton
              onClick={() => setConfirming(true)}
              variant="danger"
              className="w-full h-12 text-[14px]"
            >
              Cancel order
            </PillButton>
          )}
        </div>
      )}
    </PageWrapper>
  );
}

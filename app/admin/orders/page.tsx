"use client";
import { useState } from "react";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { formatDollars } from "@/lib/utils/discount";
import { getNowInWinnipeg } from "@/lib/utils/delivery";
import { DELIVERY_UPDATE_LABELS, type DeliveryUpdateStage } from "@/lib/utils/deliveryUpdates";
import { Card } from "@/components/ui/Card";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { PageWrapper } from "@/components/ui/PageWrapper";

type FilterMode = "today" | "tomorrow" | "all" | "custom";

function ymd(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

const inputClass =
  "bg-[#F7F7F7] border-[2px] border-[rgba(217,217,217,0.5)] rounded-xl px-3 py-2 text-sm text-[#616A5C] focus:outline-none focus:border-[#8DC573] transition-colors";

export default function AdminOrdersListPage() {
  const [mode, setMode] = useState<FilterMode>("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const now = getNowInWinnipeg();
  const today = ymd(now);
  const tomorrow = ymd(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));

  const queryInput =
    mode === "today"
      ? { from: today, to: today }
      : mode === "tomorrow"
        ? { from: tomorrow, to: tomorrow }
        : mode === "custom"
          ? { from: customFrom || undefined, to: customTo || undefined }
          : {};

  const { data: orders, isLoading } = trpc.admin.orders.list.useQuery(queryInput);

  const pillClass = (active: boolean) =>
    `h-9 px-4 rounded-full border-[2px] text-sm font-semibold transition-colors ${
      active
        ? "border-[#37751A] bg-[#37751A] text-white"
        : "border-[#c8d9c2] text-[#3A6426] hover:border-[#6CAC4F] hover:bg-[#EFF8DD]"
    }`;

  return (
    <PageWrapper className="gap-4">
      <h1 className="text-xl font-bold text-[#37751A]">Orders</h1>

      <div className="flex flex-wrap items-center gap-2">
        <button className={pillClass(mode === "today")} onClick={() => setMode("today")}>
          Today
        </button>
        <button className={pillClass(mode === "tomorrow")} onClick={() => setMode("tomorrow")}>
          Tomorrow
        </button>
        <button className={pillClass(mode === "all")} onClick={() => setMode("all")}>
          All
        </button>
        <div className="flex items-center gap-2 ml-1">
          <input
            type="date"
            value={customFrom}
            onChange={(e) => {
              setCustomFrom(e.target.value);
              setMode("custom");
            }}
            className={inputClass}
          />
          <span className="text-[#616A5C] opacity-60 text-sm">to</span>
          <input
            type="date"
            value={customTo}
            onChange={(e) => {
              setCustomTo(e.target.value);
              setMode("custom");
            }}
            className={inputClass}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingScreen />
      ) : !orders || orders.length === 0 ? (
        <Card className="px-5 py-4">
          <p className="text-sm text-[#616A5C] opacity-60">No orders for this range.</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          {orders.map((order, idx) => {
            const customerName =
              [order.customerFirstName, order.customerLastName].filter(Boolean).join(" ") ||
              "Customer";
            return (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className={`flex items-center justify-between px-5 py-3.5 text-sm hover:bg-[#EFF8DD] transition-colors ${
                  idx < orders.length - 1 ? "border-b border-[#6CAC4F]/20" : ""
                }`}
              >
                <div>
                  <p className="text-[#37751A] font-semibold">
                    #{order.orderNumber ?? order.id} · {customerName}
                  </p>
                  <p className="text-xs text-[#616A5C] opacity-70 capitalize">
                    {order.status.replace(/_/g, " ")}
                    {order.deliveryDate &&
                      ` · ${new Date(order.deliveryDate).toLocaleDateString("en-CA", {
                        month: "short",
                        day: "numeric",
                      })}`}
                  </p>
                  {order.lastDeliveryUpdateStage && order.lastDeliveryUpdateAt && (
                    <p className="text-xs text-[#6CAC4F] font-medium mt-0.5">
                      Sent {DELIVERY_UPDATE_LABELS[order.lastDeliveryUpdateStage as DeliveryUpdateStage]}{" "}
                      at{" "}
                      {new Date(order.lastDeliveryUpdateAt).toLocaleTimeString("en-CA", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
                <span className="text-[#3A6426] font-semibold">
                  {formatDollars(order.totalAfterDiscount)}
                </span>
              </Link>
            );
          })}
        </Card>
      )}
    </PageWrapper>
  );
}

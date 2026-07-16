"use client";
import { trpc } from "@/lib/trpc/client";
import { formatDollars } from "@/lib/utils/discount";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { PageWrapper } from "@/components/ui/PageWrapper";

export default function OrdersPage() {
  const { data: orders = [], isLoading } = trpc.orders.getHistory.useQuery();

  if (isLoading) return <LoadingScreen />;

  return (
    <PageWrapper>
      <div className="flex items-center gap-3">
        <Link href="/profile" className="text-[#616A5C] opacity-70 hover:opacity-100 text-sm transition-opacity">
          ← Profile
        </Link>
        <h1 className="text-xl font-bold text-[#37751A]">Order history</h1>
      </div>

      {orders.length === 0 ? (
        <Card className="px-5 py-8 text-center">
          <p className="text-[#616A5C] opacity-70">No orders yet.</p>
        </Card>
      ) : (
        <div className="space-y-2.5">
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
                className="flex items-center justify-between bg-white rounded-2xl shadow-card px-5 py-4 hover:shadow-[0_4px_12px_rgba(73,129,47,0.15)] transition-shadow"
              >
                <div>
                  <p className="font-semibold text-[#37751A]">Order #{order.id}</p>
                  <p className="text-sm text-[#616A5C] opacity-80 mt-0.5">{date}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#4C922C] font-bold text-lg">
                    {formatDollars(order.totalAfterDiscount)}
                  </p>
                  <p className="text-xs text-[#616A5C] opacity-60 capitalize mt-0.5">
                    {order.status}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PageWrapper>
  );
}

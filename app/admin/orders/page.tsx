"use client";
import Link from "next/link";
import { trpc } from "@/lib/trpc/client";
import { formatDollars } from "@/lib/utils/discount";
import { Card } from "@/components/ui/Card";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { PageWrapper } from "@/components/ui/PageWrapper";

export default function AdminOrdersListPage() {
  const { data: orders, isLoading } = trpc.admin.orders.list.useQuery();

  if (isLoading) return <LoadingScreen />;

  return (
    <PageWrapper className="gap-4">
      <h1 className="text-xl font-bold text-[#37751A]">Orders</h1>

      {!orders || orders.length === 0 ? (
        <Card className="px-5 py-4">
          <p className="text-sm text-[#616A5C] opacity-60">No orders yet.</p>
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
                  </p>
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

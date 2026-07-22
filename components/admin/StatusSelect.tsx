"use client";
import { trpc } from "@/lib/trpc/client";

export function StatusSelect({ orderId, status }: { orderId: number; status: string }) {
  const utils = trpc.useUtils();
  // Enum values, fixed at build time — never changes at runtime.
  const { data: statuses } = trpc.admin.orderStatuses.useQuery(undefined, { staleTime: Infinity });

  const updateStatus = trpc.admin.orders.updateStatus.useMutation({
    onSuccess: () => {
      // Status affects the order-detail view, the orders list (status/date
      // filters), and the "new" (pending) nav badge count — all three need
      // to reflect the change, not just the page we're currently on.
      utils.admin.orders.byId.invalidate({ id: orderId });
      utils.admin.orders.list.invalidate();
      utils.admin.navCounts.invalidate();
    },
  });

  return (
    <div>
      <select
        value={status}
        disabled={updateStatus.isPending || !statuses}
        onChange={(e) =>
          updateStatus.mutate({
            id: orderId,
            status: e.target.value as Parameters<typeof updateStatus.mutate>[0]["status"],
          })
        }
        className="w-full bg-[#F7F7F7] border-[2px] border-[rgba(217,217,217,0.5)] rounded-xl px-4 py-3 text-[15px] text-[#3A6426] font-medium capitalize focus:outline-none focus:border-[#8DC573] transition-colors disabled:opacity-60"
      >
        {(statuses ?? [status]).map((s) => (
          <option key={s} value={s} className="capitalize">
            {s.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      {updateStatus.isError && (
        <p className="text-xs text-red-500 mt-2">Failed to update status: {updateStatus.error.message}</p>
      )}
    </div>
  );
}

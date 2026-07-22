"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { formatCents } from "@/lib/utils/discount";

export default function MenuPage() {
  const { data: groups = [] } = trpc.products.groups.useQuery();
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const groupId = activeGroupId ?? groups[0]?.id;

  const { data: products = [], isLoading } = trpc.products.list.useQuery(
    { groupId: groupId! },
    { enabled: !!groupId }
  );
  const { data: calendar } = trpc.products.todayCalendar.useQuery();

  const totalCents = useCart((s) => s.totalCents());
  const itemCount = useCart((s) => s.itemCount());

  return (
    <div className="flex flex-col flex-1 pb-24">
      {/* Category tabs */}
      <div className="sticky top-[70px] z-30 bg-[#f3f3f3] border-b border-[#e0e8dc] overflow-x-auto scrollbar-none">
        <div className="flex h-[72px] min-w-max px-4 gap-1.5 items-center xl:justify-center">
          {groups.map((g) => {
            const isActive = g.id === groupId;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGroupId(g.id)}
                className={`px-6 py-2.5 rounded-full text-[19px] font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#6CAC4F] text-white"
                    : "text-[#4F9528] hover:bg-[#EFF8DD]"
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product list */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-[#616A5C]">
            Loading…
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-[#616A5C]">
            No products available
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} salePct={calendar?.salePct ?? null} />
            ))}
          </div>
        )}
      </div>

      {/* Fixed cart bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-5 left-0 right-0 px-6 z-40 xl:hidden">
          <Link
            href="/cart"
            className="flex items-center justify-between w-full max-w-sm mx-auto h-16 px-5 rounded-full text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{ background: "rgba(39, 122, 0, 0.85)", backdropFilter: "blur(8px)" }}
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-sm font-bold">
              {itemCount}
            </span>
            <span className="font-semibold text-[17px]">View cart</span>
            <span className="font-semibold text-[17px]">{formatCents(totalCents)}</span>
          </Link>
        </div>
      )}
    </div>
  );
}

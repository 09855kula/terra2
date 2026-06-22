"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { ProductCard } from "@/components/ProductCard";

export default function MenuPage() {
  const { data: groups = [] } = trpc.products.groups.useQuery();
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const groupId = activeGroupId ?? groups[0]?.id;

  const { data: products = [], isLoading } = trpc.products.list.useQuery(
    { groupId: groupId! },
    { enabled: !!groupId }
  );
  const { data: calendar } = trpc.products.todayCalendar.useQuery();

  return (
    <div className="flex flex-col flex-1">
      <div className="sticky top-14 z-30 border-b border-zinc-800 bg-zinc-950 overflow-x-auto scrollbar-none">
        <div className="flex h-11 min-w-max px-4">
          {groups.map((g) => {
            const isActive = g.id === groupId;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGroupId(g.id)}
                className={`px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-green-500 text-green-400"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-zinc-500">
            Loading…
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-zinc-500">
            No products available
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} salePct={calendar?.salePct ?? null} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

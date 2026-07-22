"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { useCart } from "@/lib/store/cart";
import { formatCents } from "@/lib/utils/discount";
import { formatQuantityLabel, nextMultiplier, prevMultiplier } from "@/lib/utils/sizeOptions";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";

const HIDDEN_ON = ["/cart", "/checkout"];

export function CartSidebar() {
  const pathname = usePathname();
  const { items, updateQty, removeItem, totalCents } = useCart();

  const newestRef = useRef<HTMLDivElement>(null);
  const prevIds = useRef<number[]>([]);
  const didMount = useRef(false);
  const newestId = items.length > 0 ? items[items.length - 1].productId : null;

  useEffect(() => {
    const isNew = newestId !== null && !prevIds.current.includes(newestId);
    prevIds.current = items.map((i) => i.productId);
    if (didMount.current && isNew) {
      newestRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    didMount.current = true;
  }, [items, newestId]);

  if (items.length === 0) return null;
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="hidden xl:block fixed top-24 right-8 w-[300px] z-30">
      <Card className="overflow-hidden">
        <div className="bg-[#ffffffcc] border-b border-[#e8f0e4] py-3 text-center">
          <p className="text-[#2F521F] font-semibold text-[15px] opacity-80">Your cart</p>
        </div>

        <div className="max-h-[360px] overflow-y-auto divide-y divide-[#6CAC4F]/20">
          {items.map((item) => (
            <div
              key={item.productId}
              ref={item.productId === newestId ? newestRef : undefined}
              className="px-4 py-3 flex items-start gap-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-10 h-10 rounded-lg object-cover shrink-0 bg-[#EFF8DD]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-[13px] font-semibold text-[#37751A] truncate">
                    {item.productName}
                  </p>
                  {item.productType && (
                    <span className="text-[9px] uppercase tracking-wide font-semibold text-[#616A5C] border border-[#c8d9c2] rounded px-1 py-0.5 shrink-0">
                      {item.productType}
                    </span>
                  )}
                </div>
                <p className="text-[#37751A] font-bold text-xs mt-0.5">
                  {item.categoryName && `${item.categoryName} · `}
                  {formatQuantityLabel(item.tierUnitOfMeasure, item.tierShownAs, item.quantity)}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <button
                    onClick={() => updateQty(item.productId, prevMultiplier(item.quantity))}
                    className="w-6 h-6 rounded-full border border-[#8DC573] flex items-center justify-center text-[#37751A] hover:bg-[#EFF8DD] transition-colors text-xs leading-none"
                  >
                    −
                  </button>
                  <button
                    onClick={() => updateQty(item.productId, nextMultiplier(item.quantity))}
                    disabled={nextMultiplier(item.quantity) > item.stock}
                    className="w-6 h-6 rounded-full border border-[#8DC573] flex items-center justify-center text-[#37751A] hover:bg-[#EFF8DD] transition-colors text-xs leading-none disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>
              <span className="text-[13px] font-bold text-[#37751A] shrink-0 mt-0.5">
                {formatCents(item.unitPriceCents * item.quantity)}
              </span>
              <ConfirmDeleteButton confirm={() => removeItem(item.productId)} size={18} />
            </div>
          ))}
        </div>

        <div className="px-4 py-3 border-t border-[#6CAC4F]/20 flex justify-between items-center">
          <span className="text-[#616A5C] text-sm font-medium">Total</span>
          <span className="text-[#4C922C] font-bold text-lg">{formatCents(totalCents())}</span>
        </div>

        <div className="px-4 pb-4">
          <PillButton href="/cart" className="w-full h-11 text-[14px]">
            Checkout
          </PillButton>
        </div>
      </Card>
    </div>
  );
}

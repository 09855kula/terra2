"use client";
import { useRef, useState } from "react";
import { calcEffectivePrice, formatCents } from "@/lib/utils/discount";
import { getSizeOptions } from "@/lib/utils/sizeOptions";
import { useCart } from "@/lib/store/cart";

type Product = {
  id: number;
  name: string;
  type: "sativa" | "indica" | "hybrid" | null;
  groupName: string | null;
  imgUrl: string | null;
  basePriceCents: number | null;
  discountPct: string | null;
  tierDiscountPct: string | null;
  tierUnitOfMeasure: string | null;
  tierShownAs: string | null;
  stock: number;
  onSale: boolean;
};

export function ProductCard({ product, salePct }: { product: Product; salePct?: string | null }) {
  const { setQty } = useCart();
  // Badge/highlight tracks the live cart quantity directly, so edits made on the
  // cart page/sidebar (including full removal) are reflected here automatically.
  const cartQuantity = useCart(
    (s) => s.items.find((i) => i.productId === product.id)?.quantity ?? null
  );

  // Only the in-progress "armed, waiting for a second tap" state is local/ephemeral.
  const [pending, setPending] = useState<number | null>(null);
  const [flash, setFlash] = useState<{ multiplier: number; key: number } | null>(null);
  const flashKeyRef = useRef(0);

  const basePriceCents = product.basePriceCents ?? 0;
  const priceCents = calcEffectivePrice(
    basePriceCents,
    product.discountPct,
    product.tierDiscountPct,
    salePct ?? null
  );
  const imageUrl =
    product.imgUrl || `https://picsum.photos/seed/${encodeURIComponent(product.name)}/300/300`;
  const sizeOptions = getSizeOptions(product.tierUnitOfMeasure, product.tierShownAs);

  // Tap a size once to arm it (capsule turns solid dark, label becomes "Confirm?"/
  // "Remove?"). Tap the same, now-armed capsule again to commit it to the cart.
  const handleTap = (multiplier: number) => {
    if (pending !== multiplier) {
      setPending(multiplier);
      return;
    }
    const isRemoving = multiplier === cartQuantity;
    setQty(
      {
        productId: product.id,
        productName: product.name,
        unitPriceCents: priceCents,
        stock: product.stock,
        tierUnitOfMeasure: product.tierUnitOfMeasure,
        tierShownAs: product.tierShownAs,
        imageUrl,
        productType: product.type,
        categoryName: product.groupName,
      },
      isRemoving ? 0 : multiplier
    );
    setPending(null);
    flashKeyRef.current += 1;
    setFlash({ multiplier, key: flashKeyRef.current });
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-[0_2px_8px_rgba(31,71,13,0.08)]">
      <div className="relative aspect-square w-full bg-[#EFF8DD]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
        {product.onSale && (
          <span className="absolute top-1.5 left-1.5 text-[10px] uppercase tracking-wide font-semibold text-white bg-[#6CAC4F] rounded px-1.5 py-0.5 shadow">
            Sale
          </span>
        )}
        {cartQuantity !== null && cartQuantity > 0 && (
          <span className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#37751A] text-white text-[13px] font-bold flex items-center justify-center shadow">
            {cartQuantity}
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-[#616A5C]">Out of stock</span>
          </div>
        )}
      </div>

      <div className="px-2.5 py-2 flex flex-col flex-1 gap-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-[#37751A] truncate text-[13px] leading-snug">
            {product.name}
          </span>
          {product.type && (
            <span className="text-[9px] uppercase tracking-wide font-semibold text-[#616A5C] border border-[#c8d9c2] rounded px-1 py-0.5 shrink-0">
              {product.type}
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-[#37751A] font-bold text-[15px] leading-none">
            {formatCents(priceCents)}
          </span>
          {priceCents < basePriceCents && (
            <span className="text-[#616A5C] line-through text-xs opacity-60">
              {formatCents(basePriceCents)}
            </span>
          )}
        </div>

        <div className="mt-auto pt-1.5 grid grid-cols-2 gap-1.5">
          {product.stock === 0
            ? null
            : sizeOptions.map((opt) => {
                const isArmed = pending === opt.multiplier;
                const isSelected = pending === null && cartQuantity === opt.multiplier;
                const disabled = product.stock < opt.multiplier;
                return (
                  <button
                    key={opt.multiplier}
                    onClick={() => handleTap(opt.multiplier)}
                    disabled={disabled}
                    className={`relative overflow-hidden h-9 rounded-full flex items-center justify-center text-[13px] font-semibold leading-none transition-colors active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${
                      isArmed
                        ? "bg-[#2F521F] text-white"
                        : isSelected
                        ? "bg-[#37751A] text-white"
                        : "text-[#37751A] border border-[#8DC573] hover:bg-[#EFF8DD]"
                    }`}
                  >
                    {flash?.multiplier === opt.multiplier && (
                      <span
                        key={flash.key}
                        onAnimationEnd={() => setFlash(null)}
                        className="confirm-flash absolute inset-0 bg-white pointer-events-none"
                      />
                    )}
                    {isArmed ? (opt.multiplier === cartQuantity ? "Remove?" : "Confirm?") : opt.label}
                  </button>
                );
              })}
        </div>
      </div>
    </div>
  );
}

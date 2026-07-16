"use client";
import { calcEffectivePrice, formatCents } from "@/lib/utils/discount";
import { useCart } from "@/lib/store/cart";

type Product = {
  id: number;
  name: string;
  type: "sativa" | "indica" | "hybrid" | null;
  basePriceCents: number | null;
  discountPct: string | null;
  tierDiscountPct: string | null;
  tierShownAs: string | null;
  stock: number;
  onSale: boolean;
};

export function ProductCard({ product, salePct }: { product: Product; salePct?: string | null }) {
  const { items, addItem, updateQty } = useCart();
  const cartItem = items.find((i) => i.productId === product.id);
  const qty = cartItem?.quantity ?? 0;

  const basePriceCents = product.basePriceCents ?? 0;
  const priceCents = calcEffectivePrice(
    basePriceCents,
    product.discountPct,
    product.tierDiscountPct,
    salePct ?? null
  );
  const isOutOfStock = product.stock <= qty;

  const handleAdd = () => {
    if (!cartItem) {
      addItem({
        productId: product.id,
        productName: product.name,
        unitPriceCents: priceCents,
        stock: product.stock,
      });
    } else {
      updateQty(product.id, qty + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(31,71,13,0.08)]">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-[#37751A] truncate text-[15px] leading-snug">
            {product.name}
          </span>
          {product.type && (
            <span className="text-[10px] uppercase tracking-wide font-semibold text-[#616A5C] border border-[#c8d9c2] rounded px-1.5 py-0.5 shrink-0">
              {product.type}
            </span>
          )}
          {product.onSale && (
            <span className="text-[10px] uppercase tracking-wide font-semibold text-[#6CAC4F] border border-[#6CAC4F] rounded px-1.5 py-0.5 shrink-0">
              Sale
            </span>
          )}
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-[#37751A] font-bold text-[17px] leading-none">
            {formatCents(priceCents)}
          </span>
          {priceCents < basePriceCents && (
            <span className="text-[#616A5C] line-through text-sm opacity-60">
              {formatCents(basePriceCents)}
            </span>
          )}
          {product.tierShownAs && (
            <span className="text-[#616A5C] text-xs opacity-70">/ {product.tierShownAs}</span>
          )}
        </div>
      </div>

      {product.stock === 0 ? (
        <span className="text-xs text-[#616A5C] opacity-60 shrink-0">Out of stock</span>
      ) : qty === 0 ? (
        <button
          onClick={handleAdd}
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl font-light leading-none transition-opacity hover:opacity-80 active:scale-95"
          style={{ background: "rgba(39, 122, 0, 0.65)" }}
        >
          +
        </button>
      ) : (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => updateQty(product.id, qty - 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#37751A] border border-[#8DC573] hover:bg-[#EFF8DD] transition-colors text-lg leading-none font-medium active:scale-95"
          >
            −
          </button>
          <span className="w-5 text-center text-sm font-semibold text-[#37751A]">{qty}</span>
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#37751A] border border-[#8DC573] hover:bg-[#EFF8DD] transition-colors text-lg leading-none font-medium disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

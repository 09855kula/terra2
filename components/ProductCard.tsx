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
    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-white truncate">{product.name}</span>
          {product.type && (
            <span className="text-[10px] uppercase tracking-wide font-semibold text-zinc-400 border border-zinc-700 rounded px-1.5 py-0.5 shrink-0">
              {product.type}
            </span>
          )}
          {product.onSale && (
            <span className="text-[10px] uppercase tracking-wide font-semibold text-green-400 border border-green-800 rounded px-1.5 py-0.5 shrink-0">
              Sale
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-green-400 font-semibold">{formatCents(priceCents)}</span>
          {priceCents < basePriceCents && (
            <span className="text-zinc-500 line-through text-sm">
              {formatCents(basePriceCents)}
            </span>
          )}
          {product.tierShownAs && (
            <span className="text-zinc-500 text-xs">/ {product.tierShownAs}</span>
          )}
        </div>
      </div>

      {product.stock === 0 ? (
        <span className="text-xs text-zinc-500 shrink-0">Out of stock</span>
      ) : qty === 0 ? (
        <button
          onClick={handleAdd}
          className="shrink-0 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-500 transition-colors"
        >
          Add
        </button>
      ) : (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => updateQty(product.id, qty - 1)}
            className="rounded-lg border border-zinc-700 w-7 h-7 flex items-center justify-center text-zinc-300 hover:border-zinc-500 transition-colors text-base leading-none"
          >
            −
          </button>
          <span className="w-5 text-center text-sm font-medium text-white">
            {qty}
          </span>
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className="rounded-lg border border-zinc-700 w-7 h-7 flex items-center justify-center text-zinc-300 hover:border-zinc-500 transition-colors text-base leading-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

"use client";
import { useCart } from "@/lib/store/cart";
import { formatCents } from "@/lib/utils/discount";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon } from "@hugeicons/core-free-icons";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQty, removeItem, totalCents, itemCount } = useCart();
  const total = totalCents();
  const count = itemCount();

  if (count === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-zinc-400">Your cart is empty</p>
        <Link
          href="/"
          className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-500 transition-colors"
        >
          Browse menu
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col max-w-2xl mx-auto w-full px-4 py-6 gap-4">
      <h1 className="text-xl font-bold text-white">Your cart</h1>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 gap-3"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white truncate">{item.productName}</p>
              <p className="text-sm text-green-400">{formatCents(item.unitPriceCents)}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(item.productId, item.quantity - 1)}
                  className="rounded-lg border border-zinc-700 w-7 h-7 flex items-center justify-center text-zinc-300 hover:border-zinc-500 transition-colors"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm text-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQty(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="rounded-lg border border-zinc-700 w-7 h-7 flex items-center justify-center text-zinc-300 hover:border-zinc-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <span className="text-sm font-medium text-white w-14 text-right">
                {formatCents(item.unitPriceCents * item.quantity)}
              </span>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-zinc-500 hover:text-red-400 transition-colors p-1"
              >
                <HugeiconsIcon icon={Delete01Icon} size={16} color="currentColor" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto border-t border-zinc-800 pt-4 space-y-3">
        <div className="flex justify-between text-lg font-semibold text-white">
          <span>Total</span>
          <span>{formatCents(total)}</span>
        </div>
        <button
          onClick={() => router.push("/checkout")}
          className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-500 transition-colors"
        >
          Checkout
        </button>
        <Link
          href="/"
          className="block text-center text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

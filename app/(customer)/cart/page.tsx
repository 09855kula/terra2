"use client";
import { useCart } from "@/lib/store/cart";
import { formatCents } from "@/lib/utils/discount";
import { formatQuantityLabel, nextMultiplier, prevMultiplier } from "@/lib/utils/sizeOptions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { PageWrapper } from "@/components/ui/PageWrapper";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQty, removeItem, totalCents, itemCount } = useCart();
  const total = totalCents();
  const count = itemCount();

  if (count === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-4 text-center">
        <p className="text-[#616A5C] text-lg font-medium">Your cart is empty</p>
        <PillButton href="/" className="px-8 h-12">Browse menu</PillButton>
      </div>
    );
  }

  return (
    <PageWrapper className="pt-6 pb-32">
      <h1 className="text-xl font-bold text-[#37751A]">Your cart</h1>

      <Card className="overflow-hidden">
        {items.map((item, idx) => (
          <div
            key={item.productId}
            className={`flex items-center px-4 py-3.5 gap-3 ${
              idx < items.length - 1 ? "border-b border-[#6CAC4F]/20" : ""
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="w-14 h-14 rounded-xl object-cover shrink-0 bg-[#EFF8DD]"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-semibold text-[#37751A] text-[15px] truncate">{item.productName}</p>
                {item.productType && (
                  <span className="text-[10px] uppercase tracking-wide font-semibold text-[#616A5C] border border-[#c8d9c2] rounded px-1.5 py-0.5 shrink-0">
                    {item.productType}
                  </span>
                )}
              </div>
              <p className="text-[#37751A] font-bold text-[15px] mt-0.5">
                {item.categoryName && `${item.categoryName} · `}
                {formatQuantityLabel(item.tierUnitOfMeasure, item.tierShownAs, item.quantity)}
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQty(item.productId, prevMultiplier(item.quantity))}
                  className="w-8 h-8 rounded-full border border-[#8DC573] flex items-center justify-center text-[#37751A] hover:bg-[#EFF8DD] transition-colors text-base leading-none"
                >
                  −
                </button>
                <button
                  onClick={() => updateQty(item.productId, nextMultiplier(item.quantity))}
                  disabled={nextMultiplier(item.quantity) > item.stock}
                  className="w-8 h-8 rounded-full border border-[#8DC573] flex items-center justify-center text-[#37751A] hover:bg-[#EFF8DD] transition-colors text-base leading-none disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <span className="text-sm font-bold text-[#37751A] w-16 text-right">
                {formatCents(item.unitPriceCents * item.quantity)}
              </span>
              <ConfirmDeleteButton confirm={() => removeItem(item.productId)} size={22} />
            </div>
          </div>
        ))}
      </Card>

      <Card className="px-5 py-4 flex justify-between items-center">
        <span className="text-[#616A5C] font-medium">Total</span>
        <span className="text-[#4C922C] font-bold text-2xl">{formatCents(total)}</span>
      </Card>

      <div className="space-y-3 mt-2">
        <PillButton onClick={() => router.push("/checkout")} className="w-full text-[18px]">
          Checkout
        </PillButton>
        <Link
          href="/"
          className="block text-center text-sm text-[#616A5C] opacity-70 hover:opacity-100 transition-opacity py-2"
        >
          ← Continue shopping
        </Link>
      </div>
    </PageWrapper>
  );
}

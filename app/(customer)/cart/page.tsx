"use client";
import { useCart } from "@/lib/store/cart";
import { trpc } from "@/lib/trpc/client";
import { formatCents } from "@/lib/utils/discount";
import { formatQuantityLabel, nextMultiplier, prevMultiplier } from "@/lib/utils/sizeOptions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ConfirmDeleteButton } from "@/components/ConfirmDeleteButton";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { CollapsibleSection } from "@/components/CollapsibleSection";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQty, removeItem, totalCents, itemCount, selectedGiftIds, toggleGiftId } = useCart();
  const total = totalCents();
  const count = itemCount();

  const { data: me } = trpc.users.me.useQuery();
  const { data: redeemableItems = [] } = trpc.orders.getRedeemableItems.useQuery();

  const points = me?.points ?? 0;
  const selectedGiftCost = redeemableItems
    .filter((p) => selectedGiftIds.includes(p.id))
    .reduce((sum, p) => sum + p.giftablePoints, 0);
  const remainingPoints = points - selectedGiftCost;
  const selectedGiftProducts = redeemableItems.filter((p) => selectedGiftIds.includes(p.id));

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
              idx < items.length - 1 || selectedGiftProducts.length > 0 ? "border-b border-[#6CAC4F]/20" : ""
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

        {selectedGiftProducts.map((p, idx) => {
          const imageUrl = p.imgUrl || `https://picsum.photos/seed/${encodeURIComponent(p.name)}/300/300`;
          return (
            <div
              key={`gift-${p.id}`}
              className={`flex items-center px-4 py-3.5 gap-3 ${
                idx < selectedGiftProducts.length - 1 ? "border-b border-[#6CAC4F]/20" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={p.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0 bg-[#EFF8DD]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="font-semibold text-[#37751A] text-[15px] truncate">{p.name}</p>
                  <span className="text-[9px] uppercase tracking-wide font-semibold text-white bg-[#6CAC4F] rounded px-1.5 py-0.5 shrink-0">
                    Gift
                  </span>
                </div>
                <p className="text-[#616A5C] text-xs opacity-70 mt-0.5">{p.giftablePoints} pts redeemed</p>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-sm font-bold text-[#37751A] w-16 text-right">$0.00</span>
                <button
                  onClick={() => toggleGiftId(p.id)}
                  aria-label={`Remove ${p.name} gift`}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[#616A5C] opacity-60 hover:opacity-100 hover:bg-[#EFF8DD] transition-colors text-sm leading-none"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </Card>

      <Card className="px-5 py-4 flex justify-between items-center">
        <span className="text-[#616A5C] font-medium">Total</span>
        <span className="text-[#4C922C] font-bold text-2xl">{formatCents(total)}</span>
      </Card>

      {redeemableItems.length > 0 && (
        <Card className="overflow-hidden">
          <CollapsibleSection
            title={`You have ${points} points — add a free item`}
            defaultOpen={false}
            headerClassName="px-5 py-4"
          >
            <div className="divide-y divide-[#6CAC4F]/20 border-t border-[#6CAC4F]/20">
              {redeemableItems.map((p) => {
                const checked = selectedGiftIds.includes(p.id);
                const disabled = !checked && remainingPoints < p.giftablePoints;
                const imageUrl = p.imgUrl || `https://picsum.photos/seed/${encodeURIComponent(p.name)}/300/300`;
                return (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3 px-5 py-3 ${
                      disabled ? "opacity-40" : "cursor-pointer hover:bg-[#EFF8DD]/60"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggleGiftId(p.id)}
                      className="w-4 h-4 accent-[#37751A] shrink-0"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 bg-[#EFF8DD]"
                    />
                    <span className="min-w-0 flex-1 flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-semibold text-[#37751A] truncate">{p.name}</span>
                      <span className="text-[9px] uppercase tracking-wide font-semibold text-white bg-[#6CAC4F] rounded px-1.5 py-0.5 shrink-0">
                        Gift
                      </span>
                    </span>
                    <span className="text-xs font-semibold text-[#616A5C] shrink-0">{p.giftablePoints} pts</span>
                  </label>
                );
              })}
            </div>
          </CollapsibleSection>
        </Card>
      )}

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

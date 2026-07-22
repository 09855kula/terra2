"use client";
import type { CartItem } from "@/lib/store/cart";
import { formatCents } from "@/lib/utils/discount";
import { formatQuantityLabel } from "@/lib/utils/sizeOptions";
import { Card } from "@/components/ui/Card";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { CollapsibleSection } from "@/components/CollapsibleSection";

interface CheckoutSidebarProps {
  items: CartItem[];
  totalCents: number;
  step: number;
  addressLabel?: string;
  addressText?: string;
  windowLabel?: string;
  changeLabel?: string;
}

export function CheckoutSidebar({
  items,
  totalCents,
  step,
  addressLabel,
  addressText,
  windowLabel,
  changeLabel,
}: CheckoutSidebarProps) {
  // Once you've moved past picking items, collapse the item list down so the
  // growing details section (address/window/change) doesn't push the card
  // taller and taller.
  const compact = step > 1;

  return (
    <div className="hidden xl:block fixed top-24 right-8 w-[560px] z-30">
      <Card className="overflow-hidden">
        <div className="bg-[#ffffffcc] border-b border-[#e8f0e4] py-6 text-center">
          <p className="text-[30px] font-semibold text-[#2F521F] opacity-80">Order preview</p>
        </div>

        <div className="px-8 py-6 border-b border-[#6CAC4F]/20 flex justify-between items-center">
          <span className="text-[#616A5C] text-[22px] font-medium">Total</span>
          <span className="text-[#4C922C] font-bold text-[36px]">{formatCents(totalCents)}</span>
        </div>

        <CollapsibleSection
          title={`Items (${items.length})`}
          defaultOpen={!compact}
          headerClassName="px-8 py-4 border-b border-[#6CAC4F]/20"
        >
          <div className="max-h-[400px] overflow-y-auto divide-y divide-[#6CAC4F]/20">
            {items.map((item) => (
              <div
                key={item.productId}
                className={`flex items-start justify-between gap-4 transition-all duration-300 ${
                  compact ? "px-8 py-2" : "px-8 py-6"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className={`object-cover shrink-0 bg-[#EFF8DD] transition-all duration-300 ${
                    compact ? "w-8 h-8 rounded-md" : "w-16 h-16 rounded-xl"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className={`font-semibold text-[#37751A] truncate transition-all duration-300 ${
                        compact ? "text-[15px]" : "text-[26px]"
                      }`}
                    >
                      {item.productName}
                    </p>
                    {item.productType && (
                      <span
                        className={`uppercase tracking-wide font-semibold text-[#616A5C] border border-[#c8d9c2] rounded px-1.5 py-0.5 shrink-0 transition-all duration-300 ${
                          compact ? "text-[9px]" : "text-[13px]"
                        }`}
                      >
                        {item.productType}
                      </span>
                    )}
                  </div>
                  {!compact && (
                    <p className="text-[22px] text-[#616A5C] opacity-70 mt-0.5">
                      {item.categoryName && `${item.categoryName} · `}
                      {formatQuantityLabel(item.tierUnitOfMeasure, item.tierShownAs, item.quantity)}
                    </p>
                  )}
                </div>
                <span
                  className={`font-bold text-[#37751A] shrink-0 mt-0.5 transition-all duration-300 ${
                    compact ? "text-[15px]" : "text-[26px]"
                  }`}
                >
                  {formatCents(item.unitPriceCents * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {addressLabel && (
          <CollapsibleSection title="Address" headerClassName="px-8 py-4 border-t border-[#6CAC4F]/20">
            <div className="px-8 pb-6">
              <SectionLabel>Address</SectionLabel>
              <p className="text-[26px] font-semibold text-[#37751A] mt-1">{addressLabel}</p>
              {addressText && <p className="text-[24px] text-[#616A5C] opacity-80">{addressText}</p>}
            </div>
          </CollapsibleSection>
        )}

        {windowLabel && (
          <CollapsibleSection title="Delivery" headerClassName="px-8 py-4 border-t border-[#6CAC4F]/20">
            <div className="px-8 pb-6">
              <SectionLabel>Delivery</SectionLabel>
              <p className="text-[26px] font-semibold text-[#37751A] mt-1">{windowLabel}</p>
            </div>
          </CollapsibleSection>
        )}

        {changeLabel && (
          <CollapsibleSection title="Change" headerClassName="px-8 py-4 border-t border-[#6CAC4F]/20">
            <div className="px-8 pb-6">
              <SectionLabel>Change</SectionLabel>
              <p className="text-[26px] font-semibold text-[#37751A] mt-1">{changeLabel}</p>
            </div>
          </CollapsibleSection>
        )}
      </Card>
    </div>
  );
}

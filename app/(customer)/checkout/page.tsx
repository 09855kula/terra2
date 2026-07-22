"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useCart } from "@/lib/store/cart";
import { formatCents } from "@/lib/utils/discount";
import { getAvailableWindows, type DeliveryWindow } from "@/lib/utils/delivery";
import { formatQuantityLabel } from "@/lib/utils/sizeOptions";
import { SectionCard } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PageWrapper } from "@/components/ui/PageWrapper";
import { CheckoutSidebar } from "@/components/CheckoutSidebar";
import { AddressForm } from "@/components/AddressForm";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";

type Step = 1 | 2 | 3 | 4;

const CHANGE_OPTIONS = ["$5", "$10", "$15", "$20", "$25", "No change", "Other"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCents, clear, selectedGiftIds } = useCart();
  const total = totalCents();

  const [step, setStep] = useState<Step>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addingAddress, setAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [devBypassCutoff, setDevBypassCutoff] = useState(false);
  const isDev = process.env.NODE_ENV !== "production";
  const [selectedWindow, setSelectedWindow] = useState<DeliveryWindow | null>(null);
  const [change, setChange] = useState("No change");
  const [customChange, setCustomChange] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const { data: me } = trpc.users.me.useQuery();
  const { data: schedules = [] } = trpc.orders.getDeliverySchedules.useQuery();

  const [orderPlaced, setOrderPlaced] = useState(false);

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: (order) => {
      setOrderPlaced(true);
      clear();
      router.push(`/orders/${order.id}`);
    },
    onError: (e) => setError(e.message),
  });

  const addresses = me?.addresses ?? [];
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const districtSchedules = selectedAddress?.districtId
    ? schedules.filter((s) => s.districtId === selectedAddress.districtId)
    : schedules;
  const windows = getAvailableWindows(districtSchedules, { bypassCutoff: isDev && devBypassCutoff });

  // Mirrors each step's own "Next" gating — the arrows can't skip ahead of data we don't have yet.
  const canAdvanceFrom = (s: Step) => {
    if (s === 1) return !!selectedAddressId;
    if (s === 2) return !!selectedWindow;
    return true;
  };

  const handlePlaceOrder = () => {
    if (!selectedAddressId || !selectedWindow) return;
    const changeValue = change === "Other" ? customChange : change;
    createOrder.mutate({
      addressId: selectedAddressId,
      deliveryDate: selectedWindow.date.toISOString(),
      timeslot: selectedWindow.label,
      change: changeValue === "No change" ? undefined : changeValue,
      comment: comment || undefined,
      giftProductIds: selectedGiftIds,
      items: items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        unitPriceCents: i.unitPriceCents,
        unitOfMeasure: i.tierUnitOfMeasure,
        shownAs: i.tierShownAs,
      })),
    });
  };

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) router.push("/");
  }, [items.length, orderPlaced, router]);

  if (items.length === 0) {
    return null;
  }

  const changeValue = change === "Other" ? customChange || "Custom" : change;

  return (
    <>
      <CheckoutSidebar
        items={items}
        totalCents={total}
        step={step}
        addressLabel={step > 1 && selectedAddress ? selectedAddress.label ?? "Address" : undefined}
        addressText={step > 1 ? selectedAddress?.address : undefined}
        windowLabel={
          step > 2 && selectedWindow ? `${selectedWindow.dateLabel} · ${selectedWindow.label}` : undefined
        }
        changeLabel={step > 3 ? changeValue : undefined}
      />
      <PageWrapper className="gap-6">
      {/* Step progress */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => (step === 1 ? router.push("/") : setStep((s) => (s - 1) as Step))}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[#37751A] border border-[#8DC573] hover:bg-[#EFF8DD] transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} color="currentColor" />
        </button>

        {([1, 2, 3, 4] as Step[]).map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              s <= step ? "bg-[#6CAC4F]" : "bg-[#e0e8dc]"
            }`}
          />
        ))}

        <button
          onClick={() => canAdvanceFrom(step) && setStep((s) => (s + 1) as Step)}
          tabIndex={step < 4 && canAdvanceFrom(step) ? 0 : -1}
          className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[#37751A] border border-[#8DC573] transition-opacity duration-200 ${
            step < 4 && canAdvanceFrom(step)
              ? "opacity-100 hover:bg-[#EFF8DD]"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" />
        </button>
      </div>

      {step === 1 && (
        <SectionCard label="Delivery address">
          <div className="p-4 space-y-3">
            {addresses.length === 0 && !addingAddress && (
              <p className="text-[#616A5C] text-sm text-center py-4">
                No addresses saved yet — add one below.
              </p>
            )}

            {addresses.map((addr) =>
              editingAddressId === addr.id ? (
                <AddressForm
                  key={addr.id}
                  initial={{
                    id: addr.id,
                    label: addr.label ?? "",
                    address: addr.address,
                    notes: addr.notes ?? "",
                    districtId: addr.districtId,
                  }}
                  onSaved={(id) => {
                    setSelectedAddressId(id);
                    setEditingAddressId(null);
                  }}
                  onCancel={() => setEditingAddressId(null)}
                />
              ) : (
                <div
                  key={addr.id}
                  className={`w-full rounded-xl border-[2px] px-4 py-3 flex items-center gap-2 transition-colors ${
                    selectedAddressId === addr.id
                      ? "border-[#6CAC4F] bg-[#EFF8DD]"
                      : "border-[rgba(217,217,217,0.5)] bg-[#F7F7F7] hover:border-[#8DC573]"
                  }`}
                >
                  <button
                    onClick={() => setSelectedAddressId(addr.id)}
                    className="flex-1 min-w-0 text-left"
                  >
                    <p className="font-semibold text-[#37751A] text-[14px]">{addr.label ?? "Address"}</p>
                    <p className="text-sm text-[#616A5C] opacity-80 mt-0.5">{addr.address}</p>
                    {addr.notes && (
                      <p className="text-xs text-[#616A5C] opacity-60 mt-0.5 italic">{addr.notes}</p>
                    )}
                  </button>
                  <button
                    onClick={() => setEditingAddressId(addr.id)}
                    className="shrink-0 p-1.5 text-[#616A5C] opacity-60 hover:opacity-100 hover:text-[#37751A] transition-colors"
                    aria-label={`Edit ${addr.label ?? "address"}`}
                  >
                    <HugeiconsIcon icon={PencilEdit01Icon} size={18} color="currentColor" />
                  </button>
                </div>
              )
            )}

            {addingAddress ? (
              <AddressForm
                onSaved={(id) => {
                  setSelectedAddressId(id);
                  setAddingAddress(false);
                }}
                onCancel={() => setAddingAddress(false)}
              />
            ) : (
              <button
                onClick={() => setAddingAddress(true)}
                className="w-full text-left rounded-xl border-[2px] border-dashed border-[rgba(217,217,217,0.6)] px-4 py-3 text-sm font-semibold text-[#37751A] hover:border-[#8DC573] hover:bg-[#EFF8DD] transition-colors"
              >
                + Add address
              </button>
            )}

            <PillButton
              onClick={() => { if (selectedAddressId) setStep(2); }}
              disabled={!selectedAddressId}
              className="w-full mt-2"
            >
              Next →
            </PillButton>
          </div>
        </SectionCard>
      )}

      {step === 2 && (
        <SectionCard label="Delivery window">
          <div className="p-4 space-y-3">
            {isDev && (
              <label className="flex items-center gap-2 text-xs text-[#616A5C] opacity-70 bg-[#F7F7F7] rounded-lg px-3 py-2">
                <input
                  type="checkbox"
                  checked={devBypassCutoff}
                  onChange={(e) => setDevBypassCutoff(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#37751A]"
                />
                Dev: ignore cutoff, always allow &quot;Today&quot;
              </label>
            )}
            {windows.length === 0 ? (
              <p className="text-[#616A5C] text-sm text-center py-4">
                No delivery windows available today or tomorrow.
              </p>
            ) : (
              windows.map((w) => {
                const key = `${w.scheduleId}-${w.dateLabel}`;
                const isSelected =
                  selectedWindow?.scheduleId === w.scheduleId &&
                  selectedWindow?.dateLabel === w.dateLabel;
                return (
                  <button
                    key={key}
                    onClick={() => !w.isPast && setSelectedWindow(w)}
                    disabled={w.isPast}
                    className={`w-full text-left rounded-xl border-[2px] px-4 py-3 transition-colors ${
                      isSelected
                        ? "border-[#6CAC4F] bg-[#EFF8DD]"
                        : w.isPast
                        ? "border-[rgba(217,217,217,0.3)] bg-[#F7F7F7] opacity-40 cursor-not-allowed"
                        : "border-[rgba(217,217,217,0.5)] bg-[#F7F7F7] hover:border-[#8DC573]"
                    }`}
                  >
                    <p className="font-semibold text-[#37751A] text-[14px]">{w.dateLabel}</p>
                    <p className="text-sm text-[#616A5C] opacity-80 mt-0.5">
                      {w.label}
                      {w.isPast && <span> · Cutoff passed</span>}
                    </p>
                  </button>
                );
              })
            )}
            <div className="flex gap-3 mt-2">
              <PillButton onClick={() => setStep(1)} variant="outline" className="flex-1">
                ← Back
              </PillButton>
              <PillButton
                onClick={() => { if (selectedWindow) setStep(3); }}
                disabled={!selectedWindow}
                className="flex-1"
              >
                Next →
              </PillButton>
            </div>
          </div>
        </SectionCard>
      )}

      {step === 3 && (
        <SectionCard label="Change needed?">
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {CHANGE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setChange(opt)}
                  className={`rounded-xl py-6 text-[26px] font-semibold transition-colors ${
                    change === opt
                      ? "bg-[rgba(81,170,39,0.5)] text-[#2F521F]"
                      : "bg-[rgba(81,170,39,0.12)] text-[#4B8331] hover:bg-[rgba(81,170,39,0.25)]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {change === "Other" && (
              <input
                type="text"
                placeholder="Enter amount (e.g. $35)"
                value={customChange}
                onChange={(e) => setCustomChange(e.target.value)}
                className="w-full bg-[#F7F7F7] border-[2px] border-[rgba(217,217,217,0.3)] rounded-xl px-8 py-6 text-[30px] text-[#616A5C] focus:outline-none focus:border-[#8DC573] transition-colors"
              />
            )}
            <div className="flex gap-3 mt-2">
              <PillButton onClick={() => setStep(2)} variant="outline" className="flex-1">
                ← Back
              </PillButton>
              <PillButton onClick={() => setStep(4)} className="flex-1">
                Next →
              </PillButton>
            </div>
          </div>
        </SectionCard>
      )}

      {step === 4 && (
        <SectionCard label="Confirm order">
          <div className="p-4 space-y-4">
            <div className="space-y-1.5">
              <SectionLabel>Address</SectionLabel>
              <p className="text-[#37751A] font-semibold text-[15px]">
                {selectedAddress?.label ?? "Address"}
              </p>
              <p className="text-sm text-[#616A5C] opacity-80">{selectedAddress?.address}</p>
              {selectedAddress?.notes && (
                <p className="text-sm text-[#616A5C] opacity-70 italic">{selectedAddress.notes}</p>
              )}
            </div>

            <div className="border-t border-[#6CAC4F]/20 pt-3 space-y-1.5">
              <SectionLabel>Delivery</SectionLabel>
              <p className="text-[#37751A] font-semibold text-[15px]">
                {selectedWindow?.dateLabel} · {selectedWindow?.label}
              </p>
            </div>

            <div className="border-t border-[#6CAC4F]/20 pt-3 space-y-2">
              <SectionLabel>Items</SectionLabel>
              {items.map((i) => (
                <div key={i.productId} className="flex justify-between items-start text-sm gap-2">
                  <span className="text-[#616A5C] flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="truncate">
                      {i.productName} × {i.categoryName && `${i.categoryName} · `}
                      {formatQuantityLabel(i.tierUnitOfMeasure, i.tierShownAs, i.quantity)}
                    </span>
                    {i.productType && (
                      <span className="text-[9px] uppercase tracking-wide font-semibold text-[#616A5C] border border-[#c8d9c2] rounded px-1 py-0.5 shrink-0">
                        {i.productType}
                      </span>
                    )}
                  </span>
                  <span className="text-[#37751A] font-semibold shrink-0">{formatCents(i.unitPriceCents * i.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#6CAC4F]/20 pt-3 flex justify-between items-center">
              <span className="text-[#616A5C] font-medium">Total</span>
              <span className="text-[#4C922C] font-bold text-xl">{formatCents(total)}</span>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#616A5C] opacity-80">
                Special instructions (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Gate code, buzzer, leave at door…"
                rows={3}
                className="w-full bg-[#F7F7F7] border-[2px] border-[rgba(217,217,217,0.3)] rounded-xl px-4 py-3 text-[15px] text-[#616A5C] focus:outline-none focus:border-[#8DC573] transition-colors resize-none placeholder:opacity-50"
              />
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <div className="flex gap-3">
              <PillButton onClick={() => setStep(3)} variant="outline" className="flex-1">
                ← Back
              </PillButton>
              <PillButton
                onClick={handlePlaceOrder}
                disabled={createOrder.isPending}
                className="flex-1"
              >
                {createOrder.isPending ? "Placing…" : "Place order"}
              </PillButton>
            </div>
          </div>
        </SectionCard>
      )}
      </PageWrapper>
    </>
  );
}

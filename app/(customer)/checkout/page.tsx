"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { useCart } from "@/lib/store/cart";
import { formatCents } from "@/lib/utils/discount";
import { getAvailableWindows, type DeliveryWindow } from "@/lib/utils/delivery";

type Step = 1 | 2 | 3 | 4;

const CHANGE_OPTIONS = ["$5", "$10", "$15", "$20", "$25", "No change", "Other"];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCents, clear } = useCart();
  const total = totalCents();

  const [step, setStep] = useState<Step>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<DeliveryWindow | null>(null);
  const [change, setChange] = useState("No change");
  const [customChange, setCustomChange] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const { data: me } = trpc.users.me.useQuery();
  const { data: schedules = [] } = trpc.orders.getDeliverySchedules.useQuery();

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: (order) => {
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
  const windows = getAvailableWindows(districtSchedules);

  const handlePlaceOrder = () => {
    if (!selectedAddressId || !selectedWindow) return;
    const changeValue = change === "Other" ? customChange : change;
    createOrder.mutate({
      addressId: selectedAddressId,
      deliveryDate: selectedWindow.date.toISOString(),
      timeslot: selectedWindow.label,
      change: changeValue === "No change" ? undefined : changeValue,
      comment: comment || undefined,
      isUsePoint: false,
      items: items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        quantity: i.quantity,
        unitPriceCents: i.unitPriceCents,
      })),
    });
  };

  if (items.length === 0) {
    if (typeof window !== "undefined") router.push("/");
    return null;
  }

  return (
    <div className="flex flex-1 flex-col max-w-2xl mx-auto w-full px-4 py-6 gap-6">
      <div className="flex items-center gap-2">
        {([1, 2, 3, 4] as Step[]).map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              s <= step ? "bg-green-500" : "bg-zinc-800"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Delivery address</h2>
          {addresses.length === 0 ? (
            <p className="text-zinc-400 text-sm">
              No addresses saved. Add one in your{" "}
              <a href="/profile" className="text-green-400 underline">
                profile
              </a>
              .
            </p>
          ) : (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                    selectedAddressId === addr.id
                      ? "border-green-500 bg-green-950 text-white"
                      : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  <p className="font-medium">{addr.label ?? "Address"}</p>
                  <p className="text-sm text-zinc-400">{addr.address}</p>
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => {
              if (selectedAddressId) setStep(2);
            }}
            disabled={!selectedAddressId}
            className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Delivery window</h2>
          {windows.length === 0 ? (
            <p className="text-zinc-400 text-sm">
              No delivery windows available today or tomorrow.
            </p>
          ) : (
            <div className="space-y-2">
              {windows.map((w) => {
                const key = `${w.scheduleId}-${w.dateLabel}`;
                const isSelected =
                  selectedWindow?.scheduleId === w.scheduleId &&
                  selectedWindow?.dateLabel === w.dateLabel;
                return (
                  <button
                    key={key}
                    onClick={() => !w.isPast && setSelectedWindow(w)}
                    disabled={w.isPast}
                    className={`w-full text-left rounded-xl border px-4 py-3 transition-colors ${
                      isSelected
                        ? "border-green-500 bg-green-950 text-white"
                        : w.isPast
                        ? "border-zinc-800 bg-zinc-900 text-zinc-600 cursor-not-allowed"
                        : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
                    }`}
                  >
                    <p className="font-medium">{w.dateLabel}</p>
                    <p className="text-sm">
                      {w.label}
                      {w.isPast && (
                        <span className="text-zinc-500"> · Cutoff passed</span>
                      )}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl border border-zinc-700 py-3 text-zinc-300 hover:border-zinc-500 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => {
                if (selectedWindow) setStep(3);
              }}
              disabled={!selectedWindow}
              className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Change needed?</h2>
          <div className="grid grid-cols-3 gap-2">
            {CHANGE_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setChange(opt)}
                className={`rounded-xl border py-3 text-sm font-medium transition-colors ${
                  change === opt
                    ? "border-green-500 bg-green-950 text-green-300"
                    : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600"
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
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 rounded-xl border border-zinc-700 py-3 text-zinc-300 hover:border-zinc-500 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-500 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Confirm order</h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 divide-y divide-zinc-800">
            <div className="px-4 py-3 space-y-1">
              <p className="text-xs text-zinc-500 uppercase tracking-wide">
                Delivery
              </p>
              <p className="text-white">
                {selectedWindow?.dateLabel} · {selectedWindow?.label}
              </p>
            </div>
            <div className="px-4 py-3 space-y-2">
              <p className="text-xs text-zinc-500 uppercase tracking-wide">
                Items
              </p>
              {items.map((i) => (
                <div key={i.productId} className="flex justify-between text-sm">
                  <span className="text-zinc-300">
                    {i.productName} × {i.quantity}
                  </span>
                  <span className="text-white">
                    {formatCents(i.unitPriceCents * i.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 flex justify-between font-semibold text-white">
              <span>Total</span>
              <span>{formatCents(total)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-zinc-400">
              Special instructions (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Gate code, buzzer, leave at door…"
              rows={3}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="flex-1 rounded-xl border border-zinc-700 py-3 text-zinc-300 hover:border-zinc-500 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={createOrder.isPending}
              className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white hover:bg-green-500 disabled:opacity-50 transition-colors"
            >
              {createOrder.isPending ? "Placing…" : "Place order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

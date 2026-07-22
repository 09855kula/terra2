"use client";
import { useRef, useState } from "react";
import { trpc } from "@/lib/trpc/client";

const STAGES = [
  { key: "20min", label: "20 min" },
  { key: "10min", label: "10 min" },
  { key: "5min", label: "5 min" },
  { key: "here", label: "Here" },
] as const;

type StageKey = (typeof STAGES)[number]["key"];

const CONFIRM_WINDOW_MS = 4000;
const SENT_FLASH_MS = 2500;

export function DeliveryUpdateButtons({ orderId }: { orderId: number }) {
  const [awaiting, setAwaiting] = useState<StageKey | null>(null);
  const [justSent, setJustSent] = useState<StageKey | null>(null);
  const [lastSent, setLastSent] = useState<{ label: string; phone: string; sentAt: string } | null>(null);
  const confirmTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sendUpdate = trpc.admin.orders.sendDeliveryUpdate.useMutation({
    onSuccess: (result, variables) => {
      setLastSent(result);
      setJustSent(variables.stage);
      if (sentTimeout.current) clearTimeout(sentTimeout.current);
      sentTimeout.current = setTimeout(() => setJustSent(null), SENT_FLASH_MS);
    },
  });

  const clearConfirmTimeout = () => {
    if (confirmTimeout.current) clearTimeout(confirmTimeout.current);
    confirmTimeout.current = null;
  };

  const handleClick = (stage: StageKey) => {
    if (awaiting === stage) {
      clearConfirmTimeout();
      setAwaiting(null);
      sendUpdate.mutate({ id: orderId, stage });
      return;
    }

    // Tapping a different button cancels any pending confirm and starts fresh.
    clearConfirmTimeout();
    setAwaiting(stage);
    confirmTimeout.current = setTimeout(() => setAwaiting(null), CONFIRM_WINDOW_MS);
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {STAGES.map(({ key, label }) => {
          const isAwaiting = awaiting === key;
          const isJustSent = justSent === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleClick(key)}
              disabled={sendUpdate.isPending}
              className={`h-12 rounded-xl border-[2px] text-sm font-semibold transition-colors disabled:opacity-60 ${
                isJustSent
                  ? "border-[#37751A] bg-[#37751A] text-white"
                  : isAwaiting
                    ? "border-[#37751A] bg-[#EFF8DD] text-[#37751A]"
                    : "border-[#c8d9c2] text-[#3A6426] hover:border-[#6CAC4F] hover:bg-[#EFF8DD]"
              }`}
            >
              {isJustSent ? "Sent ✓" : isAwaiting ? "Tap again" : label}
            </button>
          );
        })}
      </div>

      {sendUpdate.isError && (
        <p className="text-xs text-red-500 mt-2">Failed to send: {sendUpdate.error.message}</p>
      )}

      {lastSent && !sendUpdate.isError && (
        <p className="text-xs text-[#616A5C] opacity-70 mt-2">
          last sent: {lastSent.label} to {lastSent.phone} at{" "}
          {new Date(lastSent.sentAt).toLocaleTimeString("en-CA", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      )}
    </div>
  );
}

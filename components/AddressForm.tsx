"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { PillButton } from "@/components/ui/PillButton";

const inputClass =
  "w-full bg-[#F7F7F7] border-[2px] border-[rgba(217,217,217,0.3)] rounded-xl px-4 py-3 text-[15px] text-[#616A5C] focus:outline-none focus:border-[#8DC573] transition-colors placeholder:opacity-50";

export function AddressForm({
  onSaved,
  onCancel,
}: {
  onSaved: (addressId: number) => void;
  onCancel: () => void;
}) {
  const utils = trpc.useUtils();
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const addAddress = trpc.users.addAddress.useMutation({
    onSuccess: (addr) => {
      utils.users.me.invalidate();
      onSaved(addr.id);
    },
    onError: (e) => setError(e.message),
  });

  const handleSave = () => {
    if (address.trim().length < 5) {
      setError("Enter a full delivery address");
      return;
    }
    addAddress.mutate({
      address: address.trim(),
      label: label.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="rounded-xl border-[2px] border-[rgba(217,217,217,0.5)] bg-[#F7F7F7]/60 p-4 space-y-3">
      <input
        type="text"
        value={label}
        onChange={(e) => { setLabel(e.target.value); setError(""); }}
        placeholder="Label (e.g. Home, Work, Mom's place)"
        className={inputClass}
      />
      <textarea
        value={address}
        onChange={(e) => { setAddress(e.target.value); setError(""); }}
        placeholder="Delivery address"
        rows={2}
        className={`${inputClass} resize-none`}
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Delivery notes (gate code, buzzer, leave at door…)"
        rows={2}
        className={`${inputClass} resize-none`}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <PillButton onClick={onCancel} variant="outline" className="flex-1 h-11 text-[14px]">
          Cancel
        </PillButton>
        <PillButton onClick={handleSave} disabled={addAddress.isPending} className="flex-1 h-11 text-[14px]">
          {addAddress.isPending ? "Saving…" : "Save address"}
        </PillButton>
      </div>
    </div>
  );
}

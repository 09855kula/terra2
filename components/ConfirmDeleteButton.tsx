"use client";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, Tick01Icon } from "@hugeicons/core-free-icons";

export function ConfirmDeleteButton({
  confirm,
  size = 20,
}: {
  confirm: () => void;
  size?: number;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <button
        onClick={() => {
          confirm();
          setConfirming(false);
        }}
        onBlur={() => setConfirming(false)}
        className="shrink-0 text-white bg-red-500 hover:bg-red-600 transition-colors rounded-full p-1"
      >
        <HugeiconsIcon icon={Tick01Icon} size={size} color="currentColor" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="shrink-0 text-[#616A5C] opacity-50 hover:opacity-80 hover:text-red-500 transition-all p-1"
    >
      <HugeiconsIcon icon={Delete01Icon} size={size} color="currentColor" />
    </button>
  );
}

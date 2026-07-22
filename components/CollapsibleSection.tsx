"use client";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

export function CollapsibleSection({
  title,
  defaultOpen = true,
  headerClassName = "px-8 py-3",
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  headerClassName?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between text-left hover:bg-[#EFF8DD]/60 transition-colors ${headerClassName}`}
      >
        <span className="text-[#2F521F] font-semibold text-[18px] opacity-80">{title}</span>
        <span className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <HugeiconsIcon icon={ArrowDown01Icon} size={18} color="currentColor" />
        </span>
      </button>
      {open && children}
    </div>
  );
}

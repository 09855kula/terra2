"use client";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  User02Icon,
} from "@hugeicons/core-free-icons";

export function Header() {
  const itemCount = useCart((s) => s.itemCount());

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold text-white">
          Terra
        </Link>
        <div className="flex items-center gap-1">
          <Link
            href="/cart"
            className="relative p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <HugeiconsIcon icon={ShoppingBag01Icon} size={22} color="currentColor" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
          <Link
            href="/profile"
            className="p-2 text-zinc-400 hover:text-white transition-colors"
          >
            <HugeiconsIcon icon={User02Icon} size={22} color="currentColor" />
          </Link>
        </div>
      </div>
    </header>
  );
}

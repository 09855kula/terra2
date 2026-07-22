"use client";
import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { trpc } from "@/lib/trpc/client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag01Icon,
  User02Icon,
  PackageDelivered01Icon,
  UserShield01Icon,
} from "@hugeicons/core-free-icons";

export function Header() {
  const itemCount = useCart((s) => s.itemCount());
  const { data: me } = trpc.users.me.useQuery();

  return (
    <header
      className="sticky top-0 z-40 h-[70px]"
      style={{ background: "linear-gradient(92.28deg, #6CAC4F 0%, #84BC6B 98.72%)" }}
    >
      <div className="mx-auto flex h-full max-w-2xl items-center justify-between px-5">
        <Link href="/" className="text-xl font-bold text-white tracking-wide select-none">
          Terra
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/cart" className="relative p-2 text-white/90 hover:text-white transition-colors">
            <HugeiconsIcon icon={ShoppingBag01Icon} size={24} color="currentColor" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-[#37751A]">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
          <Link href="/orders" className="p-2 text-white/90 hover:text-white transition-colors">
            <HugeiconsIcon icon={PackageDelivered01Icon} size={24} color="currentColor" />
          </Link>
          <Link href="/profile" className="p-2 text-white/90 hover:text-white transition-colors">
            <HugeiconsIcon icon={User02Icon} size={24} color="currentColor" />
          </Link>
          {me?.isAdmin && (
            <Link
              href="/admin/orders"
              className="p-2 text-white/90 hover:text-white transition-colors"
              title="Admin panel"
            >
              <HugeiconsIcon icon={UserShield01Icon} size={24} color="currentColor" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

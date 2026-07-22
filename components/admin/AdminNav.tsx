"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

const NAV_ITEMS = [
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/approvals", label: "Approvals" },
] as const;

// Badge counts don't need to be second-accurate — cache them for a bit so
// switching between admin pages (or tabbing away and back) doesn't refire
// three COUNT() queries every time. Mutations that change these numbers
// (approve/reject/status-change) explicitly invalidate this query, so it
// still updates immediately after any action that actually moves the count.
const NAV_COUNTS_STALE_TIME_MS = 30_000;

export function AdminNav() {
  const pathname = usePathname();
  const { data: counts } = trpc.admin.navCounts.useQuery(undefined, {
    staleTime: NAV_COUNTS_STALE_TIME_MS,
  });

  const badgeFor = (href: (typeof NAV_ITEMS)[number]["href"]) =>
    href === "/admin/orders" ? (counts?.newOrders ?? 0) : (counts?.pendingApprovals ?? 0);

  return (
    <nav className="sticky top-[70px] z-30 bg-white border-b border-[#e8f0e4]">
      <div className="mx-auto flex max-w-2xl px-4">
        {NAV_ITEMS.map(({ href, label }) => {
          const active = pathname.startsWith(href);
          const count = badgeFor(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                active
                  ? "border-[#37751A] text-[#37751A]"
                  : "border-transparent text-[#616A5C] opacity-70 hover:opacity-100"
              }`}
            >
              {label}
              {count > 0 && (
                <span
                  className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                    active ? "bg-[#37751A] text-white" : "bg-[#c8d9c2] text-[#3A6426]"
                  }`}
                >
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

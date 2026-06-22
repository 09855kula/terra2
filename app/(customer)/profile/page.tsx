"use client";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cart";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { clear } = useCart();
  const { data: me, isLoading } = trpc.users.me.useQuery();

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    clear();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-zinc-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col max-w-2xl mx-auto w-full px-4 py-6 gap-6">
      <div>
        <h1 className="text-xl font-bold text-white">
          {me?.firstName ? `Hey, ${me.firstName}` : "Profile"}
        </h1>
        <p className="text-zinc-400 text-sm mt-1">{me?.phone}</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Delivery addresses
        </h2>
        {(me?.addresses ?? []).length === 0 ? (
          <p className="text-zinc-500 text-sm">No addresses saved yet.</p>
        ) : (
          <div className="space-y-2">
            {me?.addresses.map((addr, idx) => (
              <div
                key={addr.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500 shrink-0">
                    {idx + 1}.
                  </span>
                  <span className="text-white text-sm flex-1">{addr.address}</span>
                  {addr.isPrimary && (
                    <span className="text-[10px] text-green-400 border border-green-800 rounded px-1.5 py-0.5 shrink-0">
                      Primary
                    </span>
                  )}
                </div>
                {addr.label && (
                  <p className="text-xs text-zinc-500 mt-1 ml-5">{addr.label}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {(me?.points ?? 0) > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
          <p className="text-sm text-zinc-400">Points balance</p>
          <p className="text-2xl font-bold text-white mt-1">{me?.points}</p>
          <p className="text-xs text-zinc-500 mt-1">
            Discount value: TBD (pending client confirmation)
          </p>
        </div>
      )}

      <div className="space-y-2 mt-auto">
        <Link
          href="/orders"
          className="block w-full rounded-xl border border-zinc-700 py-3 text-center text-zinc-300 hover:border-zinc-500 transition-colors"
        >
          Order history
        </Link>
        <button
          onClick={logout}
          className="w-full rounded-xl border border-red-900 py-3 text-red-400 hover:border-red-700 transition-colors"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

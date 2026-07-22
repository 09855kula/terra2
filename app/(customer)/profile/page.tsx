"use client";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store/cart";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { PageWrapper } from "@/components/ui/PageWrapper";

export default function ProfilePage() {
  const router = useRouter();
  const { clear } = useCart();
  const { data: me, isLoading } = trpc.users.me.useQuery();

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    clear();
    router.push("/login");
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <PageWrapper className="gap-5">
      {/* Name + phone */}
      <Card className="px-5 py-4">
        <h1 className="text-[22px] font-bold text-[#37751A]">
          {me?.firstName ? `Hey, ${me.firstName}` : "Profile"}
        </h1>
        <p className="text-[#616A5C] opacity-80 text-sm mt-1">{me?.phone}</p>
      </Card>

      {/* Points */}
      {(me?.points ?? 0) > 0 && (
        <Card className="px-5 py-4">
          <SectionLabel>Points balance</SectionLabel>
          <p className="text-[#4C922C] font-bold text-3xl mt-1">{me?.points}</p>
        </Card>
      )}

      {/* Addresses */}
      <div>
        <div className="mb-2 px-1">
          <SectionLabel>Delivery addresses</SectionLabel>
        </div>
        {(me?.addresses ?? []).length === 0 ? (
          <Card className="px-5 py-4">
            <p className="text-[#616A5C] opacity-60 text-sm">No addresses saved yet.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {me?.addresses.map((addr) => (
              <Card key={addr.id} className="px-5 py-3.5 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[#37751A] font-semibold text-[14px]">
                      {addr.label ?? "Address"}
                    </span>
                    {addr.isPrimary && (
                      <span className="text-[10px] font-semibold text-[#6CAC4F] border border-[#6CAC4F] rounded px-1.5 py-0.5 shrink-0">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#616A5C] opacity-80 mt-0.5 truncate">{addr.address}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3 mt-auto pt-4">
        <PillButton href="/orders" variant="outline" className="w-full">
          Order history
        </PillButton>
        <PillButton onClick={logout} variant="danger" className="w-full text-red-500">
          Log out
        </PillButton>
      </div>
    </PageWrapper>
  );
}

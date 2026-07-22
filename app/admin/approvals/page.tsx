"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { formatDateTime } from "@/lib/utils/datetime";
import { Card } from "@/components/ui/Card";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { PageWrapper } from "@/components/ui/PageWrapper";

type Tab = "addresses" | "accounts";

type PendingAddress = {
  id: number;
  label: string | null;
  address: string;
  notes: string | null;
  districtId: number | null;
  createdAt: Date | string;
  customerFirstName: string | null;
  customerLastName: string | null;
  customerPhone: string;
};

type District = { id: number; code: string; name: string | null; sortOrder: number | null };

type PendingAccount = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  phone: string;
  email: string | null;
  createdAt: Date | string;
};

const selectClass =
  "w-full bg-[#F7F7F7] border-[2px] border-[rgba(217,217,217,0.5)] rounded-xl px-3 py-2.5 text-sm text-[#616A5C] focus:outline-none focus:border-[#8DC573] transition-colors disabled:opacity-60";

const approveBtnClass =
  "flex-1 h-10 rounded-full bg-[#37751A] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed";

const rejectBtnClass =
  "flex-1 h-10 rounded-full border-[2px] border-red-200 text-red-400 text-sm font-semibold hover:border-red-300 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

function customerName(first: string | null, last: string | null): string {
  return [first, last].filter(Boolean).join(" ") || "Customer";
}

function AddressCard({ address, districts }: { address: PendingAddress; districts: District[] }) {
  const utils = trpc.useUtils();
  const [districtId, setDistrictId] = useState<number | null>(address.districtId);

  const approve = trpc.admin.approvals.approveAddress.useMutation({
    onSuccess: () => {
      utils.admin.approvals.addresses.invalidate();
      utils.admin.navCounts.invalidate();
    },
  });
  const reject = trpc.admin.approvals.rejectAddress.useMutation({
    onSuccess: () => {
      utils.admin.approvals.addresses.invalidate();
      utils.admin.navCounts.invalidate();
    },
  });

  const pending = approve.isPending || reject.isPending;

  return (
    <Card className="px-5 py-4 space-y-3">
      <div>
        <p className="text-[#37751A] font-semibold text-[15px]">
          {customerName(address.customerFirstName, address.customerLastName)}
        </p>
        <p className="text-sm text-[#616A5C] opacity-80">{address.customerPhone}</p>
      </div>

      <div>
        <p className="text-sm font-semibold text-[#616A5C]">{address.label ?? "Address"}</p>
        <p className="text-sm text-[#616A5C] opacity-80">{address.address}</p>
        {address.notes && <p className="text-xs text-[#616A5C] opacity-60 mt-1">Note: {address.notes}</p>}
      </div>

      <p className="text-xs text-[#616A5C] opacity-60">Submitted {formatDateTime(address.createdAt)}</p>

      <select
        value={districtId ?? ""}
        onChange={(e) => setDistrictId(e.target.value ? Number(e.target.value) : null)}
        disabled={pending}
        className={selectClass}
      >
        <option value="">Select district…</option>
        {districts.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name ?? d.code}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <button
          onClick={() => districtId && approve.mutate({ id: address.id, districtId })}
          disabled={!districtId || pending}
          className={approveBtnClass}
        >
          Approve
        </button>
        <button onClick={() => reject.mutate({ id: address.id })} disabled={pending} className={rejectBtnClass}>
          Reject
        </button>
      </div>

      {(approve.isError || reject.isError) && (
        <p className="text-xs text-red-500">{(approve.error ?? reject.error)?.message}</p>
      )}
    </Card>
  );
}

function AccountCard({ account }: { account: PendingAccount }) {
  const utils = trpc.useUtils();

  const approve = trpc.admin.approvals.approveAccount.useMutation({
    onSuccess: () => {
      utils.admin.approvals.accounts.invalidate();
      utils.admin.navCounts.invalidate();
    },
  });
  const reject = trpc.admin.approvals.rejectAccount.useMutation({
    onSuccess: () => {
      utils.admin.approvals.accounts.invalidate();
      utils.admin.navCounts.invalidate();
    },
  });

  const pending = approve.isPending || reject.isPending;

  return (
    <Card className="px-5 py-4 space-y-2">
      <p className="text-[#37751A] font-semibold text-[15px]">
        {customerName(account.firstName, account.lastName)}
      </p>
      <p className="text-sm text-[#616A5C] opacity-80">{account.phone}</p>
      {account.email && <p className="text-sm text-[#616A5C] opacity-80">{account.email}</p>}
      <p className="text-xs text-[#616A5C] opacity-60">Signed up {formatDateTime(account.createdAt)}</p>

      <div className="flex gap-2 pt-1">
        <button onClick={() => approve.mutate({ id: account.id })} disabled={pending} className={approveBtnClass}>
          Approve
        </button>
        <button onClick={() => reject.mutate({ id: account.id })} disabled={pending} className={rejectBtnClass}>
          Reject
        </button>
      </div>

      {(approve.isError || reject.isError) && (
        <p className="text-xs text-red-500">{(approve.error ?? reject.error)?.message}</p>
      )}
    </Card>
  );
}

export default function ApprovalsPage() {
  const [tab, setTab] = useState<Tab>("addresses");

  // This is an active work queue — override the global 30s default so an
  // admin approving/rejecting through the list doesn't act on a stale view.
  const addresses = trpc.admin.approvals.addresses.useQuery(undefined, { staleTime: 0 });
  const accounts = trpc.admin.approvals.accounts.useQuery(undefined, { staleTime: 0 });
  // Districts are static reference data — cache much longer than the default.
  const districts = trpc.admin.approvals.districts.useQuery(undefined, { staleTime: 5 * 60_000 });

  const addressCount = addresses.data?.length ?? 0;
  const accountCount = accounts.data?.length ?? 0;

  const tabClass = (active: boolean) =>
    `flex-1 flex items-center justify-center gap-1.5 h-11 rounded-full border-[2px] text-sm font-semibold transition-colors ${
      active
        ? "border-[#37751A] bg-[#37751A] text-white"
        : "border-[#c8d9c2] text-[#3A6426] hover:border-[#6CAC4F] hover:bg-[#EFF8DD]"
    }`;

  const badgeClass = (active: boolean) =>
    `flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
      active ? "bg-white text-[#37751A]" : "bg-[#c8d9c2] text-[#3A6426]"
    }`;

  return (
    <PageWrapper className="gap-4">
      <h1 className="text-xl font-bold text-[#37751A]">Approvals</h1>

      <div className="flex gap-2">
        <button className={tabClass(tab === "addresses")} onClick={() => setTab("addresses")}>
          Addresses
          {addressCount > 0 && (
            <span className={badgeClass(tab === "addresses")}>{addressCount > 9 ? "9+" : addressCount}</span>
          )}
        </button>
        <button className={tabClass(tab === "accounts")} onClick={() => setTab("accounts")}>
          Accounts
          {accountCount > 0 && (
            <span className={badgeClass(tab === "accounts")}>{accountCount > 9 ? "9+" : accountCount}</span>
          )}
        </button>
      </div>

      {tab === "addresses" ? (
        addresses.isLoading || districts.isLoading ? (
          <LoadingScreen />
        ) : !addresses.data || addresses.data.length === 0 ? (
          <Card className="px-5 py-4">
            <p className="text-sm text-[#616A5C] opacity-60">No addresses waiting on approval.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {addresses.data.map((address) => (
              <AddressCard key={address.id} address={address} districts={districts.data ?? []} />
            ))}
          </div>
        )
      ) : accounts.isLoading ? (
        <LoadingScreen />
      ) : !accounts.data || accounts.data.length === 0 ? (
        <Card className="px-5 py-4">
          <p className="text-sm text-[#616A5C] opacity-60">No accounts waiting on approval.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {accounts.data.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}
    </PageWrapper>
  );
}

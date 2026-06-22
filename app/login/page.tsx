"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";

type Step = "phone" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const requestOtp = trpc.auth.requestOtp.useMutation({
    onSuccess: () => {
      setStep("otp");
      setError("");
    },
    onError: (e) => setError(e.message),
  });

  const verifyOtp = trpc.auth.verifyOtp.useMutation({
    onSuccess: () => router.push("/"),
    onError: (e) => setError(e.message),
  });

  const handlePhone = (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Enter a valid phone number");
      return;
    }
    requestOtp.mutate({ phone: digits });
  };

  const handleOtpChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    setOtp(digits);
    if (digits.length === 4) {
      verifyOtp.mutate({ phone: phone.replace(/\D/g, ""), code: digits });
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-white">Terra</h1>
          <p className="text-zinc-400 text-sm">Cannabis delivery</p>
        </div>

        {step === "phone" ? (
          <form onSubmit={handlePhone} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError("");
                }}
                placeholder="+1 (204) 555-0100"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={requestOtp.isPending}
              className="w-full rounded-lg bg-green-600 py-2.5 font-medium text-white hover:bg-green-500 disabled:opacity-50 transition-colors"
            >
              {requestOtp.isPending ? "Sending…" : "Send code"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                4-digit code
              </label>
              <p className="text-xs text-zinc-500">
                Sent to {phone}
              </p>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(e) => handleOtpChange(e.target.value)}
                placeholder="••••"
                maxLength={4}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-3 text-center text-3xl tracking-[0.5em] text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
                disabled={verifyOtp.isPending}
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            {verifyOtp.isPending && (
              <p className="text-center text-sm text-zinc-400">Verifying…</p>
            )}
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
              }}
              className="w-full text-sm text-zinc-400 hover:text-zinc-200 transition-colors py-1"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

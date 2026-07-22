"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Card } from "@/components/ui/Card";
import { PillButton } from "@/components/ui/PillButton";

type Step = "phone" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const requestOtp = trpc.auth.requestOtp.useMutation({
    onSuccess: () => {
      setStep("otp");
      setError("");
      setTimeout(() => inputRefs[0].current?.focus(), 50);
    },
    onError: (e) => {
      if (e.data?.code === "NOT_FOUND") {
        setError("That number isn't in our system. Contact your rep to get set up.");
      } else {
        setError(e.message);
      }
    },
  });

  const verifyOtp = trpc.auth.verifyOtp.useMutation({
    onSuccess: () => router.push("/"),
    onError: (e) => {
      setError(e.message);
      setOtp(["", "", "", ""]);
      setTimeout(() => inputRefs[0].current?.focus(), 50);
    },
  });

  const handlePhone = (e: { preventDefault(): void }) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Enter a valid phone number");
      return;
    }
    requestOtp.mutate({ phone: digits });
  };

  const submitOtp = (code: string) => {
    if (code.length === 4 && !verifyOtp.isPending) {
      verifyOtp.mutate({ phone: phone.replace(/\D/g, ""), code });
    }
  };

  const handleOtpKey = (index: number, value: string) => {
    const digits = value.replace(/\D/g, "");

    if (digits.length > 1) {
      // Pasted a full code — distribute across boxes
      const next = [...otp];
      for (let i = 0; i < 4 - index && i < digits.length; i++) {
        next[index + i] = digits[i];
      }
      setOtp(next);
      setError("");
      const lastFilled = Math.min(index + digits.length, 3);
      inputRefs[lastFilled].current?.focus();
      if (next.every((d) => d !== "")) submitOtp(next.join(""));
      return;
    }

    const digit = digits.slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setError("");

    if (digit && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    if (next.every((d) => d !== "")) {
      submitOtp(next.join(""));
    }
  };

  const handleOtpBackspace = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === "Enter") {
      submitOtp(otp.join(""));
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#f3f3f3] px-5">
      <div className="w-full max-w-[336px]">
        {/* Brand header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#2F521F] tracking-tight">Terra</h1>
          <p className="text-[#616A5C] text-sm mt-1 opacity-80">Cannabis delivery</p>
        </div>

        <Card className="overflow-hidden">
          {/* Card label */}
          <div className="bg-[#ffffffcc] border-b border-[#e8f0e4] py-3 text-center">
            <p className="text-[#2F521F] font-semibold text-[15px] opacity-80">
              {step === "phone" ? "Sign in" : "Enter your code"}
            </p>
          </div>

          <div className="px-6 py-6">
            {step === "phone" ? (
              <form onSubmit={handlePhone} className="space-y-4">
                <p className="text-[#616A5C] text-[14px] text-center opacity-80 -mt-1 mb-4">
                  Enter your phone number to receive a 4-digit code
                </p>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(""); }}
                  placeholder="+1 (204) 555-0100"
                  className="w-full bg-[#F7F7F7] border-[2px] border-[rgba(217,217,217,0.3)] rounded-xl px-4 py-[15px] text-[16px] font-medium text-[#616A5C] placeholder:opacity-50 focus:outline-none focus:border-[#8DC573] transition-colors"
                  autoFocus
                />
                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                <PillButton
                  type="submit"
                  disabled={requestOtp.isPending}
                  className="w-full h-16 text-[18px] mt-2"
                >
                  {requestOtp.isPending ? "Sending…" : "Send code"}
                </PillButton>
              </form>
            ) : (
              <div className="space-y-5">
                <p className="text-[#616A5C] text-[14px] text-center opacity-80 -mt-1">
                  Sent to {phone}
                </p>

                {/* OTP boxes */}
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={inputRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpKey(i, e.target.value)}
                      onKeyDown={(e) => handleOtpBackspace(i, e)}
                      disabled={verifyOtp.isPending}
                      className="w-[60px] h-[60px] text-center text-2xl font-bold text-[#37751A] bg-white border-[2px] border-[rgba(217,217,217,0.4)] rounded-xl focus:outline-none focus:border-[#6CAC4F] transition-colors disabled:opacity-50 shadow-[0_1px_3px_rgba(73,129,47,0.08)]"
                    />
                  ))}
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                {verifyOtp.isPending && (
                  <p className="text-center text-sm text-[#616A5C] opacity-70">Verifying…</p>
                )}

                <button
                  type="button"
                  onClick={() => { setStep("phone"); setOtp(["", "", "", ""]); setError(""); }}
                  className="w-full text-sm text-[#616A5C] opacity-70 hover:opacity-100 transition-opacity py-1 text-center"
                >
                  ← Back
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}

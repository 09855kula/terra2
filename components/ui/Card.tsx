import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-white rounded-2xl shadow-card", className)}>
      {children}
    </div>
  );
}

export function SectionCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="bg-[#ffffffcc] rounded-t-2xl mx-auto w-[260px] py-3 text-center border-b border-[#e8f0e4]">
        <p className="text-[#2F521F] font-semibold text-[15px] opacity-80">{label}</p>
      </div>
      <div className="bg-white rounded-b-2xl shadow-card overflow-hidden">
        {children}
      </div>
    </div>
  );
}

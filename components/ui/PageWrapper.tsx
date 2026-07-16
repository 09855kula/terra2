import { cn } from "@/lib/utils";

export function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col max-w-2xl mx-auto w-full px-4 py-6 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

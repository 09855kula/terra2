import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "danger";

const variantClass: Record<Variant, string> = {
  primary: "text-white hover:opacity-90 transition-opacity",
  outline: "border-[2px] border-[#c8d9c2] text-[#3A6426] hover:border-[#6CAC4F] hover:bg-[#EFF8DD] transition-colors",
  danger: "border-[2px] border-red-200 text-red-400 hover:border-red-300 hover:bg-red-50 transition-colors",
};

const primaryStyle: React.CSSProperties = {
  background: "rgba(39, 122, 0, 0.65)",
  backdropFilter: "blur(8px)",
};

type BaseProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type AsPillButton = BaseProps & {
  href?: never;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
};

type AsPillLink = BaseProps & {
  href: string;
  onClick?: never;
  disabled?: never;
  type?: never;
};

export function PillButton({
  variant = "primary",
  className,
  children,
  ...props
}: AsPillButton | AsPillLink) {
  const base = cn(
    "h-14 rounded-full font-semibold text-[16px] flex items-center justify-center active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed",
    variantClass[variant],
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={base}
        style={variant === "primary" ? primaryStyle : undefined}
      >
        {children}
      </Link>
    );
  }

  const { onClick, disabled, type = "button" } = props as AsPillButton;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={base}
      style={variant === "primary" ? primaryStyle : undefined}
    >
      {children}
    </button>
  );
}

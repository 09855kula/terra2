export function calcEffectivePrice(
  basePriceCents: number,
  productDiscountPct: string | null,
  tierDiscountPct: string | null
): number {
  const pct = Math.max(
    parseFloat(productDiscountPct ?? "0"),
    parseFloat(tierDiscountPct ?? "0")
  );
  return Math.round(basePriceCents * (1 - pct / 100));
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatDollars(amount: string | null): string {
  if (!amount) return "$0.00";
  return `$${parseFloat(amount).toFixed(2)}`;
}

export function calcEffectivePrice(
  basePriceCents: number,
  productDiscountPct: string | null,
  tierDiscountPct: string | null,
  salePct: string | null = null
): number {
  // Highest of product, tier, or sale-day discount wins per item
  const pct = Math.max(
    parseFloat(productDiscountPct ?? "0"),
    parseFloat(tierDiscountPct ?? "0"),
    parseFloat(salePct ?? "0")
  );
  // TODO: apply VIP stackable discount on top once % is confirmed by Travis
  return Math.round(basePriceCents * (1 - pct / 100));
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatDollars(amount: string | null): string {
  if (!amount) return "$0.00";
  return `$${parseFloat(amount).toFixed(2)}`;
}

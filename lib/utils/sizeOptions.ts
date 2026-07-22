const MULTIPLIERS = [1, 2, 4, 8] as const;

export interface SizeOption {
  multiplier: number;
  label: string;
}

function isWeightUnit(unitOfMeasure: string | null): boolean {
  return unitOfMeasure === "g" || unitOfMeasure === "oz";
}

const GRAMS_PER_OUNCE = 28;

function formatGramAmount(amount: number): string {
  return Number.isInteger(amount) ? amount.toString() : amount.toFixed(1);
}

// Gram quantities convert to ounces once they cross 28g (1oz) — e.g. cart totals
// that climb past the initial 3.5g/7g/14g/28g presets via manual +/-. Gated on
// unitOfMeasure === "g" specifically (not just any weight unit) so this only
// fires for gram-denominated tiers; other unit types are untouched. Once
// products carry a per-product "convert to ounces" flag, gate on that instead.
export function formatWeight(grams: number, unitOfMeasure: string | null): string {
  if (unitOfMeasure !== "g" || grams < GRAMS_PER_OUNCE) {
    return `${formatGramAmount(grams)}g`;
  }
  const ounces = Math.floor(grams / GRAMS_PER_OUNCE);
  const remainder = grams - ounces * GRAMS_PER_OUNCE;
  return remainder === 0 ? `${ounces}oz` : `${ounces}oz ${formatGramAmount(remainder)}g`;
}

// buds shownAs "3.5g" -> 3.5g/7g/14g/28g (eighth/quarter/half/ounce),
// non-weight tiers (pod/pack/bar) -> x1/x2/x4/x8 of the tier's shownAs word.
export function getSizeOptions(
  unitOfMeasure: string | null,
  shownAs: string | null
): SizeOption[] {
  return MULTIPLIERS.map((multiplier) => ({
    multiplier,
    label: formatQuantityLabel(unitOfMeasure, shownAs, multiplier),
  }));
}

// Same label logic as getSizeOptions, but for an arbitrary quantity (e.g. cart display,
// once quantity may have drifted off the [1,2,4] presets via manual +/-).
export function formatQuantityLabel(
  unitOfMeasure: string | null,
  shownAs: string | null,
  quantity: number
): string {
  if (isWeightUnit(unitOfMeasure)) {
    const baseAmount = parseFloat(shownAs ?? "1") || 1;
    const amount = baseAmount * quantity;
    return formatWeight(amount, unitOfMeasure);
  }
  return `${quantity}× ${shownAs ?? "ea"}`;
}

// Cart +/- climbs this ladder regardless of which preset was originally picked:
// 1,2,4,8 (doubling up to the 8x/28g preset), then +8 per rung after that
// (16,24,32,... i.e. flat +28g increments once past the ounce).
export function nextMultiplier(current: number): number {
  return current < 8 ? current * 2 : current + 8;
}

// Returns 0 to signal "remove from cart".
export function prevMultiplier(current: number): number {
  if (current <= 1) return 0;
  return current <= 8 ? current / 2 : current - 8;
}

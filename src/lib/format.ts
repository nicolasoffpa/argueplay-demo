const LOCALE = "es-PY";
export const CURRENCY = "PYG₲";

/** Formats a number with comma as decimal separator (e.g. 1.234,50). */
export function formatDecimal(n: number, fractionDigits = 2): string {
  return n.toLocaleString(LOCALE, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/** Formats whole numbers with thousands separator (e.g. 1.234). */
export function formatInteger(n: number): string {
  return n.toLocaleString(LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function formatCurrency(n: number) {
  return `${CURRENCY} ${formatInteger(n)}`;
}

/** Formats a game multiplier (e.g. 2,50x). */
export function formatMultiplier(n: number, fractionDigits = 2): string {
  return `${formatDecimal(n, fractionDigits)}x`;
}

/** Parses user input that may use comma or dot as decimal separator. */
export function parseLocaleNumber(raw: string): number {
  const trimmed = raw.trim();
  if (!trimmed) return 0;
  if (trimmed.includes(",")) {
    const normalized = trimmed.replace(/\./g, "").replace(",", ".");
    const n = parseFloat(normalized);
    return Number.isFinite(n) ? n : 0;
  }
  const n = parseFloat(trimmed);
  return Number.isFinite(n) ? n : 0;
}

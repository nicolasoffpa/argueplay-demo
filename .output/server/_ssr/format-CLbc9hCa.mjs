//#region node_modules/.nitro/vite/services/ssr/assets/format-CLbc9hCa.js
var LOCALE = "es-PY";
var CURRENCY = "PYG₲";
/** Formats a number with comma as decimal separator (e.g. 1.234,50). */
function formatDecimal(n, fractionDigits = 2) {
	return n.toLocaleString(LOCALE, {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits
	});
}
/** Formats whole numbers with thousands separator (e.g. 1.234). */
function formatInteger(n) {
	return n.toLocaleString(LOCALE, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});
}
function formatCurrency(n) {
	return `${CURRENCY} ${formatInteger(n)}`;
}
/** Formats a game multiplier (e.g. 2,50x). */
function formatMultiplier(n, fractionDigits = 2) {
	return `${formatDecimal(n, fractionDigits)}x`;
}
/** Parses user input that may use comma or dot as decimal separator. */
function parseLocaleNumber(raw) {
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
//#endregion
export { parseLocaleNumber as i, formatDecimal as n, formatMultiplier as r, formatCurrency as t };

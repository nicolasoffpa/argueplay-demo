import { r as __toESM } from "../__23tanstack-start-server-fn-resolver-boIEPa30.mjs";
import { t as formatCurrency } from "./format-CLbc9hCa.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { d as useBalance } from "./admin-B7GAjUKz.mjs";
import { g as Minus, p as Plus, w as Coins } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GameUI-B1sjHyp9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BetControls({ bet, setBet, disabled, min = 1, max = 1e4 }) {
	const { balance } = useBalance();
	const [text, setText] = (0, import_react.useState)(String(bet));
	const commit = (n) => {
		const clamped = Math.max(min, Math.min(max, Math.min(balance || max, Math.round(n * 100) / 100)));
		setBet(clamped);
		setText(String(clamped));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-surface p-4 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold",
				children: "Bet Amount"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-stretch gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 flex items-center gap-2 bg-input rounded-md px-3 border border-border focus-within:border-primary transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-4 h-4 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								inputMode: "decimal",
								value: text,
								disabled,
								onChange: (e) => setText(e.target.value.replace(/[^0-9.]/g, "")),
								onBlur: () => {
									const n = parseFloat(text);
									commit(Number.isFinite(n) ? n : min);
								},
								className: "flex-1 bg-transparent py-2 font-mono font-bold text-sm tabular-nums outline-none disabled:opacity-60"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground",
								children: ["/ ", formatCurrency(balance)]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled,
						onClick: () => commit(bet / 2),
						className: "btn-ghost px-3 text-sm font-bold",
						children: "½"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled,
						onClick: () => commit(bet * 2),
						className: "btn-ghost px-3 text-sm font-bold",
						children: "2×"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-4 gap-2",
				children: [
					10,
					50,
					100,
					"MAX"
				].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled,
					onClick: () => commit(v === "MAX" ? balance : v),
					className: "btn-ghost py-1.5 text-xs font-semibold",
					children: v === "MAX" ? "MAX" : `+${v}`
				}, String(v)))
			})
		]
	});
}
function StatRow({ label, value, tone = "default" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between px-3 py-2 rounded-md bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `font-mono font-bold text-sm tabular-nums ${tone === "success" ? "text-primary" : tone === "danger" ? "text-destructive" : "text-foreground"}`,
			children: value
		})]
	});
}
function StepButton({ dir, onClick, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		disabled,
		className: "btn-ghost w-8 h-8 grid place-items-center",
		children: dir === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "w-4 h-4" })
	});
}
//#endregion
export { StatRow as n, StepButton as r, BetControls as t };

import { r as __toESM } from "../__23tanstack-start-server-fn-resolver-boIEPa30.mjs";
import { r as formatMultiplier, t as formatCurrency } from "./format-CLbc9hCa.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { d as useBalance, u as useAdmin } from "./admin-B7GAjUKz.mjs";
import { C as Gem, S as HandCoins, k as Bomb, m as Play, u as RotateCw } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5KKjI__.mjs";
import { n as StatRow, t as BetControls } from "./GameUI-B1sjHyp9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/towers-dJXiDRaK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LEVELS = 8;
var CFG = {
	easy: {
		cols: 3,
		bombs: 1
	},
	medium: {
		cols: 3,
		bombs: 2
	},
	hard: {
		cols: 2,
		bombs: 1
	}
};
function mult(diff, level) {
	const { cols, bombs } = CFG[diff];
	const p = (cols - bombs) / cols;
	return +(.97 * Math.pow(1 / p, level)).toFixed(2);
}
function buildTower(diff) {
	const { cols, bombs } = CFG[diff];
	return Array.from({ length: LEVELS }, () => {
		const idxs = Array.from({ length: cols }, (_, i) => i);
		for (let i = idxs.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[idxs[i], idxs[j]] = [idxs[j], idxs[i]];
		}
		return {
			bombs: idxs.slice(0, bombs),
			picked: null,
			revealed: false,
			lost: false
		};
	});
}
function TowersPage() {
	const { balance, add } = useBalance();
	const { alwaysWin } = useAdmin();
	const [bet, setBet] = (0, import_react.useState)(10);
	const [diff, setDiff] = (0, import_react.useState)("medium");
	const [rows, setRows] = (0, import_react.useState)(() => buildTower("medium"));
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [currentLevel, setCurrentLevel] = (0, import_react.useState)(0);
	const [ended, setEnded] = (0, import_react.useState)(null);
	const [lastWin, setLastWin] = (0, import_react.useState)(null);
	const cols = CFG[diff].cols;
	const curMult = currentLevel > 0 ? mult(diff, currentLevel) : 1;
	const nextMult = mult(diff, currentLevel + 1);
	const cashout = +(bet * curMult).toFixed(2);
	function start() {
		if (playing || bet <= 0 || bet > balance) return;
		add(-bet);
		setRows(buildTower(diff));
		setCurrentLevel(0);
		setPlaying(true);
		setEnded(null);
		setLastWin(null);
	}
	function pick(rowIdx, colIdx) {
		if (!playing) return;
		if (rowIdx !== LEVELS - 1 - currentLevel) return;
		const next = rows.slice();
		const row = { ...next[rowIdx] };
		row.picked = colIdx;
		row.revealed = true;
		let isBomb = row.bombs.includes(colIdx);
		if (isBomb && alwaysWin) {
			const safeSpots = [];
			for (let c = 0; c < cols; c++) if (c !== colIdx && !row.bombs.includes(c)) safeSpots.push(c);
			if (safeSpots.length > 0) {
				const swap = safeSpots[Math.floor(Math.random() * safeSpots.length)];
				row.bombs = row.bombs.filter((b) => b !== colIdx).concat(swap);
				isBomb = false;
			}
		}
		row.lost = isBomb;
		next[rowIdx] = row;
		if (isBomb) {
			for (let i = 0; i < next.length; i++) if (!next[i].revealed) next[i] = {
				...next[i],
				revealed: true
			};
			setRows(next);
			setPlaying(false);
			setEnded("lost");
			setLastWin(-bet);
		} else {
			const newLevel = currentLevel + 1;
			setRows(next);
			setCurrentLevel(newLevel);
			if (newLevel === LEVELS) {
				const win = +(bet * mult(diff, LEVELS)).toFixed(2);
				add(win);
				setPlaying(false);
				setEnded("won");
				setLastWin(win - bet);
			}
		}
	}
	function cashOut() {
		if (!playing || currentLevel === 0) return;
		add(cashout);
		const next = rows.slice();
		for (let i = 0; i < next.length; i++) if (!next[i].revealed) next[i] = {
			...next[i],
			revealed: true
		};
		setRows(next);
		setPlaying(false);
		setEnded("cashed");
		setLastWin(cashout - bet);
	}
	function resetTower() {
		setRows(buildTower(diff));
		setCurrentLevel(0);
		setEnded(null);
		setLastWin(null);
	}
	const multipliers = (0, import_react.useMemo)(() => Array.from({ length: LEVELS }, (_, i) => mult(diff, i + 1)), [diff]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid lg:grid-cols-[320px_1fr] gap-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BetControls, {
					bet,
					setBet,
					disabled: playing
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-4 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold",
							children: "Difficulty"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-1.5",
							children: Object.keys(CFG).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: playing,
								onClick: () => {
									setDiff(d);
									setRows(buildTower(d));
									setEnded(null);
								},
								className: `py-2 text-xs font-bold rounded-md border transition-colors capitalize ${diff === d ? "bg-primary/20 border-primary text-primary" : "bg-surface border-border text-muted-foreground hover:text-foreground"}`,
								children: d
							}, d))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-muted-foreground pt-1",
							children: [
								CFG[diff].cols,
								" tiles per row · ",
								CFG[diff].bombs,
								" bomb",
								CFG[diff].bombs > 1 ? "s" : ""
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-surface p-4 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
							label: "Current",
							value: `× ${formatMultiplier(curMult)}`,
							tone: "success"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
							label: "Next level",
							value: `× ${formatMultiplier(nextMult)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
							label: "Cash out",
							value: formatCurrency(cashout),
							tone: "success"
						}),
						lastWin !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
							label: "Last round",
							value: `${lastWin >= 0 ? "+" : ""}${formatCurrency(lastWin)}`,
							tone: lastWin >= 0 ? "success" : "danger"
						})
					]
				}),
				!playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: start,
					disabled: bet <= 0 || bet > balance,
					className: "btn-primary w-full py-3 flex items-center justify-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-4 h-4" }),
						" Bet ",
						formatCurrency(bet)
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: cashOut,
					disabled: currentLevel === 0,
					className: "btn-primary w-full py-3 flex items-center justify-center gap-2 animate-pulse-glow",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandCoins, { className: "w-4 h-4" }),
						" Cash out ",
						formatCurrency(cashout)
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-surface p-4 md:p-6 relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-black",
							children: "Towers"
						}), ended && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: resetTower,
							className: "btn-ghost px-3 py-1.5 text-xs flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "w-3.5 h-3.5" }), " New round"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5 max-w-md mx-auto",
						children: rows.map((row, rIdx) => {
							const level = LEVELS - rIdx;
							const activeRowIdx = playing ? LEVELS - 1 - currentLevel : -1;
							const isActive = rIdx === activeRowIdx;
							const isPast = playing && rIdx > activeRowIdx;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `w-14 text-right font-mono text-xs tabular-nums ${isActive ? "text-primary font-bold" : "text-muted-foreground"}`,
									children: ["× ", formatMultiplier(multipliers[level - 1])]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-1.5 flex-1",
									style: { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` },
									children: Array.from({ length: cols }).map((_, cIdx) => {
										const isPicked = row.picked === cIdx;
										const isBomb = row.bombs.includes(cIdx);
										const revealed = row.revealed;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => pick(rIdx, cIdx),
											disabled: !isActive,
											className: `h-11 md:h-12 rounded-md border transition-all grid place-items-center
                              ${revealed ? isPicked ? isBomb ? "bg-destructive/20 border-destructive glow-destructive animate-shake" : "bg-primary/15 border-primary glow-primary" : isBomb ? "bg-destructive/10 border-destructive/40 opacity-60" : "bg-surface border-border/60 opacity-40" : isActive ? "bg-surface-hi border-primary/40 hover:bg-surface hover:border-primary hover:-translate-y-0.5" : isPast ? "bg-surface border-border opacity-40" : "bg-surface-hi border-border opacity-70"}
                            `,
											children: revealed ? isBomb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bomb, { className: `w-4 h-4 ${isPicked ? "text-destructive animate-pop" : "text-destructive/50"}` }) : isPicked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, { className: "w-4 h-4 text-primary animate-pop" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1.5 h-1.5 rounded-full bg-border" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-1.5 h-1.5 rounded-full bg-border/60" })
										}, cIdx);
									})
								})]
							}, rIdx);
						})
					}),
					ended && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `mt-5 text-center font-display font-black text-lg ${ended === "lost" ? "text-destructive" : "text-primary"}`,
						children: [
							ended === "lost" && "Busted.",
							ended === "cashed" && `Cashed out +${formatCurrency(lastWin ?? 0)}`,
							ended === "won" && `Top of the tower! +${formatCurrency(lastWin ?? 0)}`
						]
					})
				]
			})
		})]
	}) });
}
//#endregion
export { TowersPage as component };

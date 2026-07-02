import { r as __toESM } from "../__23tanstack-start-server-fn-resolver-boIEPa30.mjs";
import { r as formatMultiplier, t as formatCurrency } from "./format-CLbc9hCa.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { d as useBalance, u as useAdmin } from "./admin-B7GAjUKz.mjs";
import { C as Gem, S as HandCoins, k as Bomb, m as Play, u as RotateCw } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5KKjI__.mjs";
import { n as StatRow, r as StepButton, t as BetControls } from "./GameUI-B1sjHyp9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mines-CyMGZcOP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SIZE = 5;
var TOTAL = SIZE * SIZE;
function comb(n, k) {
	if (k < 0 || k > n) return 0;
	if (k === 0 || k === n) return 1;
	k = Math.min(k, n - k);
	let r = 1;
	for (let i = 1; i <= k; i++) r = r * (n - k + i) / i;
	return r;
}
function multiplier(mines, picks) {
	if (picks <= 0) return 1;
	return .96 * (comb(TOTAL, picks) / comb(TOTAL - mines, picks));
}
function newBoard() {
	return Array.from({ length: TOTAL }, () => ({
		revealed: false,
		isMine: false
	}));
}
function pickMines(mines) {
	const set = /* @__PURE__ */ new Set();
	while (set.size < mines) set.add(Math.floor(Math.random() * TOTAL));
	return set;
}
function MinesPage() {
	const { balance, add } = useBalance();
	const { alwaysWin } = useAdmin();
	const [bet, setBet] = (0, import_react.useState)(10);
	const [mines, setMines] = (0, import_react.useState)(3);
	const [board, setBoard] = (0, import_react.useState)(newBoard);
	const [minePositions, setMinePositions] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [ended, setEnded] = (0, import_react.useState)(null);
	const [lastWin, setLastWin] = (0, import_react.useState)(null);
	const picks = board.filter((c) => c.revealed && !c.isMine).length;
	const curMult = (0, import_react.useMemo)(() => multiplier(mines, picks), [mines, picks]);
	const nextMult = (0, import_react.useMemo)(() => multiplier(mines, picks + 1), [mines, picks]);
	const cashout = +(bet * curMult).toFixed(2);
	function start() {
		if (playing || bet <= 0 || bet > balance) return;
		add(-bet);
		setMinePositions(pickMines(mines));
		setBoard(newBoard());
		setPlaying(true);
		setEnded(null);
		setLastWin(null);
	}
	function reveal(i) {
		if (!playing || board[i].revealed) return;
		let mp = minePositions;
		let isMine = mp.has(i);
		if (isMine && alwaysWin) {
			const candidates = [];
			for (let k = 0; k < TOTAL; k++) if (k !== i && !board[k].revealed && !mp.has(k)) candidates.push(k);
			if (candidates.length > 0) {
				const swap = candidates[Math.floor(Math.random() * candidates.length)];
				mp = new Set(mp);
				mp.delete(i);
				mp.add(swap);
				setMinePositions(mp);
				isMine = false;
			}
		}
		const next = board.slice();
		next[i] = {
			revealed: true,
			isMine,
			lost: isMine
		};
		if (isMine) {
			mp.forEach((mi) => {
				if (!next[mi].revealed) next[mi] = {
					revealed: true,
					isMine: true
				};
			});
			setBoard(next);
			setPlaying(false);
			setEnded("lost");
			setLastWin(-bet);
		} else {
			setBoard(next);
			const newPicks = next.filter((c) => c.revealed && !c.isMine).length;
			if (newPicks === TOTAL - mines) {
				const win = +(bet * multiplier(mines, newPicks)).toFixed(2);
				add(win);
				setPlaying(false);
				setEnded("won");
				setLastWin(win - bet);
			}
		}
	}
	function cashOut() {
		if (!playing || picks === 0) return;
		add(cashout);
		const next = board.slice();
		minePositions.forEach((mi) => {
			if (!next[mi].revealed) next[mi] = {
				revealed: true,
				isMine: true
			};
		});
		setBoard(next);
		setPlaying(false);
		setEnded("cashed");
		setLastWin(cashout - bet);
	}
	function resetBoard() {
		setBoard(newBoard());
		setMinePositions(/* @__PURE__ */ new Set());
		setEnded(null);
		setLastWin(null);
	}
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
					className: "card-surface p-4 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold",
								children: "Mines"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono font-bold text-sm",
								children: mines
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepButton, {
									dir: "down",
									onClick: () => setMines((m) => Math.max(1, m - 1)),
									disabled: playing
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 1,
									max: 24,
									value: mines,
									disabled: playing,
									onChange: (e) => setMines(parseInt(e.target.value)),
									className: "flex-1 accent-primary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepButton, {
									dir: "up",
									onClick: () => setMines((m) => Math.min(24, m + 1)),
									disabled: playing
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-4 gap-1.5",
							children: [
								1,
								3,
								5,
								10
							].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								disabled: playing,
								onClick: () => setMines(n),
								className: `py-1.5 text-xs font-bold rounded-md border transition-colors ${mines === n ? "bg-primary/20 border-primary text-primary" : "bg-surface border-border text-muted-foreground hover:text-foreground"}`,
								children: n
							}, n))
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
							label: "Next tile",
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
					disabled: picks === 0,
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
							children: "Mines"
						}), ended && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: resetBoard,
							className: "btn-ghost px-3 py-1.5 text-xs flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "w-3.5 h-3.5" }), " New round"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-5 gap-2 md:gap-3 aspect-square max-w-[560px] mx-auto",
						children: board.map((c, i) => {
							const isLost = c.lost;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => reveal(i),
								disabled: !playing || c.revealed,
								className: `relative rounded-lg border transition-all duration-200 grid place-items-center overflow-hidden
                      ${c.revealed ? c.isMine ? `bg-destructive/15 border-destructive/60 ${isLost ? "glow-destructive animate-shake" : ""}` : "bg-primary/10 border-primary/50 glow-primary" : "bg-surface-hi border-border hover:bg-surface hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0"}
                      ${!playing && !c.revealed ? "opacity-70" : ""}
                    `,
								children: c.revealed ? c.isMine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bomb, { className: "w-6 h-6 md:w-8 md:h-8 text-destructive animate-pop" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gem, { className: "w-6 h-6 md:w-8 md:h-8 text-primary animate-pop" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-4 h-4 rounded-sm bg-border/60" })
							}, i);
						})
					}),
					ended && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `mt-5 text-center font-display font-black text-lg ${ended === "lost" ? "text-destructive" : "text-primary"}`,
						children: [
							ended === "lost" && "Busted.",
							ended === "cashed" && `Cashed out +${formatCurrency(lastWin ?? 0)}`,
							ended === "won" && `Perfect clear! +${formatCurrency(lastWin ?? 0)}`
						]
					})
				]
			})
		})]
	}) });
}
//#endregion
export { MinesPage as component };

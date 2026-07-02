import { r as __toESM } from "../__23tanstack-start-server-fn-resolver-boIEPa30.mjs";
import { n as formatDecimal, r as formatMultiplier, t as formatCurrency } from "./format-CLbc9hCa.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { d as useBalance, f as usePlayer } from "./admin-B7GAjUKz.mjs";
import { E as CircleX, S as HandCoins, T as Clock, a as TrendingUp, f as Radio, i as Trophy, n as Users } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5KKjI__.mjs";
import { n as joinCrashRound, t as getCrashSnapshot } from "./crashRealtime-O623N9wW.mjs";
import { n as StatRow, t as BetControls } from "./GameUI-B1sjHyp9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crash-C-wiQz9r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SETTLED_KEY = "ap_crash_settled_bets_v1";
function readSettledIds() {
	if (typeof window === "undefined") return /* @__PURE__ */ new Set();
	try {
		const raw = sessionStorage.getItem(SETTLED_KEY);
		const ids = raw ? JSON.parse(raw) : [];
		return new Set(ids);
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function markSettled(id) {
	if (typeof window === "undefined") return;
	const next = [id, ...readSettledIds()].slice(0, 100);
	try {
		sessionStorage.setItem(SETTLED_KEY, JSON.stringify(next));
	} catch {}
}
function phaseLabel(phase) {
	if (phase === "betting") return "Apuestas abiertas";
	if (phase === "running") return "Ronda en curso";
	if (phase === "crashed") return "Crash";
	if (phase === "paused") return "Mesa pausada";
	return "Sincronizando";
}
function formatCountdown(ms) {
	return `${Math.max(0, Math.ceil(ms / 1e3))}s`;
}
function moneyClass(value) {
	if (value > 0) return "text-primary";
	if (value < 0) return "text-destructive";
	return "text-muted-foreground";
}
function computeLiveMultiplier(snapshot, estimatedServerNow) {
	if (!snapshot) return 1;
	if (snapshot.phase !== "running" || !snapshot.roundStartedAt) return snapshot.multiplier;
	const elapsed = Math.max(0, (estimatedServerNow - snapshot.roundStartedAt) / 1e3);
	return Math.max(1, Math.floor(Math.exp(snapshot.config.growthRate * elapsed) * 100) / 100);
}
function CrashPage() {
	const { balance, add } = useBalance();
	const { player } = usePlayer();
	const [bet, setBet] = (0, import_react.useState)(10);
	const [target, setTarget] = (0, import_react.useState)(2);
	const [snapshot, setSnapshot] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [lastResult, setLastResult] = (0, import_react.useState)(null);
	const [clientNow, setClientNow] = (0, import_react.useState)(Date.now());
	const receivedAt = (0, import_react.useRef)(Date.now());
	const polling = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		let alive = true;
		const refresh = async () => {
			if (polling.current) return;
			polling.current = true;
			try {
				const next = await getCrashSnapshot();
				if (!alive) return;
				receivedAt.current = Date.now();
				setSnapshot(next);
				setError(null);
			} catch (err) {
				if (!alive) return;
				setError(err instanceof Error ? err.message : "No se pudo sincronizar Crash.");
			} finally {
				polling.current = false;
			}
		};
		refresh();
		const interval = window.setInterval(refresh, 300);
		return () => {
			alive = false;
			window.clearInterval(interval);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let frame = 0;
		const tick = () => {
			setClientNow(Date.now());
			frame = window.requestAnimationFrame(tick);
		};
		frame = window.requestAnimationFrame(tick);
		return () => window.cancelAnimationFrame(frame);
	}, []);
	const estimatedServerNow = snapshot ? snapshot.serverNow + (clientNow - receivedAt.current) : clientNow;
	const displayMultiplier = computeLiveMultiplier(snapshot, estimatedServerNow);
	const currentPlayer = (0, import_react.useMemo)(() => {
		if (!snapshot || !player) return null;
		return snapshot.players.find((p) => p.username.toLowerCase() === player.username.toLowerCase()) ?? null;
	}, [snapshot, player?.username]);
	const activeOrWaiting = currentPlayer?.status === "waiting" || currentPlayer?.status === "active";
	const canJoin = !!player && snapshot?.phase === "betting" && !currentPlayer && bet > 0 && bet <= balance && target >= 1.01 && !pending;
	const countdownMs = (() => {
		if (!snapshot) return 0;
		if (snapshot.phase === "betting" && snapshot.bettingEndsAt) return snapshot.bettingEndsAt - estimatedServerNow;
		if (snapshot.phase === "crashed" && snapshot.nextRoundAt) return snapshot.nextRoundAt - estimatedServerNow;
		return 0;
	})();
	(0, import_react.useEffect)(() => {
		if (!snapshot || !player) return;
		const mine = snapshot.players.find((p) => p.username.toLowerCase() === player.username.toLowerCase());
		if (!mine || mine.status !== "won" && mine.status !== "lost") return;
		if (readSettledIds().has(mine.id)) return;
		if (mine.status === "won" && mine.payout > 0) {
			add(mine.payout);
			setLastResult(`Ganaste +${formatCurrency(mine.profit)} en ${formatMultiplier(mine.cashedAt ?? 0)}`);
		} else setLastResult(`Perdiste ${formatCurrency(mine.bet)} en ${formatMultiplier(mine.target)}`);
		markSettled(mine.id);
	}, [
		snapshot,
		player?.username,
		add
	]);
	const handleJoin = async () => {
		if (!player || !snapshot) return;
		if (!canJoin) {
			setError(bet > balance ? "Saldo insuficiente para esta apuesta." : "Espera la siguiente ronda.");
			return;
		}
		setPending(true);
		setError(null);
		try {
			const next = await joinCrashRound({ data: {
				username: player.username,
				displayName: player.displayName || player.username,
				avatarUrl: null,
				bet,
				target
			} });
			add(-bet);
			receivedAt.current = Date.now();
			setSnapshot(next);
			setLastResult(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo entrar a la ronda.");
		} finally {
			setPending(false);
		}
	};
	const buttonLabel = (() => {
		if (pending) return "Entrando...";
		if (!player) return "Inicia sesion";
		if (currentPlayer?.status === "waiting") return "Esperando inicio";
		if (currentPlayer?.status === "active") return `Activo a ${formatMultiplier(currentPlayer.target)}`;
		if (currentPlayer?.status === "won") return "Resultado ganado";
		if (currentPlayer?.status === "lost") return "Resultado perdido";
		if (snapshot?.phase === "betting") return `Entrar con ${formatCurrency(bet)}`;
		return "Ronda en curso";
	})();
	const multiplierColor = snapshot?.phase === "crashed" ? "text-destructive" : currentPlayer?.status === "won" ? "text-primary" : "text-foreground";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid lg:grid-cols-[320px_1fr] gap-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BetControls, {
						bet,
						setBet,
						disabled: Boolean(activeOrWaiting) || snapshot?.phase !== "betting"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface p-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold",
								children: "Retiro objetivo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 bg-input rounded-md px-3 border border-border focus-within:border-primary transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										step: "0.01",
										min: "1.01",
										value: target,
										disabled: Boolean(activeOrWaiting) || snapshot?.phase !== "betting",
										onChange: (e) => setTarget(Math.max(1.01, Number(e.target.value) || 1.01)),
										className: "flex-1 bg-transparent py-2 font-mono font-bold text-sm tabular-nums outline-none disabled:opacity-60"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "x"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-4 gap-2",
								children: [
									1.5,
									2,
									3,
									5
								].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: Boolean(activeOrWaiting) || snapshot?.phase !== "betting",
									onClick: () => setTarget(value),
									className: "btn-ghost py-1.5 text-xs font-semibold",
									children: formatMultiplier(value, value % 1 === 0 ? 0 : 1)
								}, value))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-surface p-4 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
								label: "Estado",
								value: phaseLabel(snapshot?.phase)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
								label: snapshot?.phase === "crashed" ? "Nueva ronda" : "Tiempo",
								value: snapshot?.phase === "running" ? "En vivo" : formatCountdown(countdownMs)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
								label: "Jugadores",
								value: String(snapshot?.players.length ?? 0)
							}),
							currentPlayer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatRow, {
								label: "Tu resultado",
								value: playerResult(currentPlayer),
								tone: currentPlayer.status === "won" ? "success" : currentPlayer.status === "lost" ? "danger" : "default"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleJoin,
						disabled: !canJoin,
						className: "btn-primary w-full py-3 flex items-center justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandCoins, { className: "w-4 h-4" }), buttonLabel]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs font-semibold text-destructive",
						children: error
					}),
					lastResult && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-md border border-primary/30 bg-primary/10 p-3 text-xs font-semibold text-primary",
						children: lastResult
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "card-surface p-6 relative overflow-hidden min-h-[400px] flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] uppercase tracking-widest font-bold text-primary mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-3.5 h-3.5" }), " En vivo"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl md:text-3xl font-bold",
								children: snapshot?.config.tableName ?? "Crash en vivo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: snapshot?.config.liveMessage ?? "Sincronizando mesa..."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1.5 flex-wrap md:justify-end md:max-w-[46%]",
						children: snapshot?.history.map((value, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-[11px] font-mono font-bold px-2 py-1 rounded-md border ${value >= 2 ? "bg-primary/10 text-primary border-primary/25" : "bg-destructive/10 text-destructive border-destructive/25"}`,
							children: formatMultiplier(value)
						}, `${value}-${index}`))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 grid place-items-center relative min-h-[280px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrashCurve, {
						multiplier: displayMultiplier,
						phase: snapshot?.phase ?? "betting"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `font-display font-bold tabular-nums leading-none transition-colors ${multiplierColor}`,
							style: { fontSize: "clamp(3.6rem, 11vw, 7rem)" },
							children: [formatDecimal(displayMultiplier), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-4xl md:text-5xl",
								children: "x"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								snapshot?.phase === "betting" && `Empieza en ${formatCountdown(countdownMs)}`,
								snapshot?.phase === "running" && "Multiplicador activo",
								snapshot?.phase === "crashed" && snapshot.crashAt && `Rompió en ${formatMultiplier(snapshot.crashAt)}`,
								snapshot?.phase === "paused" && "Mesa pausada",
								!snapshot && "Conectando"
							] })]
						})]
					})]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid lg:grid-cols-[1fr_360px] gap-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LivePlayers, {
				players: snapshot?.players ?? [],
				currentUsername: player?.username ?? null
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveEvents, { events: snapshot?.events ?? [] })]
		})]
	}) });
}
function playerResult(player) {
	if (player.status === "won") return `+${formatCurrency(player.profit)}`;
	if (player.status === "lost") return `-${formatCurrency(player.bet)}`;
	if (player.status === "active") return `${formatMultiplier(player.target)} activo`;
	return `${formatMultiplier(player.target)} espera`;
}
function statusLabel(status) {
	if (status === "waiting") return "Esperando";
	if (status === "active") return "Activo";
	if (status === "won") return "Gano";
	return "Perdio";
}
function statusClasses(status) {
	if (status === "won") return "bg-primary/10 text-primary border-primary/25";
	if (status === "lost") return "bg-destructive/10 text-destructive border-destructive/25";
	if (status === "active") return "bg-accent/10 text-accent border-accent/25";
	return "bg-surface-hi text-muted-foreground border-border";
}
function LivePlayers({ players, currentUsername }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "card-surface p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display font-bold",
					children: "Jugadores en vivo"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-xs text-muted-foreground",
				children: players.length
			})]
		}), players.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-md border border-border bg-surface p-6 text-center text-sm text-muted-foreground",
			children: "Nadie entro todavia."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: players.map((p) => {
				const mine = currentUsername?.toLowerCase() === p.username.toLowerCase();
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border bg-surface p-3 flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-full bg-surface-hi border border-border grid place-items-center text-[11px] font-bold",
							children: p.username.slice(0, 2).toUpperCase()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-semibold truncate",
									children: ["@", p.username]
								}), mine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-widest text-primary font-bold",
									children: "Tu"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground font-mono",
								children: [
									formatCurrency(p.bet),
									" / ",
									formatMultiplier(p.target)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `inline-flex px-2 py-1 rounded-md border text-[11px] font-bold ${statusClasses(p.status)}`,
								children: statusLabel(p.status)
							}), (p.status === "won" || p.status === "lost") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: `font-mono text-xs mt-1 ${moneyClass(p.profit)}`,
								children: [p.profit > 0 ? "+" : "", formatCurrency(p.profit)]
							})]
						})
					]
				}, p.id);
			})
		})]
	});
}
function LiveEvents({ events }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "card-surface p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display font-bold",
				children: "Actividad"
			})]
		}), events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-md border border-border bg-surface p-6 text-center text-sm text-muted-foreground",
			children: "Sin actividad reciente."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2 max-h-[420px] overflow-y-auto pr-1",
			children: events.slice(0, 14).map((event) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border bg-surface p-3 flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(event.type === "win" ? Trophy : event.type === "loss" ? CircleX : Radio, { className: `w-4 h-4 mt-0.5 shrink-0 ${event.type === "win" ? "text-primary" : event.type === "loss" ? "text-destructive" : "text-muted-foreground"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium leading-snug",
							children: event.message
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground font-mono mt-1",
							children: new Date(event.at).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit"
							})
						})]
					})]
				}, event.id);
			})
		})]
	});
}
function CrashCurve({ multiplier, phase }) {
	const width = 800;
	const height = 320;
	const progress = Math.min(1, Math.log(Math.max(1.01, multiplier)) / Math.log(8));
	const points = [];
	const steps = 48;
	for (let i = 0; i <= steps; i += 1) {
		const fraction = i / steps * progress;
		const x = fraction * width;
		const curveMultiplier = Math.pow(8, fraction);
		const denominator = Math.max(.01, multiplier - 1);
		const y = height - (curveMultiplier - 1) / denominator * height * progress;
		points.push(`${x.toFixed(1)},${Math.max(0, Math.min(height, y)).toFixed(1)}`);
	}
	const path = `M0,${height} L${points.join(" L")}`;
	const color = phase === "crashed" ? "var(--color-destructive)" : "var(--color-primary)";
	const endX = progress * width;
	const endY = height - height * progress * .98;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${width} ${height}`,
		className: "absolute inset-0 w-full h-full opacity-90",
		preserveAspectRatio: "none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: "crashFill",
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: color,
					stopOpacity: "0.28"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: color,
					stopOpacity: "0"
				})]
			}) }),
			[
				.25,
				.5,
				.75
			].map((fraction) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "0",
				x2: width,
				y1: height * fraction,
				y2: height * fraction,
				stroke: "currentColor",
				strokeOpacity: "0.07"
			}, fraction)),
			[
				.25,
				.5,
				.75
			].map((fraction) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				y1: "0",
				y2: height,
				x1: width * fraction,
				x2: width * fraction,
				stroke: "currentColor",
				strokeOpacity: "0.05"
			}, `v-${fraction}`)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: `${path} L${endX.toFixed(1)},${height} L0,${height} Z`,
				fill: "url(#crashFill)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: path,
				fill: "none",
				stroke: color,
				strokeWidth: "3",
				strokeLinecap: "round",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: endX,
				cy: Math.max(8, Math.min(height - 8, endY)),
				r: "6",
				fill: color
			})
		]
	});
}
//#endregion
export { CrashPage as component };

import { r as __toESM } from "../__23tanstack-start-server-fn-resolver-boIEPa30.mjs";
import { t as ADMIN_PASSWORD } from "./adminConstants-BcjzJZQo.mjs";
import { i as parseLocaleNumber, r as formatMultiplier, t as formatCurrency } from "./format-CLbc9hCa.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { c as setUserVerified, f as usePlayer, i as adjustPlayerBalance, l as subscribeRegistry, o as listPlayers, s as setPlayerBalance, u as useAdmin } from "./admin-B7GAjUKz.mjs";
import { D as CirclePlay, E as CircleX, O as CircleCheckBig, c as Search, f as Radio, g as Minus, h as Pause, l as Save, n as Users, o as Sparkles, p as Plus, s as ShieldCheck, t as Zap, y as Lock } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5KKjI__.mjs";
import { r as updateCrashAdmin, t as getCrashSnapshot } from "./crashRealtime-O623N9wW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DvgaCpbN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const { isAdmin, authorized, passwordError, verifyPassword, alwaysWin, setAlwaysWin } = useAdmin();
	const { player } = usePlayer();
	const [pw, setPw] = (0, import_react.useState)("");
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-sm mx-auto card-surface p-6 mt-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-9 h-9 rounded-lg bg-surface-hi grid place-items-center border border-border mx-auto mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-primary" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-xl font-black mb-2",
				children: "Solo para admin"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "El panel de admin está reservado a la cuenta dueña de este sitio. Si eres tú, entra con ese usuario desde la pantalla de inicio de sesión."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "btn-primary inline-flex mt-4 px-4 py-2 text-sm",
				children: "Volver al inicio"
			})
		]
	}) });
	if (!authorized) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-sm mx-auto card-surface p-6 mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-9 h-9 rounded-lg bg-surface-hi grid place-items-center border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-primary" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-xl font-black",
					children: "Admin"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: ["@", player?.username]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mb-4",
				children: "Ingresa la contraseña de admin para desbloquear el panel."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					verifyPassword(pw);
					setPw("");
				},
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "password",
						autoFocus: true,
						value: pw,
						onChange: (e) => setPw(e.target.value),
						placeholder: "Contraseña",
						className: "w-full bg-input rounded-md px-3 py-2.5 border border-border focus:border-primary outline-none font-mono text-sm"
					}),
					passwordError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-destructive",
						children: "Contraseña incorrecta."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "btn-primary w-full py-2.5",
						children: "Desbloquear"
					})
				]
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl mx-auto space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-surface p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-lg bg-primary/15 grid place-items-center border border-primary/40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-primary" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-xl font-black",
							children: "Panel de admin"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Sesión de @", player?.username]
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-border bg-surface p-4 flex items-start justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-bold",
									children: "Ganar siempre (God mode)"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Mines nunca coloca una bomba donde haces clic. Towers siempre elige la casilla segura. Crash ahora se controla desde la mesa en vivo de abajo."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setAlwaysWin(!alwaysWin),
							className: `shrink-0 w-12 h-6 rounded-full transition-colors relative ${alwaysWin ? "bg-primary" : "bg-surface-hi border border-border"}`,
							"aria-pressed": alwaysWin,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-0.5 w-5 h-5 rounded-full bg-background transition-all ${alwaysWin ? "left-6" : "left-0.5"}` })
						})]
					}),
					alwaysWin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-primary",
								children: "God mode activado."
							}),
							" ",
							"Verás una insignia junto a tu saldo mientras juegas."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrashLiveManager, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerBalanceManager, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/mines",
					className: "btn-primary px-4 py-2 text-sm flex-1 text-center",
					children: "A jugar →"
				})
			})
		]
	}) });
}
function CrashLiveManager() {
	const { player } = usePlayer();
	const [snapshot, setSnapshot] = (0, import_react.useState)(null);
	const [draft, setDraft] = (0, import_react.useState)({
		tableName: "Crash en vivo",
		liveMessage: "",
		bettingSeconds: "8",
		breakSeconds: "4",
		growthRate: "0.09",
		nextCrashAt: ""
	});
	const [dirty, setDirty] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let alive = true;
		const refresh = async () => {
			try {
				const next = await getCrashSnapshot();
				if (alive) setSnapshot(next);
			} catch (err) {
				if (alive) setError(err instanceof Error ? err.message : "No se pudo leer Crash.");
			}
		};
		refresh();
		const interval = window.setInterval(refresh, 900);
		return () => {
			alive = false;
			window.clearInterval(interval);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!snapshot || dirty) return;
		setDraft({
			tableName: snapshot.config.tableName,
			liveMessage: snapshot.config.liveMessage,
			bettingSeconds: String(snapshot.config.bettingSeconds),
			breakSeconds: String(snapshot.config.breakSeconds),
			growthRate: String(snapshot.config.growthRate),
			nextCrashAt: snapshot.config.nextCrashAt ? String(snapshot.config.nextCrashAt) : ""
		});
	}, [snapshot, dirty]);
	const setField = (field, value) => {
		setDraft((current) => ({
			...current,
			[field]: value
		}));
		setDirty(true);
	};
	const applyPatch = async (patch) => {
		if (!player) return;
		setSaving(true);
		setError(null);
		try {
			const next = await updateCrashAdmin({ data: {
				admin: {
					username: player.username,
					password: ADMIN_PASSWORD
				},
				patch
			} });
			setSnapshot(next);
			setDirty(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "No se pudo actualizar Crash.");
		} finally {
			setSaving(false);
		}
	};
	const saveSettings = () => {
		const patch = {
			tableName: draft.tableName,
			liveMessage: draft.liveMessage,
			bettingSeconds: Number(draft.bettingSeconds),
			breakSeconds: Number(draft.breakSeconds),
			growthRate: Number(draft.growthRate)
		};
		const nextCrash = Number(draft.nextCrashAt);
		if (draft.nextCrashAt.trim() && Number.isFinite(nextCrash)) patch.nextCrashAt = nextCrash;
		applyPatch(patch);
	};
	const setNextCrash = () => {
		const value = Number(draft.nextCrashAt);
		if (!Number.isFinite(value) || value < 1) {
			setError("El proximo crash debe ser 1.00x o mayor.");
			return;
		}
		applyPatch({ nextCrashAt: value });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-surface p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display font-black",
							children: "Crash en tiempo real"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Estado: ",
							snapshot ? snapshot.phase : "sincronizando",
							" - Ronda #",
							snapshot?.roundId ?? "-"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: saving,
						onClick: () => applyPatch(snapshot?.phase === "paused" ? { startNext: true } : { pause: true }),
						className: "btn-ghost px-3 py-2 text-xs font-semibold inline-flex items-center gap-2",
						children: [snapshot?.phase === "paused" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "w-3.5 h-3.5" }), snapshot?.phase === "paused" ? "Reanudar" : "Pausar"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: saving || snapshot?.phase !== "running",
						onClick: () => applyPatch({ crashNow: true }),
						className: "btn-ghost px-3 py-2 text-xs font-semibold inline-flex items-center gap-2 text-destructive",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-3.5 h-3.5" }), "Romper ahora"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold",
							children: "Nombre de mesa"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft.tableName,
							onChange: (e) => setField("tableName", e.target.value),
							className: "w-full bg-input rounded-md px-3 py-2 border border-border focus:border-primary outline-none text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold",
							children: "Mensaje en vivo"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft.liveMessage,
							onChange: (e) => setField("liveMessage", e.target.value),
							className: "w-full bg-input rounded-md px-3 py-2 border border-border focus:border-primary outline-none text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold",
							children: "Apuestas abiertas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: "3",
							max: "30",
							value: draft.bettingSeconds,
							onChange: (e) => setField("bettingSeconds", e.target.value),
							className: "w-full bg-input rounded-md px-3 py-2 border border-border focus:border-primary outline-none font-mono text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold",
							children: "Pausa entre rondas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: "2",
							max: "15",
							value: draft.breakSeconds,
							onChange: (e) => setField("breakSeconds", e.target.value),
							className: "w-full bg-input rounded-md px-3 py-2 border border-border focus:border-primary outline-none font-mono text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold",
							children: "Velocidad"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: "0.04",
							max: "0.2",
							step: "0.005",
							value: draft.growthRate,
							onChange: (e) => setField("growthRate", e.target.value),
							className: "w-full bg-input rounded-md px-3 py-2 border border-border focus:border-primary outline-none font-mono text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold",
							children: "Proximo crash"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: "1",
								step: "0.01",
								value: draft.nextCrashAt,
								onChange: (e) => setField("nextCrashAt", e.target.value),
								placeholder: "Aleatorio",
								className: "min-w-0 flex-1 bg-input rounded-md px-3 py-2 border border-border focus:border-primary outline-none font-mono text-sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: saving,
								onClick: setNextCrash,
								className: "btn-ghost px-3 text-xs font-semibold",
								children: "Fijar"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: saving || !dirty,
						onClick: saveSettings,
						className: "btn-primary px-4 py-2 text-sm inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "w-4 h-4" }), "Guardar cambios"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: saving,
						onClick: () => applyPatch({ startNext: true }),
						className: "btn-ghost px-4 py-2 text-sm inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "w-4 h-4" }), "Nueva ronda"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: saving || !snapshot?.config.nextCrashAt,
						onClick: () => {
							setField("nextCrashAt", "");
							applyPatch({ clearNextCrash: true });
						},
						className: "btn-ghost px-4 py-2 text-sm",
						children: "Aleatorio"
					})
				]
			}),
			snapshot?.config.nextCrashAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs font-mono text-primary",
				children: [
					"Próxima ronda fijada en ",
					formatMultiplier(snapshot.config.nextCrashAt),
					"."
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs font-semibold text-destructive",
				children: error
			})
		]
	});
}
function PlayerBalanceManager() {
	const [players, setPlayers] = (0, import_react.useState)([]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [amounts, setAmounts] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		const refresh = async () => setPlayers(await listPlayers());
		refresh();
		const interval = window.setInterval(() => void refresh(), 5e3);
		const unsub = subscribeRegistry(() => void refresh());
		return () => {
			window.clearInterval(interval);
			unsub();
		};
	}, []);
	const filtered = players.filter((p) => p.username.toLowerCase().includes(query.trim().toLowerCase()));
	const getAmount = (username) => parseLocaleNumber(amounts[username] ?? "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "card-surface p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display font-black",
					children: "Usuarios y saldos"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mb-4",
				children: "Verifica cuentas nuevas y gestiona el saldo de cada jugador. Los datos se guardan permanentemente en el servidor."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 bg-input rounded-md px-3 border border-border focus-within:border-primary transition-colors mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Buscar usuario…",
					className: "flex-1 bg-transparent py-2.5 text-sm outline-none"
				})]
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground text-center py-6",
				children: players.length === 0 ? "Todavía nadie se ha registrado." : "Sin resultados."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-surface p-3 flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-9 h-9 rounded-full bg-surface-hi border-2 border-accent grid place-items-center text-[10px] font-bold",
							children: p.username.slice(0, 2).toUpperCase()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 mr-auto",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm font-semibold truncate",
									children: ["@", p.username]
								}), p.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-0.5 text-[10px] font-bold text-primary bg-primary/10 border border-primary/30 rounded px-1.5 py-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "w-3 h-3" }), " Verificado"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 rounded px-1.5 py-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-3 h-3" }), " Pendiente"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-mono text-muted-foreground",
								children: formatCurrency(p.balance)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							title: p.verified ? "Revocar verificación" : "Verificar usuario",
							onClick: () => void setUserVerified(p.username, !p.verified),
							className: `btn-ghost px-2.5 h-8 text-xs font-semibold ${p.verified ? "text-destructive" : "text-primary"}`,
							children: p.verified ? "Revocar" : "Verificar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							inputMode: "decimal",
							value: amounts[p.username] ?? "",
							onChange: (e) => setAmounts((a) => ({
								...a,
								[p.username]: e.target.value.replace(/[^0-9.,]/g, "")
							})),
							placeholder: "0,00",
							className: "w-24 bg-input rounded-md px-2 py-1.5 border border-border focus:border-primary outline-none font-mono text-xs text-right"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							title: "Agregar",
							onClick: () => void adjustPlayerBalance(p.username, getAmount(p.username)),
							className: "btn-ghost w-8 h-8 grid place-items-center text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-3.5 h-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							title: "Quitar",
							onClick: () => void adjustPlayerBalance(p.username, -getAmount(p.username)),
							className: "btn-ghost w-8 h-8 grid place-items-center text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "w-3.5 h-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							title: "Fijar saldo exacto",
							onClick: () => void setPlayerBalance(p.username, getAmount(p.username)),
							className: "btn-ghost px-2.5 h-8 text-xs font-semibold",
							children: "Fijar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							title: "Resetear a 0",
							onClick: () => void setPlayerBalance(p.username, 0),
							className: "btn-ghost px-2.5 h-8 text-xs font-semibold",
							children: "0"
						})
					]
				}, p.username))
			})
		]
	});
}
//#endregion
export { AdminPage as component };

import { t as formatCurrency } from "./format-CLbc9hCa.mjs";
import { g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as useBalance, f as usePlayer, u as useAdmin } from "./admin-B7GAjUKz.mjs";
import { _ as LogOut, a as TrendingUp, d as RotateCcw, k as Bomb, o as Sparkles, s as ShieldCheck, w as Coins, x as Layers } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-D5KKjI__.js
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		to: "/mines",
		label: "Mines",
		icon: Bomb
	},
	{
		to: "/towers",
		label: "Towers",
		icon: Layers
	},
	{
		to: "/crash",
		label: "Crash",
		icon: TrendingUp
	}
];
function AppShell({ children }) {
	const { balance, reset } = useBalance();
	const { isAdmin, alwaysWin } = useAdmin();
	const { player, logout } = usePlayer();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-40 backdrop-blur-lg bg-background/90 border-b border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2.5 group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/logo.png",
								alt: "ArguPlay Casino",
								className: "h-10 w-10 rounded-md object-cover shadow-sm group-hover:scale-105 transition-transform ring-1 ring-primary/30"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display font-bold text-lg tracking-wide",
								children: ["Argu", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-primary",
									children: "Play"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "hidden md:flex items-center gap-1",
							children: nav.map((n) => {
								const active = pathname === n.to;
								const Icon = n.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: n.to,
									className: `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${active ? "bg-surface-hi text-primary" : "text-muted-foreground hover:text-foreground hover:bg-surface"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4" }), n.label]
								}, n.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								alwaysWin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-primary border border-primary/50 bg-primary/10 rounded px-2 py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3 h-3" }), " God mode"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 card-surface px-3 py-2",
									title: "Saldo",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "w-4 h-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-bold text-sm tabular-nums",
										children: formatCurrency(balance)
									})]
								}),
								isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin",
									title: "Admin panel",
									className: `btn-ghost px-2.5 py-2 text-xs flex items-center gap-1 ${alwaysWin ? "text-primary border-primary/40" : ""}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: reset,
									title: "Reset balance",
									className: "btn-ghost px-2.5 py-2 text-xs flex items-center gap-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-3.5 h-3.5" })
								}),
								player && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 card-surface pl-1.5 pr-2 py-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-8 h-8 rounded-full bg-surface-hi border-2 border-accent grid place-items-center text-[10px] font-bold",
											children: player.username.slice(0, 2).toUpperCase()
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold max-w-[110px] truncate",
											children: player.displayName || player.username
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: logout,
											title: "Cambiar de usuario",
											className: "btn-ghost w-6 h-6 grid place-items-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-3 h-3" })
										})
									]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto",
					children: nav.map((n) => {
						const active = pathname === n.to;
						const Icon = n.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: n.to,
							className: `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${active ? "bg-surface-hi text-primary" : "text-muted-foreground hover:text-foreground hover:bg-surface"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4" }), n.label]
						}, n.to);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-6xl px-4 py-6",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-16 border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ArguPlay Casino · Mines, Towers y Crash" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Proyecto de fans, sin afiliación con marcas de terceros." })]
				})
			})
		]
	});
}
//#endregion
export { AppShell as t };

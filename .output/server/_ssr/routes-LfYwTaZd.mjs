import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { A as ArrowRight, a as TrendingUp, k as Bomb, o as Sparkles, x as Layers } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5KKjI__.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-LfYwTaZd.js
var import_jsx_runtime = require_jsx_runtime();
var games = [
	{
		to: "/mines",
		name: "Mines",
		tag: "Classic",
		desc: "Revela gemas, evita las minas. Retira cuando quieras.",
		icon: Bomb,
		accent: "from-emerald-400/20 to-primary/10"
	},
	{
		to: "/towers",
		name: "Towers",
		tag: "Skill",
		desc: "Escala casilla a casilla. Elige la casilla segura en cada nivel.",
		icon: Layers,
		accent: "from-violet-400/20 to-accent/10"
	},
	{
		to: "/crash",
		name: "Crash",
		tag: "Live",
		desc: "Mira subir el multiplicador — retira antes del crash.",
		icon: TrendingUp,
		accent: "from-rose-400/20 to-destructive/10"
	}
];
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden card-surface p-6 md:p-10 mb-8 glow-primary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-accent/15 blur-3xl pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex flex-col md:flex-row md:items-center gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/logo.png",
					alt: "ArguPlay Casino",
					className: "h-28 w-28 md:h-36 md:w-36 rounded-2xl object-cover ring-2 ring-primary/40 shadow-xl shrink-0"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-bold mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), "Casino online"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display text-4xl md:text-5xl font-bold leading-tight max-w-2xl",
						children: ["Juega en ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-primary",
							children: "ArguPlay Casino"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-muted-foreground",
						children: "Mines, Towers y Crash con la misma emoción, animaciones y mecánicas clásicas. Crea tu cuenta o inicia sesión para empezar a jugar."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/mines",
							className: "btn-primary px-5 py-2.5 inline-flex items-center gap-2",
							children: ["Empezar con Mines ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/crash",
							className: "btn-ghost px-5 py-2.5 inline-flex items-center gap-2",
							children: "Probar Crash"
						})]
					})
				] })]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
		children: games.map((g) => {
			const Icon = g.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: g.to,
				className: "group card-surface p-5 relative overflow-hidden transition-transform hover:-translate-y-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute inset-0 bg-gradient-to-br ${g.accent} opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-11 h-11 rounded-lg bg-surface-hi grid place-items-center border border-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-5 h-5 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase tracking-widest font-bold text-muted-foreground border border-border rounded px-2 py-0.5",
								children: g.tag
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl font-bold",
							children: g.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: g.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 text-sm font-semibold text-primary inline-flex items-center gap-1",
							children: ["Jugar ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 transition-transform group-hover:translate-x-0.5" })]
						})
					]
				})]
			}, g.to);
		})
	})] });
}
//#endregion
export { Home as component };

import { r as __toESM } from "../__23tanstack-start-server-fn-resolver-boIEPa30.mjs";
import { _ as useRouter, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { f as usePlayer, n as BalanceProvider, r as PlayerProvider, t as AdminProvider } from "./admin-B7GAjUKz.mjs";
import { A as ArrowRight, b as LoaderCircle, r as UserPlus, s as ShieldCheck, v as LogIn } from "../_libs/lucide-react.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Dz-Z3Dv4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DwYpI3MI.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function AuthGate({ children }) {
	const { player, ready, loading, error, login, register } = usePlayer();
	const [mode, setMode] = (0, import_react.useState)("login");
	const [username, setUsername] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	if (!ready) return null;
	if (player) {
		if (!player.verified) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen grid place-items-center px-4 relative overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-sm card-surface p-6 md:p-8 glow-accent text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-10 h-10 text-primary mx-auto mb-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-xl font-bold mb-2",
						children: "Cuenta pendiente de verificación"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"Tu cuenta ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["@", player.username] }),
							" fue creada correctamente. Un administrador debe verificarla antes de que puedas jugar."
						]
					})
				]
			})]
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen grid place-items-center px-4 relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full max-w-sm card-surface p-6 md:p-8 glow-accent",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center text-center mb-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/logo.png",
								alt: "ArguPlay Casino",
								className: "h-24 w-24 rounded-xl object-cover ring-2 ring-primary/40 shadow-lg"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "font-display text-2xl font-bold mt-4 tracking-wide",
								children: [
									"Argu",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "Play"
									}),
									" Casino"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground mt-1",
								children: mode === "login" ? "Inicia sesión para jugar" : "Crea tu cuenta para empezar"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1 mb-4 p-1 rounded-lg bg-surface border border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMode("login"),
							className: `flex-1 py-2 text-xs font-semibold rounded-md transition-colors inline-flex items-center justify-center gap-1.5 ${mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "w-3.5 h-3.5" }), " Entrar"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setMode("register"),
							className: `flex-1 py-2 text-xs font-semibold rounded-md transition-colors inline-flex items-center justify-center gap-1.5 ${mode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "w-3.5 h-3.5" }), " Registrarse"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: async (e) => {
							e.preventDefault();
							if (!username.trim() || !password || loading) return;
							if (mode === "login") await login(username, password);
							else await register(username, password, displayName.trim() || void 0);
						},
						className: "space-y-3",
						children: [
							mode === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold",
								children: "Nombre para mostrar"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								value: displayName,
								disabled: loading,
								onChange: (e) => setDisplayName(e.target.value),
								placeholder: "Opcional",
								className: "w-full bg-input rounded-md px-3 py-2.5 border border-border focus:border-primary outline-none text-sm disabled:opacity-60"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold",
								children: "Usuario"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 bg-input rounded-md px-3 border border-border focus-within:border-primary transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground text-sm",
									children: "@"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									autoFocus: true,
									value: username,
									disabled: loading,
									onChange: (e) => setUsername(e.target.value),
									placeholder: "tu_usuario",
									className: "flex-1 bg-transparent py-2.5 text-sm outline-none disabled:opacity-60"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs uppercase tracking-widest text-muted-foreground font-semibold",
								children: "Contraseña"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: password,
								disabled: loading,
								onChange: (e) => setPassword(e.target.value),
								placeholder: "••••••••",
								className: "w-full bg-input rounded-md px-3 py-2.5 border border-border focus:border-primary outline-none text-sm disabled:opacity-60"
							}),
							error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-destructive",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: loading || !username.trim() || !password,
								className: "btn-primary w-full py-2.5 flex items-center justify-center gap-2",
								children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), " Procesando…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									mode === "login" ? "Entrar" : "Crear cuenta",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })
								] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex items-start gap-2 text-[11px] text-muted-foreground border-t border-border pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Tus datos y saldo se guardan de forma segura en el servidor. Las cuentas nuevas requieren verificación del administrador antes de jugar." })]
					})
				]
			})
		]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$5 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ArguPlay Casino - Mines, Towers y Crash" },
			{
				name: "description",
				content: "ArguPlay Casino. Juega Mines, Towers y Crash con tu cuenta."
			},
			{
				property: "og:title",
				content: "ArguPlay Casino"
			},
			{
				property: "og:description",
				content: "Mines, Towers y Crash en ArguPlay Casino."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Montserrat:wght@400;500;600;700;800&display=swap"
			},
			{
				rel: "icon",
				href: "/logo.png",
				type: "image/png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "es",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$5.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) }) })
	});
}
var $$splitComponentImporter$4 = () => import("./towers-dJXiDRaK.mjs");
var Route$4 = createFileRoute("/towers")({
	head: () => ({ meta: [{ title: "Towers | ArguPlay Casino" }, {
		name: "description",
		content: "Juega Towers en ArguPlay Casino. Escala la torre casilla a casilla."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./mines-CyMGZcOP.mjs");
var Route$3 = createFileRoute("/mines")({
	head: () => ({ meta: [{ title: "Mines | ArguPlay Casino" }, {
		name: "description",
		content: "Juega Mines en ArguPlay Casino. Revela gemas, evita las bombas y retira cuando quieras."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./crash-C-wiQz9r.mjs");
var Route$2 = createFileRoute("/crash")({
	head: () => ({ meta: [{ title: "Crash - En vivo | ArguPlay" }, {
		name: "description",
		content: "Crash en tiempo real con ronda compartida, jugadores en vivo y retiro objetivo."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin-DvgaCpbN.mjs");
var Route$1 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Admin — ArguPlay" }, {
		name: "robots",
		content: "noindex,nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./routes-LfYwTaZd.mjs");
var Route = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var TowersRoute = Route$4.update({
	id: "/towers",
	path: "/towers",
	getParentRoute: () => Route$5
});
var MinesRoute = Route$3.update({
	id: "/mines",
	path: "/mines",
	getParentRoute: () => Route$5
});
var CrashRoute = Route$2.update({
	id: "/crash",
	path: "/crash",
	getParentRoute: () => Route$5
});
var AdminRoute = Route$1.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$5
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	AdminRoute,
	CrashRoute,
	MinesRoute,
	TowersRoute
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };

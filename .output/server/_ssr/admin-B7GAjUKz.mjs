import { r as __toESM, t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-boIEPa30.mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-B7GAjUKz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var registerAccount = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("7cfdbe25ba60cac962ba7ee61532e61d0d4293c1943fbea952bd888bd9462dac"));
var loginAccount = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("0eb17c358af37f8039ac0343a60cd16420dcc1edf7dc3de9f1c05a49577a840f"));
var fetchUserProfile = createServerFn({ method: "GET" }).validator((username) => username).handler(createSsrRpc("cd91789d93128e43fd68214cb810d273a01dd8556f0711e1d8f22298c34e093c"));
var Ctx$2 = (0, import_react.createContext)(null);
var KEY = "ap_player_session_v1";
function PlayerProvider({ children }) {
	const [player, setPlayer] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const persist = (profile) => {
		setPlayer(profile);
		try {
			sessionStorage.setItem(KEY, JSON.stringify(profile));
		} catch {}
	};
	(0, import_react.useEffect)(() => {
		try {
			const raw = sessionStorage.getItem(KEY);
			if (raw) setPlayer(JSON.parse(raw));
		} catch {}
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!player) return;
		let cancelled = false;
		const refresh = async () => {
			try {
				const profile = await fetchUserProfile({ data: player.username });
				if (!cancelled) persist(profile);
			} catch {}
		};
		refresh();
		const interval = window.setInterval(refresh, 8e3);
		return () => {
			cancelled = true;
			window.clearInterval(interval);
		};
	}, [player?.username]);
	const login = async (username, password) => {
		setLoading(true);
		setError(null);
		try {
			const profile = await loginAccount({ data: {
				username,
				password
			} });
			persist(profile);
			return true;
		} catch (e) {
			setError(e instanceof Error ? e.message : "No se pudo iniciar sesión.");
			return false;
		} finally {
			setLoading(false);
		}
	};
	const register = async (username, password, displayName) => {
		setLoading(true);
		setError(null);
		try {
			const profile = await registerAccount({ data: {
				username,
				password,
				displayName
			} });
			persist(profile);
			return true;
		} catch (e) {
			setError(e instanceof Error ? e.message : "No se pudo registrar la cuenta.");
			return false;
		} finally {
			setLoading(false);
		}
	};
	const logout = () => {
		setPlayer(null);
		try {
			sessionStorage.removeItem(KEY);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx$2.Provider, {
		value: {
			player,
			ready,
			loading,
			error,
			login,
			register,
			logout
		},
		children
	});
}
function usePlayer() {
	const c = (0, import_react.useContext)(Ctx$2);
	if (!c) throw new Error("usePlayer must be used inside PlayerProvider");
	return c;
}
createServerFn({ method: "GET" }).handler(createSsrRpc("128e8a06800fb5a03cdd7dc6df93db8ff9a85fc7c8ccba64923a31dcb853ca4e"));
var fetchPlayersList = createServerFn({ method: "GET" }).handler(createSsrRpc("593021aebd9d9d1a49839b3b79af8251a1af24fd89675cd99e2f961c6e42c4e4"));
var fetchPlayerBalance = createServerFn({ method: "GET" }).validator((username) => username).handler(createSsrRpc("f858deaa9bfecc7f3eaa52cfd19f0ea7879a7852027df517dce0fab5e052e8a9"));
var upsertPlayerServer = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("0aaaa298252c3612b2ac8efb6a1398f83ad231720c8e7316e21ffa61cb268912"));
var setPlayerBalanceServer = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("7252171fc1034ee7dddcbea0793998399014e120e57b3507e2328ac323f9f5f5"));
var adjustPlayerBalanceServer = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("634646ecfe1ce43ca0f5fc4f39faf7f1ddab2a97965769a430b00c875ddb5722"));
var setUserVerifiedServer = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("57d819ef1afb4142378bdcec3cc7c91056b1651f660982cbf5cf45e4ba412e95"));
var EVENT = "ap-registry-changed";
function notifyChange() {
	try {
		window.dispatchEvent(new CustomEvent(EVENT));
	} catch {}
}
async function upsertPlayer(username, patch) {
	const entry = await upsertPlayerServer({ data: {
		username,
		...patch
	} });
	notifyChange();
	return entry;
}
async function getPlayerBalance(username) {
	return fetchPlayerBalance({ data: username });
}
async function setPlayerBalance(username, balance) {
	const entry = await setPlayerBalanceServer({ data: {
		username,
		balance
	} });
	notifyChange();
	return entry;
}
async function adjustPlayerBalance(username, delta) {
	const entry = await adjustPlayerBalanceServer({ data: {
		username,
		delta
	} });
	notifyChange();
	return entry;
}
async function setUserVerified(username, verified) {
	const entry = await setUserVerifiedServer({ data: {
		username,
		verified
	} });
	notifyChange();
	return entry;
}
async function listPlayers() {
	return fetchPlayersList();
}
function subscribeRegistry(cb) {
	window.addEventListener(EVENT, cb);
	return () => window.removeEventListener(EVENT, cb);
}
var Ctx$1 = (0, import_react.createContext)(null);
function BalanceProvider({ children }) {
	const { player } = usePlayer();
	const [balance, setBalanceState] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!player) {
			setBalanceState(0);
			return;
		}
		let cancelled = false;
		(async () => {
			const entry = await upsertPlayer(player.username, { displayName: player.displayName });
			if (!cancelled) setBalanceState(entry.balance);
		})();
		return () => {
			cancelled = true;
		};
	}, [player?.username, player?.displayName]);
	(0, import_react.useEffect)(() => {
		if (!player) return;
		const refresh = async () => {
			const next = await getPlayerBalance(player.username);
			setBalanceState(next);
		};
		refresh();
		return subscribeRegistry(refresh);
	}, [player?.username]);
	const value = {
		balance,
		set: (n) => {
			if (!player) return;
			setPlayerBalance(player.username, n).then((entry) => setBalanceState(entry.balance));
		},
		add: (n) => {
			if (!player) return;
			adjustPlayerBalance(player.username, n).then((entry) => setBalanceState(entry.balance));
		},
		reset: () => {
			if (!player) return;
			setPlayerBalance(player.username, 0).then((entry) => setBalanceState(entry.balance));
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx$1.Provider, {
		value,
		children
	});
}
function useBalance() {
	const c = (0, import_react.useContext)(Ctx$1);
	if (!c) throw new Error("useBalance must be used inside BalanceProvider");
	return c;
}
var Ctx = (0, import_react.createContext)(null);
var WIN_KEY = "ap_always_win_v1";
var PW_OK_KEY = "ap_admin_pw_ok_v1";
function AdminProvider({ children }) {
	const { player } = usePlayer();
	const [alwaysWin, setAlwaysWinState] = (0, import_react.useState)(false);
	const [authorized, setAuthorizedState] = (0, import_react.useState)(false);
	const [passwordError, setPasswordError] = (0, import_react.useState)(false);
	const isAdmin = !!player && player.username.trim().toLowerCase() === "tralalero_lean".toLowerCase();
	(0, import_react.useEffect)(() => {
		if (!isAdmin) {
			setAuthorizedState(false);
			return;
		}
		try {
			setAuthorizedState(sessionStorage.getItem(PW_OK_KEY) === "1");
		} catch {}
	}, [isAdmin]);
	(0, import_react.useEffect)(() => {
		try {
			setAlwaysWinState(isAdmin && localStorage.getItem(WIN_KEY) === "1");
		} catch {}
	}, [isAdmin]);
	const verifyPassword = (pw) => {
		if (!isAdmin) return false;
		if (pw === "12345") {
			setAuthorizedState(true);
			setPasswordError(false);
			try {
				sessionStorage.setItem(PW_OK_KEY, "1");
			} catch {}
			return true;
		}
		setPasswordError(true);
		return false;
	};
	const authorizedFinal = isAdmin && authorized;
	const setAlwaysWin = (v) => {
		if (!authorizedFinal) return;
		setAlwaysWinState(v);
		try {
			localStorage.setItem(WIN_KEY, v ? "1" : "0");
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			isAdmin,
			authorized: authorizedFinal,
			passwordError,
			verifyPassword,
			alwaysWin: authorizedFinal && alwaysWin,
			setAlwaysWin
		},
		children
	});
}
function useAdmin() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("useAdmin must be used inside AdminProvider");
	return c;
}
//#endregion
export { createSsrRpc as a, setUserVerified as c, useBalance as d, usePlayer as f, adjustPlayerBalance as i, subscribeRegistry as l, BalanceProvider as n, listPlayers as o, PlayerProvider as r, setPlayerBalance as s, AdminProvider as t, useAdmin as u };

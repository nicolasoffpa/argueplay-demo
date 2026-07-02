import { r as formatMultiplier, t as formatCurrency } from "./format-CLbc9hCa.mjs";
import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crashRealtime-CR5ogO0u.js
var DEFAULT_CONFIG = {
	tableName: "Crash en vivo",
	liveMessage: "Rondas sincronizadas para todos los jugadores conectados.",
	bettingSeconds: 8,
	breakSeconds: 4,
	growthRate: .09,
	nextCrashAt: null
};
var STORE_KEY = "__arguplay_crash_realtime_v1__";
function getStore() {
	const root = globalThis;
	if (!root[STORE_KEY]) {
		root[STORE_KEY] = {
			roundId: 1,
			phase: "betting",
			crashAt: null,
			bettingEndsAt: Date.now() + DEFAULT_CONFIG.bettingSeconds * 1e3,
			roundStartedAt: null,
			crashedAt: null,
			nextRoundAt: null,
			history: [],
			players: /* @__PURE__ */ new Map(),
			events: [],
			config: { ...DEFAULT_CONFIG },
			eventId: 0
		};
		pushEvent(root[STORE_KEY], "system", "Mesa abierta. Apuestas disponibles.");
	}
	return root[STORE_KEY];
}
function roundMoney(value) {
	return Math.max(0, Math.round(value * 100) / 100);
}
function roundMultiplier(value) {
	return Math.max(1, Math.floor(value * 100) / 100);
}
function rollCrash() {
	if (Math.random() < .04) return 1;
	const raw = .99 / (1 - Math.random());
	return Math.min(500, Math.max(1.01, Math.floor(raw * 100) / 100));
}
function getMultiplier(state, now = Date.now()) {
	if (state.phase !== "running" || !state.roundStartedAt) return 1;
	const elapsed = Math.max(0, (now - state.roundStartedAt) / 1e3);
	return roundMultiplier(Math.exp(state.config.growthRate * elapsed));
}
function pushEvent(state, type, message, username) {
	state.eventId += 1;
	state.events = [{
		id: state.eventId,
		type,
		at: Date.now(),
		message,
		username
	}, ...state.events].slice(0, 40);
}
function startBetting(state, now = Date.now()) {
	state.roundId += 1;
	state.phase = "betting";
	state.crashAt = null;
	state.roundStartedAt = null;
	state.crashedAt = null;
	state.nextRoundAt = null;
	state.bettingEndsAt = now + state.config.bettingSeconds * 1e3;
	state.players = /* @__PURE__ */ new Map();
	pushEvent(state, "system", `Ronda #${state.roundId}: apuestas abiertas.`);
}
function startRound(state, now = Date.now()) {
	const nextCrash = state.config.nextCrashAt;
	state.crashAt = nextCrash && nextCrash >= 1 ? roundMultiplier(nextCrash) : rollCrash();
	state.config.nextCrashAt = null;
	state.phase = "running";
	state.roundStartedAt = now;
	state.bettingEndsAt = null;
	for (const player of state.players.values()) player.status = "active";
	pushEvent(state, "system", `Ronda #${state.roundId}: multiplicador en marcha.`);
}
function settleWinners(state, currentMultiplier) {
	for (const player of state.players.values()) {
		if (player.status !== "active") continue;
		if (currentMultiplier < player.target) continue;
		player.status = "won";
		player.cashedAt = player.target;
		player.payout = roundMoney(player.bet * player.target);
		player.profit = roundMoney(player.payout - player.bet);
		pushEvent(state, "win", `${player.displayName} ganó en ${formatMultiplier(player.target)}`, player.username);
	}
}
function crashRound(state, crashAt, now = Date.now()) {
	const finalCrash = roundMultiplier(crashAt);
	state.phase = "crashed";
	state.crashAt = finalCrash;
	state.crashedAt = now;
	state.nextRoundAt = now + state.config.breakSeconds * 1e3;
	state.history = [finalCrash, ...state.history].slice(0, 16);
	for (const player of state.players.values()) if (player.status === "active" || player.status === "waiting") {
		player.status = "lost";
		player.cashedAt = null;
		player.payout = 0;
		player.profit = -player.bet;
		pushEvent(state, "loss", `${player.displayName} perdió en ${formatMultiplier(player.target)}`, player.username);
	}
	pushEvent(state, "system", `Crash en ${formatMultiplier(finalCrash)}.`);
}
function advance(state, now = Date.now()) {
	if (state.phase === "paused") return;
	if (state.phase === "betting" && state.bettingEndsAt && now >= state.bettingEndsAt) startRound(state, now);
	if (state.phase === "running" && state.crashAt) {
		const current = getMultiplier(state, now);
		settleWinners(state, current);
		if (current >= state.crashAt) crashRound(state, state.crashAt, now);
	}
	if (state.phase === "crashed" && state.nextRoundAt && now >= state.nextRoundAt) startBetting(state, now);
}
function snapshot(state) {
	const now = Date.now();
	advance(state, now);
	return {
		serverNow: now,
		roundId: state.roundId,
		phase: state.phase,
		multiplier: state.phase === "crashed" && state.crashAt ? state.crashAt : getMultiplier(state, now),
		crashAt: state.phase === "crashed" ? state.crashAt : null,
		bettingEndsAt: state.bettingEndsAt,
		roundStartedAt: state.roundStartedAt,
		crashedAt: state.crashedAt,
		nextRoundAt: state.nextRoundAt,
		history: [...state.history],
		players: [...state.players.values()].sort((a, b) => b.joinedAt - a.joinedAt),
		events: [...state.events],
		config: { ...state.config }
	};
}
function requireAdmin(input) {
	if (input.username.trim().toLowerCase() !== "tralalero_lean".toLowerCase() || input.password !== "12345") throw new Error("Admin no autorizado.");
}
var getCrashSnapshot_createServerFn_handler = createServerRpc({
	id: "2d13a9a93b1deec59c96f78b5a8dccbac37297d8cc888ce412ba3363c185e1c1",
	name: "getCrashSnapshot",
	filename: "src/lib/crashRealtime.ts"
}, (opts) => getCrashSnapshot.__executeServer(opts));
var getCrashSnapshot = createServerFn({ method: "GET" }).handler(getCrashSnapshot_createServerFn_handler, () => {
	return snapshot(getStore());
});
var joinCrashRound_createServerFn_handler = createServerRpc({
	id: "db6e751b03b587ab94290735be624c54350c416921622cbd7612c05615e1debd",
	name: "joinCrashRound",
	filename: "src/lib/crashRealtime.ts"
}, (opts) => joinCrashRound.__executeServer(opts));
var joinCrashRound = createServerFn({ method: "POST" }).validator((input) => input).handler(joinCrashRound_createServerFn_handler, ({ data }) => {
	const state = getStore();
	advance(state);
	if (state.phase !== "betting") throw new Error("La ronda ya esta en marcha. Espera la siguiente.");
	const username = data.username.trim();
	const key = username.toLowerCase();
	if (!username) throw new Error("Jugador invalido.");
	if (state.players.has(key)) throw new Error("Ya estas dentro de esta ronda.");
	const bet = roundMoney(Number(data.bet));
	const target = roundMultiplier(Number(data.target));
	if (!Number.isFinite(bet) || bet <= 0) throw new Error("Apuesta invalida.");
	if (!Number.isFinite(target) || target < 1.01) throw new Error("El objetivo minimo es 1.01x.");
	const player = {
		id: `${state.roundId}:${key}`,
		username,
		displayName: data.displayName || username,
		avatarUrl: data.avatarUrl ?? null,
		bet,
		target,
		joinedAt: Date.now(),
		status: "waiting",
		cashedAt: null,
		payout: 0,
		profit: 0
	};
	state.players.set(key, player);
	pushEvent(state, "join", `${player.displayName} entró con ${formatCurrency(bet)} a ${formatMultiplier(target)}`, player.username);
	return snapshot(state);
});
var updateCrashAdmin_createServerFn_handler = createServerRpc({
	id: "4ececefb58b95a70bff8cf8a01bb10da823eb9cb70e8c06786489b18ca549a55",
	name: "updateCrashAdmin",
	filename: "src/lib/crashRealtime.ts"
}, (opts) => updateCrashAdmin.__executeServer(opts));
var updateCrashAdmin = createServerFn({ method: "POST" }).validator((input) => input).handler(updateCrashAdmin_createServerFn_handler, ({ data }) => {
	requireAdmin(data.admin);
	const state = getStore();
	advance(state);
	const patch = data.patch;
	if (typeof patch.tableName === "string") state.config.tableName = patch.tableName.trim().slice(0, 42) || DEFAULT_CONFIG.tableName;
	if (typeof patch.liveMessage === "string") state.config.liveMessage = patch.liveMessage.trim().slice(0, 140);
	if (typeof patch.bettingSeconds === "number" && Number.isFinite(patch.bettingSeconds)) state.config.bettingSeconds = Math.min(30, Math.max(3, Math.round(patch.bettingSeconds)));
	if (typeof patch.breakSeconds === "number" && Number.isFinite(patch.breakSeconds)) state.config.breakSeconds = Math.min(15, Math.max(2, Math.round(patch.breakSeconds)));
	if (typeof patch.growthRate === "number" && Number.isFinite(patch.growthRate)) state.config.growthRate = Math.min(.2, Math.max(.04, Math.round(patch.growthRate * 1e3) / 1e3));
	if (typeof patch.nextCrashAt === "number" && Number.isFinite(patch.nextCrashAt)) state.config.nextCrashAt = Math.min(500, Math.max(1, roundMultiplier(patch.nextCrashAt)));
	if (patch.clearNextCrash) state.config.nextCrashAt = null;
	if (patch.pause && state.phase !== "paused") {
		state.phase = "paused";
		state.bettingEndsAt = null;
		state.roundStartedAt = null;
		state.crashedAt = null;
		state.nextRoundAt = null;
		pushEvent(state, "system", "Mesa pausada por administracion.");
	}
	if (patch.startNext) {
		startBetting(state);
		pushEvent(state, "system", "Nueva ronda iniciada por administracion.");
	}
	if (patch.crashNow && state.phase === "running") {
		crashRound(state, getMultiplier(state), Date.now());
		pushEvent(state, "system", "Crash manual ejecutado por administracion.");
	}
	return snapshot(state);
});
//#endregion
export { getCrashSnapshot_createServerFn_handler, joinCrashRound_createServerFn_handler, updateCrashAdmin_createServerFn_handler };

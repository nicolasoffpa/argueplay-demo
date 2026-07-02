import { createServerFn } from "@tanstack/react-start";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "./adminConstants";
import { formatCurrency, formatInteger, formatMultiplier } from "./format";

export type CrashPhase = "betting" | "running" | "crashed" | "paused";

export type CrashPlayerStatus = "waiting" | "active" | "won" | "lost";

export type CrashPlayer = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bet: number;
  target: number;
  joinedAt: number;
  status: CrashPlayerStatus;
  cashedAt: number | null;
  payout: number;
  profit: number;
};

export type CrashEvent = {
  id: number;
  type: "join" | "win" | "loss" | "system";
  at: number;
  message: string;
  username?: string;
};

export type CrashConfig = {
  tableName: string;
  liveMessage: string;
  bettingSeconds: number;
  breakSeconds: number;
  growthRate: number;
  nextCrashAt: number | null;
};

export type CrashSnapshot = {
  serverNow: number;
  roundId: number;
  phase: CrashPhase;
  multiplier: number;
  crashAt: number | null;
  bettingEndsAt: number | null;
  roundStartedAt: number | null;
  crashedAt: number | null;
  nextRoundAt: number | null;
  history: number[];
  players: CrashPlayer[];
  events: CrashEvent[];
  config: CrashConfig;
};

type JoinInput = {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bet: number;
  target: number;
};

type AdminInput = {
  username: string;
  password: string;
};

export type CrashAdminPatch = Partial<CrashConfig> & {
  pause?: boolean;
  startNext?: boolean;
  crashNow?: boolean;
  clearNextCrash?: boolean;
};

type CrashState = Omit<CrashSnapshot, "serverNow" | "multiplier" | "players" | "events" | "config"> & {
  players: Map<string, CrashPlayer>;
  events: CrashEvent[];
  config: CrashConfig;
  eventId: number;
};

const DEFAULT_CONFIG: CrashConfig = {
  tableName: "Crash en vivo",
  liveMessage: "Rondas sincronizadas para todos los jugadores conectados.",
  bettingSeconds: 8,
  breakSeconds: 4,
  growthRate: 0.09,
  nextCrashAt: null,
};

const STORE_KEY = "__arguplay_crash_realtime_v1__";

function getStore(): CrashState {
  const root = globalThis as typeof globalThis & { [STORE_KEY]?: CrashState };
  if (!root[STORE_KEY]) {
    const now = Date.now();
    root[STORE_KEY] = {
      roundId: 1,
      phase: "betting",
      crashAt: null,
      bettingEndsAt: now + DEFAULT_CONFIG.bettingSeconds * 1000,
      roundStartedAt: null,
      crashedAt: null,
      nextRoundAt: null,
      history: [],
      players: new Map(),
      events: [],
      config: { ...DEFAULT_CONFIG },
      eventId: 0,
    };
    pushEvent(root[STORE_KEY], "system", "Mesa abierta. Apuestas disponibles.");
  }
  return root[STORE_KEY];
}

function roundMoney(value: number) {
  return Math.max(0, Math.round(value * 100) / 100);
}

function roundMultiplier(value: number) {
  return Math.max(1, Math.floor(value * 100) / 100);
}

function rollCrash(): number {
  const instantBust = Math.random() < 0.04;
  if (instantBust) return 1;
  const raw = 0.99 / (1 - Math.random());
  return Math.min(500, Math.max(1.01, Math.floor(raw * 100) / 100));
}

function getMultiplier(state: CrashState, now = Date.now()) {
  if (state.phase !== "running" || !state.roundStartedAt) return 1;
  const elapsed = Math.max(0, (now - state.roundStartedAt) / 1000);
  return roundMultiplier(Math.exp(state.config.growthRate * elapsed));
}

function pushEvent(
  state: CrashState,
  type: CrashEvent["type"],
  message: string,
  username?: string,
) {
  state.eventId += 1;
  state.events = [
    { id: state.eventId, type, at: Date.now(), message, username },
    ...state.events,
  ].slice(0, 40);
}

function startBetting(state: CrashState, now = Date.now()) {
  state.roundId += 1;
  state.phase = "betting";
  state.crashAt = null;
  state.roundStartedAt = null;
  state.crashedAt = null;
  state.nextRoundAt = null;
  state.bettingEndsAt = now + state.config.bettingSeconds * 1000;
  state.players = new Map();
  pushEvent(state, "system", `Ronda #${state.roundId}: apuestas abiertas.`);
}

function startRound(state: CrashState, now = Date.now()) {
  const nextCrash = state.config.nextCrashAt;
  state.crashAt = nextCrash && nextCrash >= 1 ? roundMultiplier(nextCrash) : rollCrash();
  state.config.nextCrashAt = null;
  state.phase = "running";
  state.roundStartedAt = now;
  state.bettingEndsAt = null;
  for (const player of state.players.values()) {
    player.status = "active";
  }
  pushEvent(state, "system", `Ronda #${state.roundId}: multiplicador en marcha.`);
}

function settleWinners(state: CrashState, currentMultiplier: number) {
  for (const player of state.players.values()) {
    if (player.status !== "active") continue;
    if (currentMultiplier < player.target) continue;
    player.status = "won";
    player.cashedAt = player.target;
    player.payout = roundMoney(player.bet * player.target);
    player.profit = roundMoney(player.payout - player.bet);
    pushEvent(
      state,
      "win",
      `${player.displayName} ganó en ${formatMultiplier(player.target)}`,
      player.username,
    );
  }
}

function crashRound(state: CrashState, crashAt: number, now = Date.now()) {
  const finalCrash = roundMultiplier(crashAt);
  state.phase = "crashed";
  state.crashAt = finalCrash;
  state.crashedAt = now;
  state.nextRoundAt = now + state.config.breakSeconds * 1000;
  state.history = [finalCrash, ...state.history].slice(0, 16);

  for (const player of state.players.values()) {
    if (player.status === "active" || player.status === "waiting") {
      player.status = "lost";
      player.cashedAt = null;
      player.payout = 0;
      player.profit = -player.bet;
      pushEvent(
        state,
        "loss",
        `${player.displayName} perdió en ${formatMultiplier(player.target)}`,
        player.username,
      );
    }
  }

  pushEvent(state, "system", `Crash en ${formatMultiplier(finalCrash)}.`);
}

function advance(state: CrashState, now = Date.now()) {
  if (state.phase === "paused") return;

  if (state.phase === "betting" && state.bettingEndsAt && now >= state.bettingEndsAt) {
    startRound(state, now);
  }

  if (state.phase === "running" && state.crashAt) {
    const current = getMultiplier(state, now);
    settleWinners(state, current);
    if (current >= state.crashAt) {
      crashRound(state, state.crashAt, now);
    }
  }

  if (state.phase === "crashed" && state.nextRoundAt && now >= state.nextRoundAt) {
    startBetting(state, now);
  }
}

function snapshot(state: CrashState): CrashSnapshot {
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
    config: { ...state.config },
  };
}

function requireAdmin(input: AdminInput) {
  if (
    input.username.trim().toLowerCase() !== ADMIN_USERNAME.toLowerCase() ||
    input.password !== ADMIN_PASSWORD
  ) {
    throw new Error("Admin no autorizado.");
  }
}

export const getCrashSnapshot = createServerFn({ method: "GET" }).handler(() => {
  return snapshot(getStore());
});

export const joinCrashRound = createServerFn({ method: "POST" })
  .validator((input: JoinInput) => input)
  .handler(({ data }) => {
    const state = getStore();
    advance(state);
    if (state.phase !== "betting") {
      throw new Error("La ronda ya esta en marcha. Espera la siguiente.");
    }

    const username = data.username.trim();
    const key = username.toLowerCase();
    if (!username) throw new Error("Jugador invalido.");
    if (state.players.has(key)) throw new Error("Ya estas dentro de esta ronda.");

    const bet = roundMoney(Number(data.bet));
    const target = roundMultiplier(Number(data.target));
    if (!Number.isFinite(bet) || bet <= 0) throw new Error("Apuesta invalida.");
    if (!Number.isFinite(target) || target < 1.01) throw new Error("El objetivo minimo es 1.01x.");

    const player: CrashPlayer = {
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
      profit: 0,
    };

    state.players.set(key, player);
    pushEvent(
      state,
      "join",
      `${player.displayName} entró con ${formatCurrency(bet)} a ${formatMultiplier(target)}`,
      player.username,
    );
    return snapshot(state);
  });

export const updateCrashAdmin = createServerFn({ method: "POST" })
  .validator((input: { admin: AdminInput; patch: CrashAdminPatch }) => input)
  .handler(({ data }) => {
    requireAdmin(data.admin);
    const state = getStore();
    advance(state);

    const patch = data.patch;
    if (typeof patch.tableName === "string") {
      state.config.tableName = patch.tableName.trim().slice(0, 42) || DEFAULT_CONFIG.tableName;
    }
    if (typeof patch.liveMessage === "string") {
      state.config.liveMessage = patch.liveMessage.trim().slice(0, 140);
    }
    if (typeof patch.bettingSeconds === "number" && Number.isFinite(patch.bettingSeconds)) {
      state.config.bettingSeconds = Math.min(30, Math.max(3, Math.round(patch.bettingSeconds)));
    }
    if (typeof patch.breakSeconds === "number" && Number.isFinite(patch.breakSeconds)) {
      state.config.breakSeconds = Math.min(15, Math.max(2, Math.round(patch.breakSeconds)));
    }
    if (typeof patch.growthRate === "number" && Number.isFinite(patch.growthRate)) {
      state.config.growthRate = Math.min(0.2, Math.max(0.04, Math.round(patch.growthRate * 1000) / 1000));
    }
    if (typeof patch.nextCrashAt === "number" && Number.isFinite(patch.nextCrashAt)) {
      state.config.nextCrashAt = Math.min(500, Math.max(1, roundMultiplier(patch.nextCrashAt)));
    }
    if (patch.clearNextCrash) {
      state.config.nextCrashAt = null;
    }
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



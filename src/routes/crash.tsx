import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BetControls, StatRow } from "@/components/GameUI";
import { formatCurrency, useBalance } from "@/lib/balance";
import { formatDecimal, formatMultiplier } from "@/lib/format";
import { usePlayer } from "@/lib/player";
import {
  getCrashSnapshot,
  joinCrashRound,
  type CrashEvent,
  type CrashPhase,
  type CrashPlayer,
  type CrashSnapshot,
} from "@/lib/crashRealtime";
import { Clock, HandCoins, Radio, TrendingUp, Trophy, Users, XCircle } from "lucide-react";

export const Route = createFileRoute("/crash")({
  head: () => ({
    meta: [
      { title: "Crash - En vivo | ArguPlay" },
      {
        name: "description",
        content: "Crash en tiempo real con ronda compartida, jugadores en vivo y retiro objetivo.",
      },
    ],
  }),
  component: CrashPage,
});

const SETTLED_KEY = "ap_crash_settled_bets_v1";

function readSettledIds() {
  if (typeof window === "undefined") return new Set<string>();
  try {
    const raw = sessionStorage.getItem(SETTLED_KEY);
    const ids = raw ? (JSON.parse(raw) as string[]) : [];
    return new Set(ids);
  } catch {
    return new Set<string>();
  }
}

function markSettled(id: string) {
  if (typeof window === "undefined") return;
  const next = [id, ...readSettledIds()].slice(0, 100);
  try {
    sessionStorage.setItem(SETTLED_KEY, JSON.stringify(next));
  } catch {}
}

function phaseLabel(phase: CrashPhase | undefined) {
  if (phase === "betting") return "Apuestas abiertas";
  if (phase === "running") return "Ronda en curso";
  if (phase === "crashed") return "Crash";
  if (phase === "paused") return "Mesa pausada";
  return "Sincronizando";
}

function formatCountdown(ms: number) {
  return `${Math.max(0, Math.ceil(ms / 1000))}s`;
}

function moneyClass(value: number) {
  if (value > 0) return "text-primary";
  if (value < 0) return "text-destructive";
  return "text-muted-foreground";
}

function computeLiveMultiplier(snapshot: CrashSnapshot | null, estimatedServerNow: number) {
  if (!snapshot) return 1;
  if (snapshot.phase !== "running" || !snapshot.roundStartedAt) return snapshot.multiplier;
  const elapsed = Math.max(0, (estimatedServerNow - snapshot.roundStartedAt) / 1000);
  return Math.max(1, Math.floor(Math.exp(snapshot.config.growthRate * elapsed) * 100) / 100);
}

function CrashPage() {
  const { balance, add } = useBalance();
  const { player } = usePlayer();
  const [bet, setBet] = useState(10);
  const [target, setTarget] = useState(2);
  const [snapshot, setSnapshot] = useState<CrashSnapshot | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [clientNow, setClientNow] = useState(Date.now());
  const receivedAt = useRef(Date.now());
  const polling = useRef(false);

  useEffect(() => {
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

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      setClientNow(Date.now());
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const estimatedServerNow = snapshot
    ? snapshot.serverNow + (clientNow - receivedAt.current)
    : clientNow;
  const displayMultiplier = computeLiveMultiplier(snapshot, estimatedServerNow);

  const currentPlayer = useMemo(() => {
    if (!snapshot || !player) return null;
    return snapshot.players.find(
      (p) => p.username.toLowerCase() === player.username.toLowerCase(),
    ) ?? null;
  }, [snapshot, player?.username]);

  const activeOrWaiting = currentPlayer?.status === "waiting" || currentPlayer?.status === "active";
  const canJoin =
    !!player &&
    snapshot?.phase === "betting" &&
    !currentPlayer &&
    bet > 0 &&
    bet <= balance &&
    target >= 1.01 &&
    !pending;

  const countdownMs = (() => {
    if (!snapshot) return 0;
    if (snapshot.phase === "betting" && snapshot.bettingEndsAt) {
      return snapshot.bettingEndsAt - estimatedServerNow;
    }
    if (snapshot.phase === "crashed" && snapshot.nextRoundAt) {
      return snapshot.nextRoundAt - estimatedServerNow;
    }
    return 0;
  })();

  useEffect(() => {
    if (!snapshot || !player) return;
    const mine = snapshot.players.find(
      (p) => p.username.toLowerCase() === player.username.toLowerCase(),
    );
    if (!mine || (mine.status !== "won" && mine.status !== "lost")) return;
    if (readSettledIds().has(mine.id)) return;

    if (mine.status === "won" && mine.payout > 0) {
      add(mine.payout);
      setLastResult(`Ganaste +${formatCurrency(mine.profit)} en ${formatMultiplier(mine.cashedAt ?? 0)}`);
    } else {
      setLastResult(`Perdiste ${formatCurrency(mine.bet)} en ${formatMultiplier(mine.target)}`);
    }
    markSettled(mine.id);
  }, [snapshot, player?.username, add]);

  const handleJoin = async () => {
    if (!player || !snapshot) return;
    if (!canJoin) {
      setError(bet > balance ? "Saldo insuficiente para esta apuesta." : "Espera la siguiente ronda.");
      return;
    }

    setPending(true);
    setError(null);
    try {
      const next = await joinCrashRound({
        data: {
          username: player.username,
          displayName: player.displayName || player.username,
          avatarUrl: null,
          bet,
          target,
        },
      });
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

  const multiplierColor = snapshot?.phase === "crashed"
    ? "text-destructive"
    : currentPlayer?.status === "won"
      ? "text-primary"
      : "text-foreground";

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="grid lg:grid-cols-[320px_1fr] gap-5">
          <aside className="space-y-4">
            <BetControls
              bet={bet}
              setBet={setBet}
              disabled={Boolean(activeOrWaiting) || snapshot?.phase !== "betting"}
            />

            <div className="card-surface p-4 space-y-3">
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Retiro objetivo
              </label>
              <div className="flex items-center gap-2 bg-input rounded-md px-3 border border-border focus-within:border-primary transition-colors">
                <TrendingUp className="w-4 h-4 text-primary" />
                <input
                  type="number"
                  step="0.01"
                  min="1.01"
                  value={target}
                  disabled={Boolean(activeOrWaiting) || snapshot?.phase !== "betting"}
                  onChange={(e) => setTarget(Math.max(1.01, Number(e.target.value) || 1.01))}
                  className="flex-1 bg-transparent py-2 font-mono font-bold text-sm tabular-nums outline-none disabled:opacity-60"
                />
                <span className="text-xs text-muted-foreground">x</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1.5, 2, 3, 5].map((value) => (
                  <button
                    key={value}
                    disabled={Boolean(activeOrWaiting) || snapshot?.phase !== "betting"}
                    onClick={() => setTarget(value)}
                    className="btn-ghost py-1.5 text-xs font-semibold"
                  >
                    {formatMultiplier(value, value % 1 === 0 ? 0 : 1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-surface p-4 space-y-2">
              <StatRow label="Estado" value={phaseLabel(snapshot?.phase)} />
              <StatRow
                label={snapshot?.phase === "crashed" ? "Nueva ronda" : "Tiempo"}
                value={snapshot?.phase === "running" ? "En vivo" : formatCountdown(countdownMs)}
              />
              <StatRow label="Jugadores" value={String(snapshot?.players.length ?? 0)} />
              {currentPlayer && (
                <StatRow
                  label="Tu resultado"
                  value={playerResult(currentPlayer)}
                  tone={currentPlayer.status === "won" ? "success" : currentPlayer.status === "lost" ? "danger" : "default"}
                />
              )}
            </div>

            <button
              onClick={handleJoin}
              disabled={!canJoin}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              <HandCoins className="w-4 h-4" />
              {buttonLabel}
            </button>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-xs font-semibold text-destructive">
                {error}
              </div>
            )}
            {lastResult && (
              <div className="rounded-md border border-primary/30 bg-primary/10 p-3 text-xs font-semibold text-primary">
                {lastResult}
              </div>
            )}
          </aside>

          <section className="card-surface p-6 relative overflow-hidden min-h-[400px] flex flex-col">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-4">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-[11px] uppercase tracking-widest font-bold text-primary mb-3">
                  <Radio className="w-3.5 h-3.5" /> En vivo
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  {snapshot?.config.tableName ?? "Crash en vivo"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {snapshot?.config.liveMessage ?? "Sincronizando mesa..."}
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap md:justify-end md:max-w-[46%]">
                {snapshot?.history.map((value, index) => (
                  <span
                    key={`${value}-${index}`}
                    className={`text-[11px] font-mono font-bold px-2 py-1 rounded-md border ${
                      value >= 2
                        ? "bg-primary/10 text-primary border-primary/25"
                        : "bg-destructive/10 text-destructive border-destructive/25"
                    }`}
                  >
                    {formatMultiplier(value)}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-1 grid place-items-center relative min-h-[280px]">
              <CrashCurve multiplier={displayMultiplier} phase={snapshot?.phase ?? "betting"} />
              <div className="relative text-center">
                <div
                  className={`font-display font-bold tabular-nums leading-none transition-colors ${multiplierColor}`}
                  style={{ fontSize: "clamp(3.6rem, 11vw, 7rem)" }}
                >
                  {formatDecimal(displayMultiplier)}<span className="text-4xl md:text-5xl">x</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    {snapshot?.phase === "betting" && `Empieza en ${formatCountdown(countdownMs)}`}
                    {snapshot?.phase === "running" && "Multiplicador activo"}
                    {snapshot?.phase === "crashed" && snapshot.crashAt && `Rompió en ${formatMultiplier(snapshot.crashAt)}`}
                    {snapshot?.phase === "paused" && "Mesa pausada"}
                    {!snapshot && "Conectando"}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-5">
          <LivePlayers players={snapshot?.players ?? []} currentUsername={player?.username ?? null} />
          <LiveEvents events={snapshot?.events ?? []} />
        </div>
      </div>
    </AppShell>
  );
}

function playerResult(player: CrashPlayer) {
  if (player.status === "won") return `+${formatCurrency(player.profit)}`;
  if (player.status === "lost") return `-${formatCurrency(player.bet)}`;
  if (player.status === "active") return `${formatMultiplier(player.target)} activo`;
  return `${formatMultiplier(player.target)} espera`;
}

function statusLabel(status: CrashPlayer["status"]) {
  if (status === "waiting") return "Esperando";
  if (status === "active") return "Activo";
  if (status === "won") return "Gano";
  return "Perdio";
}

function statusClasses(status: CrashPlayer["status"]) {
  if (status === "won") return "bg-primary/10 text-primary border-primary/25";
  if (status === "lost") return "bg-destructive/10 text-destructive border-destructive/25";
  if (status === "active") return "bg-accent/10 text-accent border-accent/25";
  return "bg-surface-hi text-muted-foreground border-border";
}

function LivePlayers({ players, currentUsername }: { players: CrashPlayer[]; currentUsername: string | null }) {
  return (
    <section className="card-surface p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h2 className="font-display font-bold">Jugadores en vivo</h2>
        </div>
        <span className="font-mono text-xs text-muted-foreground">{players.length}</span>
      </div>

      {players.length === 0 ? (
        <div className="rounded-md border border-border bg-surface p-6 text-center text-sm text-muted-foreground">
          Nadie entro todavia.
        </div>
      ) : (
        <div className="space-y-2">
          {players.map((p) => {
            const mine = currentUsername?.toLowerCase() === p.username.toLowerCase();
            return (
              <div key={p.id} className="rounded-md border border-border bg-surface p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-hi border border-border grid place-items-center text-[11px] font-bold">
                  {p.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="text-sm font-semibold truncate">@{p.username}</p>
                    {mine && <span className="text-[10px] uppercase tracking-widest text-primary font-bold">Tu</span>}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {formatCurrency(p.bet)} / {formatMultiplier(p.target)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-flex px-2 py-1 rounded-md border text-[11px] font-bold ${statusClasses(p.status)}`}>
                    {statusLabel(p.status)}
                  </span>
                  {(p.status === "won" || p.status === "lost") && (
                    <p className={`font-mono text-xs mt-1 ${moneyClass(p.profit)}`}>
                      {p.profit > 0 ? "+" : ""}{formatCurrency(p.profit)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function LiveEvents({ events }: { events: CrashEvent[] }) {
  return (
    <section className="card-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Radio className="w-4 h-4 text-primary" />
        <h2 className="font-display font-bold">Actividad</h2>
      </div>

      {events.length === 0 ? (
        <div className="rounded-md border border-border bg-surface p-6 text-center text-sm text-muted-foreground">
          Sin actividad reciente.
        </div>
      ) : (
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {events.slice(0, 14).map((event) => {
            const Icon = event.type === "win" ? Trophy : event.type === "loss" ? XCircle : Radio;
            const tone = event.type === "win"
              ? "text-primary"
              : event.type === "loss"
                ? "text-destructive"
                : "text-muted-foreground";
            return (
              <div key={event.id} className="rounded-md border border-border bg-surface p-3 flex gap-3">
                <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${tone}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug">{event.message}</p>
                  <p className="text-[11px] text-muted-foreground font-mono mt-1">
                    {new Date(event.at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function CrashCurve({ multiplier, phase }: { multiplier: number; phase: CrashPhase }) {
  const width = 800;
  const height = 320;
  const progress = Math.min(1, Math.log(Math.max(1.01, multiplier)) / Math.log(8));
  const points: string[] = [];
  const steps = 48;

  for (let i = 0; i <= steps; i += 1) {
    const fraction = (i / steps) * progress;
    const x = fraction * width;
    const curveMultiplier = Math.pow(8, fraction);
    const denominator = Math.max(0.01, multiplier - 1);
    const y = height - ((curveMultiplier - 1) / denominator) * height * progress;
    points.push(`${x.toFixed(1)},${Math.max(0, Math.min(height, y)).toFixed(1)}`);
  }

  const path = `M0,${height} L${points.join(" L")}`;
  const color = phase === "crashed" ? "var(--color-destructive)" : "var(--color-primary)";
  const endX = progress * width;
  const endY = height - height * progress * 0.98;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 w-full h-full opacity-90" preserveAspectRatio="none">
      <defs>
        <linearGradient id="crashFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((fraction) => (
        <line key={fraction} x1="0" x2={width} y1={height * fraction} y2={height * fraction} stroke="currentColor" strokeOpacity="0.07" />
      ))}
      {[0.25, 0.5, 0.75].map((fraction) => (
        <line key={`v-${fraction}`} y1="0" y2={height} x1={width * fraction} x2={width * fraction} stroke="currentColor" strokeOpacity="0.05" />
      ))}
      <path d={`${path} L${endX.toFixed(1)},${height} L0,${height} Z`} fill="url(#crashFill)" />
      <path d={path} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={endX} cy={Math.max(8, Math.min(height - 8, endY))} r="6" fill={color} />
    </svg>
  );
}

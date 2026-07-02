import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAdmin } from "@/lib/admin";
import { ADMIN_PASSWORD } from "@/lib/adminConstants";
import { usePlayer } from "@/lib/player";
import { adjustPlayerBalance, listPlayers, setPlayerBalance, setUserVerified, subscribeRegistry, type RegistryEntry } from "@/lib/playerRegistry";
import { formatCurrency } from "@/lib/balance";
import { formatMultiplier, parseLocaleNumber } from "@/lib/format";
import { getCrashSnapshot, updateCrashAdmin, type CrashAdminPatch, type CrashSnapshot } from "@/lib/crashRealtime";
import { ShieldCheck, Sparkles, Lock, Search, Plus, Minus, Users, Radio, Save, Pause, PlayCircle, Zap, CheckCircle, XCircle } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — ArguPlay" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { isAdmin, authorized, passwordError, verifyPassword, alwaysWin, setAlwaysWin } = useAdmin();
  const { player } = usePlayer();
  const [pw, setPw] = useState("");

  if (!isAdmin) {
    return (
      <AppShell>
        <div className="max-w-sm mx-auto card-surface p-6 mt-8 text-center">
          <div className="w-9 h-9 rounded-lg bg-surface-hi grid place-items-center border border-border mx-auto mb-4">
            <Lock className="w-4 h-4 text-primary" />
          </div>
          <h1 className="font-display text-xl font-black mb-2">Solo para admin</h1>
          <p className="text-sm text-muted-foreground">
            El panel de admin está reservado a la cuenta dueña de este sitio. Si eres tú, entra
            con ese usuario desde la pantalla de inicio de sesión.
          </p>
          <Link to="/" className="btn-primary inline-flex mt-4 px-4 py-2 text-sm">
            Volver al inicio
          </Link>
        </div>
      </AppShell>
    );
  }

  if (!authorized) {
    return (
      <AppShell>
        <div className="max-w-sm mx-auto card-surface p-6 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-surface-hi grid place-items-center border border-border">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-black">Admin</h1>
              <p className="text-xs text-muted-foreground">@{player?.username}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Ingresa la contraseña de admin para desbloquear el panel.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verifyPassword(pw);
              setPw("");
            }}
            className="space-y-3"
          >
            <input
              type="password"
              autoFocus
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Contraseña"
              className="w-full bg-input rounded-md px-3 py-2.5 border border-border focus:border-primary outline-none font-mono text-sm"
            />
            {passwordError && <p className="text-xs text-destructive">Contraseña incorrecta.</p>}
            <button type="submit" className="btn-primary w-full py-2.5">
              Desbloquear
            </button>
          </form>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="card-surface p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/15 grid place-items-center border border-primary/40">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-xl font-black">Panel de admin</h1>
              <p className="text-xs text-muted-foreground">Sesión de @{player?.username}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="font-bold">Ganar siempre (God mode)</h2>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Mines nunca coloca una bomba donde haces clic. Towers siempre elige la casilla
                segura. Crash ahora se controla desde la mesa en vivo de abajo.
              </p>
            </div>
            <button
              onClick={() => setAlwaysWin(!alwaysWin)}
              className={`shrink-0 w-12 h-6 rounded-full transition-colors relative ${
                alwaysWin ? "bg-primary" : "bg-surface-hi border border-border"
              }`}
              aria-pressed={alwaysWin}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-background transition-all ${
                  alwaysWin ? "left-6" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {alwaysWin && (
            <p className="mt-3 text-xs">
              <span className="font-bold text-primary">God mode activado.</span>{" "}
              Verás una insignia junto a tu saldo mientras juegas.
            </p>
          )}
        </div>

        <CrashLiveManager />

        <PlayerBalanceManager />

        <div className="flex gap-2">
          <Link to="/mines" className="btn-primary px-4 py-2 text-sm flex-1 text-center">
            A jugar →
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function CrashLiveManager() {
  const { player } = usePlayer();
  const [snapshot, setSnapshot] = useState<CrashSnapshot | null>(null);
  const [draft, setDraft] = useState({
    tableName: "Crash en vivo",
    liveMessage: "",
    bettingSeconds: "8",
    breakSeconds: "4",
    growthRate: "0.09",
    nextCrashAt: "",
  });
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    if (!snapshot || dirty) return;
    setDraft({
      tableName: snapshot.config.tableName,
      liveMessage: snapshot.config.liveMessage,
      bettingSeconds: String(snapshot.config.bettingSeconds),
      breakSeconds: String(snapshot.config.breakSeconds),
      growthRate: String(snapshot.config.growthRate),
      nextCrashAt: snapshot.config.nextCrashAt ? String(snapshot.config.nextCrashAt) : "",
    });
  }, [snapshot, dirty]);

  const setField = (field: keyof typeof draft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setDirty(true);
  };

  const applyPatch = async (patch: CrashAdminPatch) => {
    if (!player) return;
    setSaving(true);
    setError(null);
    try {
      const next = await updateCrashAdmin({
        data: {
          admin: { username: player.username, password: ADMIN_PASSWORD },
          patch,
        },
      });
      setSnapshot(next);
      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar Crash.");
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = () => {
    const patch: CrashAdminPatch = {
      tableName: draft.tableName,
      liveMessage: draft.liveMessage,
      bettingSeconds: Number(draft.bettingSeconds),
      breakSeconds: Number(draft.breakSeconds),
      growthRate: Number(draft.growthRate),
    };
    const nextCrash = Number(draft.nextCrashAt);
    if (draft.nextCrashAt.trim() && Number.isFinite(nextCrash)) {
      patch.nextCrashAt = nextCrash;
    }
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

  return (
    <div className="card-surface p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-primary" />
            <h2 className="font-display font-black">Crash en tiempo real</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Estado: {snapshot ? snapshot.phase : "sincronizando"} - Ronda #{snapshot?.roundId ?? "-"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => applyPatch(snapshot?.phase === "paused" ? { startNext: true } : { pause: true })}
            className="btn-ghost px-3 py-2 text-xs font-semibold inline-flex items-center gap-2"
          >
            {snapshot?.phase === "paused" ? <PlayCircle className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            {snapshot?.phase === "paused" ? "Reanudar" : "Pausar"}
          </button>
          <button
            type="button"
            disabled={saving || snapshot?.phase !== "running"}
            onClick={() => applyPatch({ crashNow: true })}
            className="btn-ghost px-3 py-2 text-xs font-semibold inline-flex items-center gap-2 text-destructive"
          >
            <Zap className="w-3.5 h-3.5" />
            Romper ahora
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <label className="space-y-1.5">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Nombre de mesa</span>
          <input
            value={draft.tableName}
            onChange={(e) => setField("tableName", e.target.value)}
            className="w-full bg-input rounded-md px-3 py-2 border border-border focus:border-primary outline-none text-sm"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Mensaje en vivo</span>
          <input
            value={draft.liveMessage}
            onChange={(e) => setField("liveMessage", e.target.value)}
            className="w-full bg-input rounded-md px-3 py-2 border border-border focus:border-primary outline-none text-sm"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Apuestas abiertas</span>
          <input
            type="number"
            min="3"
            max="30"
            value={draft.bettingSeconds}
            onChange={(e) => setField("bettingSeconds", e.target.value)}
            className="w-full bg-input rounded-md px-3 py-2 border border-border focus:border-primary outline-none font-mono text-sm"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Pausa entre rondas</span>
          <input
            type="number"
            min="2"
            max="15"
            value={draft.breakSeconds}
            onChange={(e) => setField("breakSeconds", e.target.value)}
            className="w-full bg-input rounded-md px-3 py-2 border border-border focus:border-primary outline-none font-mono text-sm"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Velocidad</span>
          <input
            type="number"
            min="0.04"
            max="0.2"
            step="0.005"
            value={draft.growthRate}
            onChange={(e) => setField("growthRate", e.target.value)}
            className="w-full bg-input rounded-md px-3 py-2 border border-border focus:border-primary outline-none font-mono text-sm"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Proximo crash</span>
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              step="0.01"
              value={draft.nextCrashAt}
              onChange={(e) => setField("nextCrashAt", e.target.value)}
              placeholder="Aleatorio"
              className="min-w-0 flex-1 bg-input rounded-md px-3 py-2 border border-border focus:border-primary outline-none font-mono text-sm"
            />
            <button type="button" disabled={saving} onClick={setNextCrash} className="btn-ghost px-3 text-xs font-semibold">
              Fijar
            </button>
          </div>
        </label>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          type="button"
          disabled={saving || !dirty}
          onClick={saveSettings}
          className="btn-primary px-4 py-2 text-sm inline-flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar cambios
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => applyPatch({ startNext: true })}
          className="btn-ghost px-4 py-2 text-sm inline-flex items-center gap-2"
        >
          <PlayCircle className="w-4 h-4" />
          Nueva ronda
        </button>
        <button
          type="button"
          disabled={saving || !snapshot?.config.nextCrashAt}
          onClick={() => {
            setField("nextCrashAt", "");
            applyPatch({ clearNextCrash: true });
          }}
          className="btn-ghost px-4 py-2 text-sm"
        >
          Aleatorio
        </button>
      </div>

      {snapshot?.config.nextCrashAt && (
        <p className="mt-3 text-xs font-mono text-primary">
          Próxima ronda fijada en {formatMultiplier(snapshot.config.nextCrashAt)}.
        </p>
      )}
      {error && <p className="mt-3 text-xs font-semibold text-destructive">{error}</p>}
    </div>
  );
}
function PlayerBalanceManager() {
  const [players, setPlayers] = useState<Array<{ username: string } & RegistryEntry>>([]);
  const [query, setQuery] = useState("");
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  useEffect(() => {
    const refresh = async () => setPlayers(await listPlayers());
    void refresh();
    const interval = window.setInterval(() => void refresh(), 5000);
    const unsub = subscribeRegistry(() => void refresh());
    return () => {
      window.clearInterval(interval);
      unsub();
    };
  }, []);

  const filtered = players.filter((p) =>
    p.username.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const getAmount = (username: string) => parseLocaleNumber(amounts[username] ?? "");

  return (
    <div className="card-surface p-6">
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-4 h-4 text-primary" />
        <h2 className="font-display font-black">Usuarios y saldos</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Verifica cuentas nuevas y gestiona el saldo de cada jugador. Los datos se guardan
        permanentemente en el servidor.
      </p>

      <div className="flex items-center gap-2 bg-input rounded-md px-3 border border-border focus-within:border-primary transition-colors mb-4">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar usuario…"
          className="flex-1 bg-transparent py-2.5 text-sm outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          {players.length === 0 ? "Todavía nadie se ha registrado." : "Sin resultados."}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <div key={p.username} className="rounded-lg border border-border bg-surface p-3 flex flex-wrap items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-hi border-2 border-accent grid place-items-center text-[10px] font-bold">
                {p.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 mr-auto">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold truncate">@{p.username}</p>
                  {p.verified ? (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-primary bg-primary/10 border border-primary/30 rounded px-1.5 py-0.5">
                      <CheckCircle className="w-3 h-3" /> Verificado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 rounded px-1.5 py-0.5">
                      <XCircle className="w-3 h-3" /> Pendiente
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-muted-foreground">{formatCurrency(p.balance)}</p>
              </div>

              <button
                title={p.verified ? "Revocar verificación" : "Verificar usuario"}
                onClick={() => void setUserVerified(p.username, !p.verified)}
                className={`btn-ghost px-2.5 h-8 text-xs font-semibold ${p.verified ? "text-destructive" : "text-primary"}`}
              >
                {p.verified ? "Revocar" : "Verificar"}
              </button>

              <input
                type="text"
                inputMode="decimal"
                value={amounts[p.username] ?? ""}
                onChange={(e) =>
                  setAmounts((a) => ({
                    ...a,
                    [p.username]: e.target.value.replace(/[^0-9.,]/g, ""),
                  }))
                }
                placeholder="0,00"
                className="w-24 bg-input rounded-md px-2 py-1.5 border border-border focus:border-primary outline-none font-mono text-xs text-right"
              />
              <button
                title="Agregar"
                onClick={() => void adjustPlayerBalance(p.username, getAmount(p.username))}
                className="btn-ghost w-8 h-8 grid place-items-center text-primary"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                title="Quitar"
                onClick={() => void adjustPlayerBalance(p.username, -getAmount(p.username))}
                className="btn-ghost w-8 h-8 grid place-items-center text-destructive"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                title="Fijar saldo exacto"
                onClick={() => void setPlayerBalance(p.username, getAmount(p.username))}
                className="btn-ghost px-2.5 h-8 text-xs font-semibold"
              >
                Fijar
              </button>
              <button
                title="Resetear a 0"
                onClick={() => void setPlayerBalance(p.username, 0)}
                className="btn-ghost px-2.5 h-8 text-xs font-semibold"
              >
                0
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



import { useState, type ReactNode } from "react";
import { usePlayer } from "@/lib/player";
import { Loader2, ArrowRight, ShieldCheck, UserPlus, LogIn } from "lucide-react";

type AuthMode = "login" | "register";

export function AuthGate({ children }: { children: ReactNode }) {
  const { player, ready, loading, error, login, register } = usePlayer();
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  if (!ready) return null;

  if (player) {
    if (!player.verified) {
      return (
        <div className="min-h-screen grid place-items-center px-4 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
          <div className="relative w-full max-w-sm card-surface p-6 md:p-8 glow-accent text-center">
            <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-4" />
            <h1 className="font-display text-xl font-bold mb-2">Cuenta pendiente de verificación</h1>
            <p className="text-sm text-muted-foreground">
              Tu cuenta <strong>@{player.username}</strong> fue creada correctamente. Un administrador
              debe verificarla antes de que puedas jugar.
            </p>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm card-surface p-6 md:p-8 glow-accent">
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src="/logo.png"
            alt="ArguPlay Casino"
            className="h-24 w-24 rounded-xl object-cover ring-2 ring-primary/40 shadow-lg"
          />
          <h1 className="font-display text-2xl font-bold mt-4 tracking-wide">
            Argu<span className="text-primary">Play</span> Casino
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "login" ? "Inicia sesión para jugar" : "Crea tu cuenta para empezar"}
          </p>
        </div>

        <div className="flex gap-1 mb-4 p-1 rounded-lg bg-surface border border-border">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors inline-flex items-center justify-center gap-1.5 ${
              mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Entrar
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-colors inline-flex items-center justify-center gap-1.5 ${
              mode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Registrarse
          </button>
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!username.trim() || !password || loading) return;
            if (mode === "login") {
              await login(username, password);
            } else {
              await register(username, password, displayName.trim() || undefined);
            }
          }}
          className="space-y-3"
        >
          {mode === "register" && (
            <>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Nombre para mostrar
              </label>
              <input
                type="text"
                value={displayName}
                disabled={loading}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Opcional"
                className="w-full bg-input rounded-md px-3 py-2.5 border border-border focus:border-primary outline-none text-sm disabled:opacity-60"
              />
            </>
          )}

          <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Usuario
          </label>
          <div className="flex items-center gap-2 bg-input rounded-md px-3 border border-border focus-within:border-primary transition-colors">
            <span className="text-muted-foreground text-sm">@</span>
            <input
              type="text"
              autoFocus
              value={username}
              disabled={loading}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="tu_usuario"
              className="flex-1 bg-transparent py-2.5 text-sm outline-none disabled:opacity-60"
            />
          </div>

          <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-input rounded-md px-3 py-2.5 border border-border focus:border-primary outline-none text-sm disabled:opacity-60"
          />

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Procesando…
              </>
            ) : (
              <>
                {mode === "login" ? "Entrar" : "Crear cuenta"} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 flex items-start gap-2 text-[11px] text-muted-foreground border-t border-border pt-4">
          <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
          <p>
            Tus datos y saldo se guardan de forma segura en el servidor. Las cuentas nuevas requieren
            verificación del administrador antes de jugar.
          </p>
        </div>
      </div>
    </div>
  );
}

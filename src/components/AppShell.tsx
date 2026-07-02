import { Link, useRouterState } from "@tanstack/react-router";
import { useBalance, formatCurrency } from "@/lib/balance";
import { useAdmin } from "@/lib/admin";
import { usePlayer } from "@/lib/player";
import { Bomb, Layers3, TrendingUp, RotateCcw, Coins, ShieldCheck, Sparkles, LogOut } from "lucide-react";

const nav = [
  { to: "/mines", label: "Mines", icon: Bomb },
  { to: "/towers", label: "Towers", icon: Layers3 },
  { to: "/crash", label: "Crash", icon: TrendingUp },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { balance, reset } = useBalance();
  const { isAdmin, alwaysWin } = useAdmin();
  const { player, logout } = usePlayer();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/90 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="ArguPlay Casino"
              className="h-10 w-10 rounded-md object-cover shadow-sm group-hover:scale-105 transition-transform ring-1 ring-primary/30"
            />
            <span className="font-display font-bold text-lg tracking-wide">
              Argu<span className="text-primary">Play</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => {
              const active = pathname === n.to;
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    active ? "bg-surface-hi text-primary" : "text-muted-foreground hover:text-foreground hover:bg-surface"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {alwaysWin && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-primary border border-primary/50 bg-primary/10 rounded px-2 py-1">
                <Sparkles className="w-3 h-3" /> God mode
              </span>
            )}
            <div className="flex items-center gap-2 card-surface px-3 py-2" title="Saldo">
              <Coins className="w-4 h-4 text-primary" />
              <span className="font-mono font-bold text-sm tabular-nums">{formatCurrency(balance)}</span>
            </div>
            {isAdmin && (
              <Link
                to="/admin"
                title="Admin panel"
                className={`btn-ghost px-2.5 py-2 text-xs flex items-center gap-1 ${alwaysWin ? "text-primary border-primary/40" : ""}`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
              </Link>
            )}
            <button
              onClick={reset}
              title="Reset balance"
              className="btn-ghost px-2.5 py-2 text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            {player && (
              <div className="flex items-center gap-2 card-surface pl-1.5 pr-2 py-1">
                <div className="w-8 h-8 rounded-full bg-surface-hi border-2 border-accent grid place-items-center text-[10px] font-bold">
                  {player.username.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-semibold max-w-[110px] truncate">
                  {player.displayName || player.username}
                </span>
                <button
                  onClick={logout}
                  title="Cambiar de usuario"
                  className="btn-ghost w-6 h-6 grid place-items-center"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className="md:hidden flex items-center gap-1 px-4 pb-3 overflow-x-auto">
          {nav.map((n) => {
            const active = pathname === n.to;
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${
                  active ? "bg-surface-hi text-primary" : "text-muted-foreground hover:text-foreground hover:bg-surface"
                }`}
              >
                <Icon className="w-4 h-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>

      <footer className="mt-16 border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ArguPlay Casino · Mines, Towers y Crash</span>
          <span>Proyecto de fans, sin afiliación con marcas de terceros.</span>
        </div>
      </footer>
    </div>
  );
}

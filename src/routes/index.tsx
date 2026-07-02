import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Bomb, Layers3, TrendingUp, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

const games = [
  {
    to: "/mines" as const,
    name: "Mines",
    tag: "Classic",
    desc: "Revela gemas, evita las minas. Retira cuando quieras.",
    icon: Bomb,
    accent: "from-emerald-400/20 to-primary/10",
  },
  {
    to: "/towers" as const,
    name: "Towers",
    tag: "Skill",
    desc: "Escala casilla a casilla. Elige la casilla segura en cada nivel.",
    icon: Layers3,
    accent: "from-violet-400/20 to-accent/10",
  },
  {
    to: "/crash" as const,
    name: "Crash",
    tag: "Live",
    desc: "Mira subir el multiplicador — retira antes del crash.",
    icon: TrendingUp,
    accent: "from-rose-400/20 to-destructive/10",
  },
];

function Home() {
  return (
    <AppShell>
      <section className="relative overflow-hidden card-surface p-6 md:p-10 mb-8 glow-primary">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-accent/15 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <img
            src="/logo.png"
            alt="ArguPlay Casino"
            className="h-28 w-28 md:h-36 md:w-36 rounded-2xl object-cover ring-2 ring-primary/40 shadow-xl shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Casino online
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight max-w-2xl">
              Juega en <span className="text-primary">ArguPlay Casino</span>
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Mines, Towers y Crash con la misma emoción, animaciones y mecánicas clásicas.
              Crea tu cuenta o inicia sesión para empezar a jugar.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/mines" className="btn-primary px-5 py-2.5 inline-flex items-center gap-2">
                Empezar con Mines <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/crash" className="btn-ghost px-5 py-2.5 inline-flex items-center gap-2">
                Probar Crash
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((g) => {
          const Icon = g.icon;
          return (
            <Link
              key={g.to}
              to={g.to}
              className="group card-surface p-5 relative overflow-hidden transition-transform hover:-translate-y-0.5"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${g.accent} opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-lg bg-surface-hi grid place-items-center border border-border">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground border border-border rounded px-2 py-0.5">
                    {g.tag}
                  </span>
                </div>
                <h3 className="font-display text-xl font-bold">{g.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{g.desc}</p>
                <div className="mt-4 text-sm font-semibold text-primary inline-flex items-center gap-1">
                  Jugar <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}

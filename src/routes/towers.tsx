import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BetControls, StatRow } from "@/components/GameUI";
import { useBalance, formatCurrency } from "@/lib/balance";
import { formatMultiplier } from "@/lib/format";
import { useAdmin } from "@/lib/admin";
import { Bomb, Gem, Play, HandCoins, RotateCw } from "lucide-react";

export const Route = createFileRoute("/towers")({
  head: () => ({
    meta: [
      { title: "Towers | ArguPlay Casino" },
      { name: "description", content: "Juega Towers en ArguPlay Casino. Escala la torre casilla a casilla." },
    ],
  }),
  component: TowersPage,
});

const LEVELS = 8;

type Difficulty = "easy" | "medium" | "hard";
const CFG: Record<Difficulty, { cols: number; bombs: number }> = {
  easy:   { cols: 3, bombs: 1 },
  medium: { cols: 3, bombs: 2 },
  hard:   { cols: 2, bombs: 1 },
};

function mult(diff: Difficulty, level: number) {
  const { cols, bombs } = CFG[diff];
  const safe = cols - bombs;
  const p = safe / cols; // prob per level
  return +(0.97 * Math.pow(1 / p, level)).toFixed(2);
}

type Row = {
  bombs: number[]; // indices that are bombs
  picked: number | null;
  revealed: boolean;
  lost: boolean;
};

function buildTower(diff: Difficulty): Row[] {
  const { cols, bombs } = CFG[diff];
  return Array.from({ length: LEVELS }, () => {
    const idxs = Array.from({ length: cols }, (_, i) => i);
    for (let i = idxs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idxs[i], idxs[j]] = [idxs[j], idxs[i]];
    }
    return { bombs: idxs.slice(0, bombs), picked: null, revealed: false, lost: false };
  });
}

function TowersPage() {
  const { balance, add } = useBalance();
  const { alwaysWin } = useAdmin();
  const [bet, setBet] = useState(10);
  const [diff, setDiff] = useState<Difficulty>("medium");
  const [rows, setRows] = useState<Row[]>(() => buildTower("medium"));
  const [playing, setPlaying] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [ended, setEnded] = useState<null | "won" | "lost" | "cashed">(null);
  const [lastWin, setLastWin] = useState<number | null>(null);

  const cols = CFG[diff].cols;
  const curMult = currentLevel > 0 ? mult(diff, currentLevel) : 1;
  const nextMult = mult(diff, currentLevel + 1);
  const cashout = +(bet * curMult).toFixed(2);

  function start() {
    if (playing || bet <= 0 || bet > balance) return;
    add(-bet);
    setRows(buildTower(diff));
    setCurrentLevel(0);
    setPlaying(true);
    setEnded(null);
    setLastWin(null);
  }

  function pick(rowIdx: number, colIdx: number) {
    if (!playing) return;
    if (rowIdx !== LEVELS - 1 - currentLevel) return; // only active row (bottom-up)
    const next = rows.slice();
    const row = { ...next[rowIdx] };
    row.picked = colIdx;
    row.revealed = true;
    let isBomb = row.bombs.includes(colIdx);

    // God mode: quietly relocate the bomb off the clicked tile.
    if (isBomb && alwaysWin) {
      const safeSpots: number[] = [];
      for (let c = 0; c < cols; c++) if (c !== colIdx && !row.bombs.includes(c)) safeSpots.push(c);
      if (safeSpots.length > 0) {
        const swap = safeSpots[Math.floor(Math.random() * safeSpots.length)];
        row.bombs = row.bombs.filter((b) => b !== colIdx).concat(swap);
        isBomb = false;
      }
    }

    row.lost = isBomb;
    next[rowIdx] = row;

    if (isBomb) {
      // reveal all remaining
      for (let i = 0; i < next.length; i++) {
        if (!next[i].revealed) next[i] = { ...next[i], revealed: true };
      }
      setRows(next);
      setPlaying(false);
      setEnded("lost");
      setLastWin(-bet);
    } else {
      const newLevel = currentLevel + 1;
      setRows(next);
      setCurrentLevel(newLevel);
      if (newLevel === LEVELS) {
        const win = +(bet * mult(diff, LEVELS)).toFixed(2);
        add(win);
        setPlaying(false);
        setEnded("won");
        setLastWin(win - bet);
      }
    }
  }

  function cashOut() {
    if (!playing || currentLevel === 0) return;
    add(cashout);
    // reveal remaining
    const next = rows.slice();
    for (let i = 0; i < next.length; i++) {
      if (!next[i].revealed) next[i] = { ...next[i], revealed: true };
    }
    setRows(next);
    setPlaying(false);
    setEnded("cashed");
    setLastWin(cashout - bet);
  }

  function resetTower() {
    setRows(buildTower(diff));
    setCurrentLevel(0);
    setEnded(null);
    setLastWin(null);
  }

  const multipliers = useMemo(
    () => Array.from({ length: LEVELS }, (_, i) => mult(diff, i + 1)),
    [diff],
  );

  return (
    <AppShell>
      <div className="grid lg:grid-cols-[320px_1fr] gap-5">
        <aside className="space-y-4">
          <BetControls bet={bet} setBet={setBet} disabled={playing} />

          <div className="card-surface p-4 space-y-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(CFG) as Difficulty[]).map((d) => (
                <button
                  key={d}
                  disabled={playing}
                  onClick={() => { setDiff(d); setRows(buildTower(d)); setEnded(null); }}
                  className={`py-2 text-xs font-bold rounded-md border transition-colors capitalize ${
                    diff === d ? "bg-primary/20 border-primary text-primary" : "bg-surface border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground pt-1">
              {CFG[diff].cols} tiles per row · {CFG[diff].bombs} bomb{CFG[diff].bombs > 1 ? "s" : ""}
            </p>
          </div>

          <div className="card-surface p-4 space-y-2">
            <StatRow label="Current" value={`× ${formatMultiplier(curMult)}`} tone="success" />
            <StatRow label="Next level" value={`× ${formatMultiplier(nextMult)}`} />
            <StatRow label="Cash out" value={formatCurrency(cashout)} tone="success" />
            {lastWin !== null && (
              <StatRow
                label="Last round"
                value={`${lastWin >= 0 ? "+" : ""}${formatCurrency(lastWin)}`}
                tone={lastWin >= 0 ? "success" : "danger"}
              />
            )}
          </div>

          {!playing ? (
            <button
              onClick={start}
              disabled={bet <= 0 || bet > balance}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" /> Bet {formatCurrency(bet)}
            </button>
          ) : (
            <button
              onClick={cashOut}
              disabled={currentLevel === 0}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 animate-pulse-glow"
            >
              <HandCoins className="w-4 h-4" /> Cash out {formatCurrency(cashout)}
            </button>
          )}
        </aside>

        <section className="">
          <div className="card-surface p-4 md:p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-display text-2xl font-black">Towers</h1>
              {ended && (
                <button onClick={resetTower} className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" /> New round
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              {rows.map((row, rIdx) => {
                const level = LEVELS - rIdx; // displayed level number (top = 8)
                const activeRowIdx = playing ? LEVELS - 1 - currentLevel : -1;
                const isActive = rIdx === activeRowIdx;
                const isPast = playing && rIdx > activeRowIdx;
                return (
                  <div key={rIdx} className="flex items-center gap-3">
                    <div className={`w-14 text-right font-mono text-xs tabular-nums ${
                      isActive ? "text-primary font-bold" : "text-muted-foreground"
                    }`}>
                      × {formatMultiplier(multipliers[level - 1])}
                    </div>
                    <div
                      className="grid gap-1.5 flex-1"
                      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                    >
                      {Array.from({ length: cols }).map((_, cIdx) => {
                        const isPicked = row.picked === cIdx;
                        const isBomb = row.bombs.includes(cIdx);
                        const revealed = row.revealed;
                        return (
                          <button
                            key={cIdx}
                            onClick={() => pick(rIdx, cIdx)}
                            disabled={!isActive}
                            className={`h-11 md:h-12 rounded-md border transition-all grid place-items-center
                              ${revealed
                                ? isPicked
                                  ? isBomb
                                    ? "bg-destructive/20 border-destructive glow-destructive animate-shake"
                                    : "bg-primary/15 border-primary glow-primary"
                                  : isBomb
                                    ? "bg-destructive/10 border-destructive/40 opacity-60"
                                    : "bg-surface border-border/60 opacity-40"
                                : isActive
                                  ? "bg-surface-hi border-primary/40 hover:bg-surface hover:border-primary hover:-translate-y-0.5"
                                  : isPast
                                    ? "bg-surface border-border opacity-40"
                                    : "bg-surface-hi border-border opacity-70"
                              }
                            `}
                          >
                            {revealed ? (
                              isBomb ? (
                                <Bomb className={`w-4 h-4 ${isPicked ? "text-destructive animate-pop" : "text-destructive/50"}`} />
                              ) : isPicked ? (
                                <Gem className="w-4 h-4 text-primary animate-pop" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-border" />
                              )
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-border/60" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {ended && (
              <div className={`mt-5 text-center font-display font-black text-lg ${
                ended === "lost" ? "text-destructive" : "text-primary"
              }`}>
                {ended === "lost" && "Busted."}
                {ended === "cashed" && `Cashed out +${formatCurrency((lastWin ?? 0))}`}
                {ended === "won" && `Top of the tower! +${formatCurrency((lastWin ?? 0))}`}
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

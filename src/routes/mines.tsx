import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { BetControls, StatRow, StepButton } from "@/components/GameUI";
import { useBalance, formatCurrency } from "@/lib/balance";
import { formatMultiplier } from "@/lib/format";
import { useAdmin } from "@/lib/admin";
import { Bomb, Gem, Play, HandCoins, RotateCw } from "lucide-react";

export const Route = createFileRoute("/mines")({
  head: () => ({
    meta: [
      { title: "Mines | ArguPlay Casino" },
      { name: "description", content: "Juega Mines en ArguPlay Casino. Revela gemas, evita las bombas y retira cuando quieras." },
    ],
  }),
  component: MinesPage,
});

const SIZE = 5;
const TOTAL = SIZE * SIZE;

// Mines multiplier — approximated formula matching the classic bloxflip/stake curve.
// house edge ~4%, m(picks) = 0.96 * C(N, picks) / C(N-mines, picks)
function comb(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}
function multiplier(mines: number, picks: number) {
  if (picks <= 0) return 1;
  return 0.96 * (comb(TOTAL, picks) / comb(TOTAL - mines, picks));
}

type Cell = { revealed: boolean; isMine: boolean; lost?: boolean };

function newBoard(): Cell[] {
  return Array.from({ length: TOTAL }, () => ({ revealed: false, isMine: false }));
}

function pickMines(mines: number): Set<number> {
  const set = new Set<number>();
  while (set.size < mines) set.add(Math.floor(Math.random() * TOTAL));
  return set;
}

function MinesPage() {
  const { balance, add } = useBalance();
  const { alwaysWin } = useAdmin();
  const [bet, setBet] = useState(10);
  const [mines, setMines] = useState(3);
  const [board, setBoard] = useState<Cell[]>(newBoard);
  const [minePositions, setMinePositions] = useState<Set<number>>(new Set());
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState<null | "won" | "lost" | "cashed">(null);
  const [lastWin, setLastWin] = useState<number | null>(null);

  const picks = board.filter((c) => c.revealed && !c.isMine).length;
  const curMult = useMemo(() => multiplier(mines, picks), [mines, picks]);
  const nextMult = useMemo(() => multiplier(mines, picks + 1), [mines, picks]);
  const cashout = +(bet * curMult).toFixed(2);

  function start() {
    if (playing || bet <= 0 || bet > balance) return;
    add(-bet);
    setMinePositions(pickMines(mines));
    setBoard(newBoard());
    setPlaying(true);
    setEnded(null);
    setLastWin(null);
  }

  function reveal(i: number) {
    if (!playing || board[i].revealed) return;
    let mp = minePositions;
    let isMine = mp.has(i);

    // God mode: silently relocate the mine to an unrevealed non-clicked tile.
    if (isMine && alwaysWin) {
      const candidates: number[] = [];
      for (let k = 0; k < TOTAL; k++) {
        if (k !== i && !board[k].revealed && !mp.has(k)) candidates.push(k);
      }
      if (candidates.length > 0) {
        const swap = candidates[Math.floor(Math.random() * candidates.length)];
        mp = new Set(mp);
        mp.delete(i);
        mp.add(swap);
        setMinePositions(mp);
        isMine = false;
      }
    }

    const next = board.slice();
    next[i] = { revealed: true, isMine, lost: isMine };
    if (isMine) {
      mp.forEach((mi) => {
        if (!next[mi].revealed) next[mi] = { revealed: true, isMine: true };
      });
      setBoard(next);
      setPlaying(false);
      setEnded("lost");
      setLastWin(-bet);
    } else {
      setBoard(next);
      const newPicks = next.filter((c) => c.revealed && !c.isMine).length;
      if (newPicks === TOTAL - mines) {
        const win = +(bet * multiplier(mines, newPicks)).toFixed(2);
        add(win);
        setPlaying(false);
        setEnded("won");
        setLastWin(win - bet);
      }
    }
  }

  function cashOut() {
    if (!playing || picks === 0) return;
    add(cashout);
    // reveal remaining mines for effect
    const next = board.slice();
    minePositions.forEach((mi) => {
      if (!next[mi].revealed) next[mi] = { revealed: true, isMine: true };
    });
    setBoard(next);
    setPlaying(false);
    setEnded("cashed");
    setLastWin(cashout - bet);
  }

  function resetBoard() {
    setBoard(newBoard());
    setMinePositions(new Set());
    setEnded(null);
    setLastWin(null);
  }

  return (
    <AppShell>
      <div className="grid lg:grid-cols-[320px_1fr] gap-5">
        {/* Sidebar */}
        <aside className="space-y-4">
          <BetControls bet={bet} setBet={setBet} disabled={playing} />

          <div className="card-surface p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Mines
              </label>
              <span className="font-mono font-bold text-sm">{mines}</span>
            </div>
            <div className="flex items-center gap-2">
              <StepButton dir="down" onClick={() => setMines((m) => Math.max(1, m - 1))} disabled={playing} />
              <input
                type="range"
                min={1}
                max={24}
                value={mines}
                disabled={playing}
                onChange={(e) => setMines(parseInt(e.target.value))}
                className="flex-1 accent-primary"
              />
              <StepButton dir="up" onClick={() => setMines((m) => Math.min(24, m + 1))} disabled={playing} />
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 3, 5, 10].map((n) => (
                <button
                  key={n}
                  disabled={playing}
                  onClick={() => setMines(n)}
                  className={`py-1.5 text-xs font-bold rounded-md border transition-colors ${
                    mines === n ? "bg-primary/20 border-primary text-primary" : "bg-surface border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="card-surface p-4 space-y-2">
            <StatRow label="Current" value={`× ${formatMultiplier(curMult)}`} tone="success" />
            <StatRow label="Next tile" value={`× ${formatMultiplier(nextMult)}`} />
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
              disabled={picks === 0}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 animate-pulse-glow"
            >
              <HandCoins className="w-4 h-4" /> Cash out {formatCurrency(cashout)}
            </button>
          )}
        </aside>

        {/* Board */}
        <section className="">
          <div className="card-surface p-4 md:p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-display text-2xl font-black">Mines</h1>
              {ended && (
                <button onClick={resetBoard} className="btn-ghost px-3 py-1.5 text-xs flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" /> New round
                </button>
              )}
            </div>

            <div className="grid grid-cols-5 gap-2 md:gap-3 aspect-square max-w-[560px] mx-auto">
              {board.map((c, i) => {
                const isLost = c.lost;
                return (
                  <button
                    key={i}
                    onClick={() => reveal(i)}
                    disabled={!playing || c.revealed}
                    className={`relative rounded-lg border transition-all duration-200 grid place-items-center overflow-hidden
                      ${c.revealed
                        ? c.isMine
                          ? `bg-destructive/15 border-destructive/60 ${isLost ? "glow-destructive animate-shake" : ""}`
                          : "bg-primary/10 border-primary/50 glow-primary"
                        : "bg-surface-hi border-border hover:bg-surface hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0"}
                      ${!playing && !c.revealed ? "opacity-70" : ""}
                    `}
                  >
                    {c.revealed ? (
                      c.isMine ? (
                        <Bomb className="w-6 h-6 md:w-8 md:h-8 text-destructive animate-pop" />
                      ) : (
                        <Gem className="w-6 h-6 md:w-8 md:h-8 text-primary animate-pop" />
                      )
                    ) : (
                      <div className="w-4 h-4 rounded-sm bg-border/60" />
                    )}
                  </button>
                );
              })}
            </div>

            {ended && (
              <div className={`mt-5 text-center font-display font-black text-lg ${
                ended === "lost" ? "text-destructive" : "text-primary"
              }`}>
                {ended === "lost" && "Busted."}
                {ended === "cashed" && `Cashed out +${formatCurrency((lastWin ?? 0))}`}
                {ended === "won" && `Perfect clear! +${formatCurrency((lastWin ?? 0))}`}
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

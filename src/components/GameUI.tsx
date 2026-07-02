import { useState } from "react";
import { Coins, Minus, Plus, X } from "lucide-react";
import { useBalance, formatCurrency } from "@/lib/balance";
import { formatMultiplier } from "@/lib/format";

type Props = {
  bet: number;
  setBet: (n: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
};

export function BetControls({ bet, setBet, disabled, min = 1, max = 10000 }: Props) {
  const { balance } = useBalance();
  const [text, setText] = useState(String(bet));

  const commit = (n: number) => {
    const clamped = Math.max(min, Math.min(max, Math.min(balance || max, Math.round(n * 100) / 100)));
    setBet(clamped);
    setText(String(clamped));
  };

  return (
    <div className="card-surface p-4 space-y-3">
      <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
        Bet Amount
      </label>
      <div className="flex items-stretch gap-2">
        <div className="flex-1 flex items-center gap-2 bg-input rounded-md px-3 border border-border focus-within:border-primary transition-colors">
          <Coins className="w-4 h-4 text-primary" />
          <input
            type="text"
            inputMode="decimal"
            value={text}
            disabled={disabled}
            onChange={(e) => setText(e.target.value.replace(/[^0-9.]/g, ""))}
            onBlur={() => {
              const n = parseFloat(text);
              commit(Number.isFinite(n) ? n : min);
            }}
            className="flex-1 bg-transparent py-2 font-mono font-bold text-sm tabular-nums outline-none disabled:opacity-60"
          />
          <span className="text-[10px] text-muted-foreground">/ {formatCurrency(balance)}</span>
        </div>
        <button disabled={disabled} onClick={() => commit(bet / 2)} className="btn-ghost px-3 text-sm font-bold">½</button>
        <button disabled={disabled} onClick={() => commit(bet * 2)} className="btn-ghost px-3 text-sm font-bold">2×</button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[10, 50, 100, "MAX"].map((v) => (
          <button
            key={String(v)}
            disabled={disabled}
            onClick={() => commit(v === "MAX" ? balance : (v as number))}
            className="btn-ghost py-1.5 text-xs font-semibold"
          >
            {v === "MAX" ? "MAX" : `+${v}`}
          </button>
        ))}
      </div>
    </div>
  );
}

export function StatRow({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "success" | "danger" }) {
  const color = tone === "success" ? "text-primary" : tone === "danger" ? "text-destructive" : "text-foreground";
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-md bg-surface">
      <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</span>
      <span className={`font-mono font-bold text-sm tabular-nums ${color}`}>{value}</span>
    </div>
  );
}

export function MultiplierBadge({ x }: { x: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 font-mono font-bold text-primary">
      <X className="w-3 h-3" />
      {formatMultiplier(x)}
    </span>
  );
}

export function StepButton({ dir, onClick, disabled }: { dir: "up" | "down"; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} className="btn-ghost w-8 h-8 grid place-items-center">
      {dir === "up" ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
    </button>
  );
}

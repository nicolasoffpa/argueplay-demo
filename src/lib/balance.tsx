import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePlayer } from "./player";
import {
  adjustPlayerBalance,
  getPlayerBalance,
  setPlayerBalance,
  subscribeRegistry,
  upsertPlayer,
} from "./playerRegistry";

type BalanceCtx = {
  balance: number;
  set: (n: number) => void;
  add: (n: number) => void;
  reset: () => void;
};

const Ctx = createContext<BalanceCtx | null>(null);

export { CURRENCY, formatCurrency, formatInteger, formatInteger as formatPyg, formatInteger as formatR } from "./format";

export function BalanceProvider({ children }: { children: ReactNode }) {
  const { player } = usePlayer();
  const [balance, setBalanceState] = useState(0);

  useEffect(() => {
    if (!player) {
      setBalanceState(0);
      return;
    }
    let cancelled = false;
    (async () => {
      const entry = await upsertPlayer(player.username, {
        displayName: player.displayName,
      });
      if (!cancelled) setBalanceState(entry.balance);
    })();
    return () => {
      cancelled = true;
    };
  }, [player?.username, player?.displayName]);

  useEffect(() => {
    if (!player) return;
    const refresh = async () => {
      const next = await getPlayerBalance(player.username);
      setBalanceState(next);
    };
    refresh();
    return subscribeRegistry(refresh);
  }, [player?.username]);

  const value: BalanceCtx = {
    balance,
    set: (n) => {
      if (!player) return;
      void setPlayerBalance(player.username, n).then((entry) => setBalanceState(entry.balance));
    },
    add: (n) => {
      if (!player) return;
      void adjustPlayerBalance(player.username, n).then((entry) => setBalanceState(entry.balance));
    },
    reset: () => {
      if (!player) return;
      void setPlayerBalance(player.username, 0).then((entry) => setBalanceState(entry.balance));
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBalance() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useBalance must be used inside BalanceProvider");
  return c;
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchUserProfile, loginAccount, registerAccount } from "./authServer";

export type Player = {
  username: string;
  displayName: string;
  verified: boolean;
};

type PlayerCtx = {
  player: Player | null;
  ready: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, displayName?: string) => Promise<boolean>;
  logout: () => void;
};

const Ctx = createContext<PlayerCtx | null>(null);
const KEY = "ap_player_session_v1";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persist = (profile: Player) => {
    setPlayer(profile);
    try {
      sessionStorage.setItem(KEY, JSON.stringify(profile));
    } catch {}
  };

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setPlayer(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!player) return;
    let cancelled = false;
    const refresh = async () => {
      try {
        const profile = await fetchUserProfile({ data: player.username });
        if (!cancelled) persist(profile);
      } catch {}
    };
    refresh();
    const interval = window.setInterval(refresh, 8000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [player?.username]);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const profile = await loginAccount({ data: { username, password } });
      persist(profile);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesión.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, password: string, displayName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const profile = await registerAccount({ data: { username, password, displayName } });
      persist(profile);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo registrar la cuenta.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setPlayer(null);
    try {
      sessionStorage.removeItem(KEY);
    } catch {}
  };

  return (
    <Ctx.Provider value={{ player, ready, loading, error, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePlayer() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePlayer must be used inside PlayerProvider");
  return c;
}

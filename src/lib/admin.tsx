import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePlayer } from "./player";
import { ADMIN_PASSWORD, ADMIN_USERNAME } from "./adminConstants";

type AdminCtx = {
  /** True if the signed-in account matches the owner's username. */
  isAdmin: boolean;
  /** True if isAdmin AND the admin password has been entered this session. */
  authorized: boolean;
  passwordError: boolean;
  verifyPassword: (pw: string) => boolean;
  alwaysWin: boolean;
  setAlwaysWin: (v: boolean) => void;
};

const Ctx = createContext<AdminCtx | null>(null);
const WIN_KEY = "ap_always_win_v1";
const PW_OK_KEY = "ap_admin_pw_ok_v1";

export function AdminProvider({ children }: { children: ReactNode }) {
  const { player } = usePlayer();
  const [alwaysWin, setAlwaysWinState] = useState(false);
  const [authorized, setAuthorizedState] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const isAdmin =
    !!player && player.username.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase();

  useEffect(() => {
    if (!isAdmin) {
      setAuthorizedState(false);
      return;
    }
    try {
      setAuthorizedState(sessionStorage.getItem(PW_OK_KEY) === "1");
    } catch {}
  }, [isAdmin]);

  useEffect(() => {
    try {
      setAlwaysWinState(isAdmin && localStorage.getItem(WIN_KEY) === "1");
    } catch {}
  }, [isAdmin]);

  const verifyPassword = (pw: string) => {
    if (!isAdmin) return false;
    if (pw === ADMIN_PASSWORD) {
      setAuthorizedState(true);
      setPasswordError(false);
      try {
        sessionStorage.setItem(PW_OK_KEY, "1");
      } catch {}
      return true;
    }
    setPasswordError(true);
    return false;
  };

  const authorizedFinal = isAdmin && authorized;

  const setAlwaysWin = (v: boolean) => {
    if (!authorizedFinal) return;
    setAlwaysWinState(v);
    try {
      localStorage.setItem(WIN_KEY, v ? "1" : "0");
    } catch {}
  };

  return (
    <Ctx.Provider
      value={{
        isAdmin,
        authorized: authorizedFinal,
        passwordError,
        verifyPassword,
        alwaysWin: authorizedFinal && alwaysWin,
        setAlwaysWin,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAdmin() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAdmin must be used inside AdminProvider");
  return c;
}

import {
  adjustPlayerBalanceServer,
  fetchPlayerBalance,
  fetchPlayersList,
  setPlayerBalanceServer,
  setUserVerifiedServer,
  upsertPlayerServer,
  type RegistryEntry,
} from "./playersServer";

export type { RegistryEntry };

export type Registry = Record<string, RegistryEntry>;

const EVENT = "ap-registry-changed";

function notifyChange() {
  try {
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {}
}

export async function upsertPlayer(
  username: string,
  patch: Partial<Pick<RegistryEntry, "displayName">>,
): Promise<RegistryEntry> {
  const entry = await upsertPlayerServer({ data: { username, ...patch } });
  notifyChange();
  return entry;
}

export async function getPlayerBalance(username: string): Promise<number> {
  return fetchPlayerBalance({ data: username });
}

export async function setPlayerBalance(username: string, balance: number): Promise<RegistryEntry> {
  const entry = await setPlayerBalanceServer({ data: { username, balance } });
  notifyChange();
  return entry;
}

export async function adjustPlayerBalance(username: string, delta: number): Promise<RegistryEntry> {
  const entry = await adjustPlayerBalanceServer({ data: { username, delta } });
  notifyChange();
  return entry;
}

export async function setUserVerified(username: string, verified: boolean): Promise<RegistryEntry> {
  const entry = await setUserVerifiedServer({ data: { username, verified } });
  notifyChange();
  return entry;
}

export async function listPlayers(): Promise<Array<{ username: string } & RegistryEntry>> {
  return fetchPlayersList();
}

export function subscribeRegistry(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

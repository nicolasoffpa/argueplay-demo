import { createServerFn } from "@tanstack/react-start";
import {
  adjustEntryBalance,
  getEntryBalance,
  listEntries,
  readRegistry,
  setEntryBalance,
  setUserVerified,
  upsertEntry,
  type RegistryEntry,
} from "./playersStore";

export type { RegistryEntry };

export const fetchPlayersRegistry = createServerFn({ method: "GET" }).handler(() => readRegistry());

export const fetchPlayersList = createServerFn({ method: "GET" }).handler(() => listEntries());

export const fetchPlayerBalance = createServerFn({ method: "GET" })
  .validator((username: string) => username)
  .handler(({ data: username }) => getEntryBalance(username));

export const upsertPlayerServer = createServerFn({ method: "POST" })
  .validator((input: { username: string; displayName?: string }) => input)
  .handler(({ data }) =>
    upsertEntry(data.username, {
      displayName: data.displayName,
    }),
  );

export const setPlayerBalanceServer = createServerFn({ method: "POST" })
  .validator((input: { username: string; balance: number }) => input)
  .handler(({ data }) => setEntryBalance(data.username, data.balance));

export const adjustPlayerBalanceServer = createServerFn({ method: "POST" })
  .validator((input: { username: string; delta: number }) => input)
  .handler(({ data }) => adjustEntryBalance(data.username, data.delta));

export const setUserVerifiedServer = createServerFn({ method: "POST" })
  .validator((input: { username: string; verified: boolean }) => input)
  .handler(({ data }) => setUserVerified(data.username, data.verified));

import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { ADMIN_USERNAME } from "./adminConstants";

export type StoredUser = {
  username: string;
  passwordHash: string;
  displayName: string;
  balance: number;
  verified: boolean;
  createdAt: string;
};

export type PublicUser = {
  username: string;
  displayName: string;
  balance: number;
  verified: boolean;
};

export type RegistryEntry = {
  displayName: string;
  balance: number;
  verified: boolean;
};

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

type UsersFile = {
  users: Record<string, StoredUser>;
};

let cache: UsersFile | null = null;
let writeQueue: Promise<void> = Promise.resolve();

function normalizeKey(username: string) {
  return username.trim().toLowerCase();
}

function validateUsername(username: string) {
  const trimmed = username.trim();
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(trimmed)) {
    throw new Error("El usuario debe tener entre 3 y 20 caracteres (letras, números o _).");
  }
  return trimmed;
}

function validatePassword(password: string) {
  if (password.length < 4) {
    throw new Error("La contraseña debe tener al menos 4 caracteres.");
  }
  return password;
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  try {
    const hashBuf = Buffer.from(hash, "hex");
    const testBuf = scryptSync(password, salt, 64);
    return timingSafeEqual(hashBuf, testBuf);
  } catch {
    return false;
  }
}

function roundBalance(balance: number) {
  return Math.max(0, Math.round(balance * 100) / 100);
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function loadUsersFile(): Promise<UsersFile> {
  if (cache) return cache;
  await ensureDataDir();
  try {
    const raw = await fs.readFile(USERS_FILE, "utf8");
    cache = JSON.parse(raw) as UsersFile;
  } catch {
    cache = { users: {} };
    await persistUsersFile(cache);
  }
  return cache;
}

function persistUsersFile(data: UsersFile): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    await ensureDataDir();
    await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2), "utf8");
  });
  return writeQueue;
}

function toPublic(user: StoredUser): PublicUser {
  return {
    username: user.username,
    displayName: user.displayName,
    balance: user.balance,
    verified: user.verified,
  };
}

function toRegistryEntry(user: StoredUser): RegistryEntry {
  return {
    displayName: user.displayName,
    balance: user.balance,
    verified: user.verified,
  };
}

export async function registerUser(input: {
  username: string;
  password: string;
  displayName?: string;
}): Promise<PublicUser> {
  const username = validateUsername(input.username);
  const password = validatePassword(input.password);
  const key = normalizeKey(username);
  const data = await loadUsersFile();

  if (data.users[key]) {
    throw new Error("Ese usuario ya está registrado.");
  }

  const isAdmin = key === ADMIN_USERNAME.toLowerCase();
  const user: StoredUser = {
    username,
    passwordHash: hashPassword(password),
    displayName: input.displayName?.trim() || username,
    balance: 0,
    verified: isAdmin,
    createdAt: new Date().toISOString(),
  };

  data.users[key] = user;
  await persistUsersFile(data);
  return toPublic(user);
}

export async function loginUser(input: {
  username: string;
  password: string;
}): Promise<PublicUser> {
  const key = normalizeKey(input.username);
  const data = await loadUsersFile();
  const user = data.users[key];

  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    throw new Error("Usuario o contraseña incorrectos.");
  }

  return toPublic(user);
}

export async function readRegistry(): Promise<Record<string, RegistryEntry>> {
  const data = await loadUsersFile();
  const registry: Record<string, RegistryEntry> = {};
  for (const [key, user] of Object.entries(data.users)) {
    registry[key] = toRegistryEntry(user);
  }
  return registry;
}

export async function upsertEntry(
  username: string,
  patch: Partial<Pick<RegistryEntry, "displayName">>,
): Promise<RegistryEntry> {
  const key = normalizeKey(username);
  const data = await loadUsersFile();
  const existing = data.users[key];

  if (!existing) {
    throw new Error("Usuario no encontrado.");
  }

  if (patch.displayName) {
    existing.displayName = patch.displayName;
  }

  data.users[key] = existing;
  await persistUsersFile(data);
  return toRegistryEntry(existing);
}

export async function getEntryBalance(username: string): Promise<number> {
  const data = await loadUsersFile();
  return data.users[normalizeKey(username)]?.balance ?? 0;
}

export async function setEntryBalance(username: string, balance: number): Promise<RegistryEntry> {
  const key = normalizeKey(username);
  const data = await loadUsersFile();
  const existing = data.users[key];

  if (!existing) {
    throw new Error("Usuario no encontrado.");
  }

  existing.balance = roundBalance(balance);
  data.users[key] = existing;
  await persistUsersFile(data);
  return toRegistryEntry(existing);
}

export async function adjustEntryBalance(username: string, delta: number): Promise<RegistryEntry> {
  const current = await getEntryBalance(username);
  return setEntryBalance(username, current + delta);
}

export async function setUserVerified(username: string, verified: boolean): Promise<RegistryEntry> {
  const key = normalizeKey(username);
  const data = await loadUsersFile();
  const existing = data.users[key];

  if (!existing) {
    throw new Error("Usuario no encontrado.");
  }

  existing.verified = verified;
  data.users[key] = existing;
  await persistUsersFile(data);
  return toRegistryEntry(existing);
}

export async function listEntries(): Promise<Array<{ username: string } & RegistryEntry>> {
  const data = await loadUsersFile();
  return Object.values(data.users)
    .map((user) => ({ username: user.username, ...toRegistryEntry(user) }))
    .sort((a, b) => a.username.localeCompare(b.username));
}

export async function getPublicUser(username: string): Promise<PublicUser | null> {
  const data = await loadUsersFile();
  const user = data.users[normalizeKey(username)];
  return user ? toPublic(user) : null;
}

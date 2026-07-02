import { n as ADMIN_USERNAME } from "./adminConstants-BcjzJZQo.mjs";
import processModule from "node:process";
import { Buffer } from "node:buffer";
import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/usersStore-BR6wADEf.js
var DATA_DIR = path.join(processModule.cwd(), "data");
var USERS_FILE = path.join(DATA_DIR, "users.json");
var cache = null;
var writeQueue = Promise.resolve();
function normalizeKey(username) {
	return username.trim().toLowerCase();
}
function validateUsername(username) {
	const trimmed = username.trim();
	if (!/^[a-zA-Z0-9_]{3,20}$/.test(trimmed)) throw new Error("El usuario debe tener entre 3 y 20 caracteres (letras, números o _).");
	return trimmed;
}
function validatePassword(password) {
	if (password.length < 4) throw new Error("La contraseña debe tener al menos 4 caracteres.");
	return password;
}
function hashPassword(password) {
	const salt = randomBytes(16).toString("hex");
	return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
function verifyPassword(password, stored) {
	const [salt, hash] = stored.split(":");
	if (!salt || !hash) return false;
	try {
		return timingSafeEqual(Buffer.from(hash, "hex"), scryptSync(password, salt, 64));
	} catch {
		return false;
	}
}
function roundBalance(balance) {
	return Math.max(0, Math.round(balance * 100) / 100);
}
async function ensureDataDir() {
	await fs.mkdir(DATA_DIR, { recursive: true });
}
async function loadUsersFile() {
	if (cache) return cache;
	await ensureDataDir();
	try {
		const raw = await fs.readFile(USERS_FILE, "utf8");
		cache = JSON.parse(raw);
	} catch {
		cache = { users: {} };
		await persistUsersFile(cache);
	}
	return cache;
}
function persistUsersFile(data) {
	writeQueue = writeQueue.then(async () => {
		await ensureDataDir();
		await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2), "utf8");
	});
	return writeQueue;
}
function toPublic(user) {
	return {
		username: user.username,
		displayName: user.displayName,
		balance: user.balance,
		verified: user.verified
	};
}
function toRegistryEntry(user) {
	return {
		displayName: user.displayName,
		balance: user.balance,
		verified: user.verified
	};
}
async function registerUser(input) {
	const username = validateUsername(input.username);
	const password = validatePassword(input.password);
	const key = normalizeKey(username);
	const data = await loadUsersFile();
	if (data.users[key]) throw new Error("Ese usuario ya está registrado.");
	const isAdmin = key === ADMIN_USERNAME.toLowerCase();
	const user = {
		username,
		passwordHash: hashPassword(password),
		displayName: input.displayName?.trim() || username,
		balance: 0,
		verified: isAdmin,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	data.users[key] = user;
	await persistUsersFile(data);
	return toPublic(user);
}
async function loginUser(input) {
	const key = normalizeKey(input.username);
	const user = (await loadUsersFile()).users[key];
	if (!user || !verifyPassword(input.password, user.passwordHash)) throw new Error("Usuario o contraseña incorrectos.");
	return toPublic(user);
}
async function readRegistry() {
	const data = await loadUsersFile();
	const registry = {};
	for (const [key, user] of Object.entries(data.users)) registry[key] = toRegistryEntry(user);
	return registry;
}
async function upsertEntry(username, patch) {
	const key = normalizeKey(username);
	const data = await loadUsersFile();
	const existing = data.users[key];
	if (!existing) throw new Error("Usuario no encontrado.");
	if (patch.displayName) existing.displayName = patch.displayName;
	data.users[key] = existing;
	await persistUsersFile(data);
	return toRegistryEntry(existing);
}
async function getEntryBalance(username) {
	return (await loadUsersFile()).users[normalizeKey(username)]?.balance ?? 0;
}
async function setEntryBalance(username, balance) {
	const key = normalizeKey(username);
	const data = await loadUsersFile();
	const existing = data.users[key];
	if (!existing) throw new Error("Usuario no encontrado.");
	existing.balance = roundBalance(balance);
	data.users[key] = existing;
	await persistUsersFile(data);
	return toRegistryEntry(existing);
}
async function adjustEntryBalance(username, delta) {
	return setEntryBalance(username, await getEntryBalance(username) + delta);
}
async function setUserVerified(username, verified) {
	const key = normalizeKey(username);
	const data = await loadUsersFile();
	const existing = data.users[key];
	if (!existing) throw new Error("Usuario no encontrado.");
	existing.verified = verified;
	data.users[key] = existing;
	await persistUsersFile(data);
	return toRegistryEntry(existing);
}
async function listEntries() {
	const data = await loadUsersFile();
	return Object.values(data.users).map((user) => ({
		username: user.username,
		...toRegistryEntry(user)
	})).sort((a, b) => a.username.localeCompare(b.username));
}
async function getPublicUser(username) {
	const user = (await loadUsersFile()).users[normalizeKey(username)];
	return user ? toPublic(user) : null;
}
//#endregion
export { loginUser as a, setEntryBalance as c, listEntries as i, setUserVerified as l, getEntryBalance as n, readRegistry as o, getPublicUser as r, registerUser as s, adjustEntryBalance as t, upsertEntry as u };

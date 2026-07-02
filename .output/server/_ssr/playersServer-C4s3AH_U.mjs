import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { c as setEntryBalance, i as listEntries, l as setUserVerified, n as getEntryBalance, o as readRegistry, t as adjustEntryBalance, u as upsertEntry } from "./usersStore-BR6wADEf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/playersServer-C4s3AH_U.js
var fetchPlayersRegistry_createServerFn_handler = createServerRpc({
	id: "128e8a06800fb5a03cdd7dc6df93db8ff9a85fc7c8ccba64923a31dcb853ca4e",
	name: "fetchPlayersRegistry",
	filename: "src/lib/playersServer.ts"
}, (opts) => fetchPlayersRegistry.__executeServer(opts));
var fetchPlayersRegistry = createServerFn({ method: "GET" }).handler(fetchPlayersRegistry_createServerFn_handler, () => readRegistry());
var fetchPlayersList_createServerFn_handler = createServerRpc({
	id: "593021aebd9d9d1a49839b3b79af8251a1af24fd89675cd99e2f961c6e42c4e4",
	name: "fetchPlayersList",
	filename: "src/lib/playersServer.ts"
}, (opts) => fetchPlayersList.__executeServer(opts));
var fetchPlayersList = createServerFn({ method: "GET" }).handler(fetchPlayersList_createServerFn_handler, () => listEntries());
var fetchPlayerBalance_createServerFn_handler = createServerRpc({
	id: "f858deaa9bfecc7f3eaa52cfd19f0ea7879a7852027df517dce0fab5e052e8a9",
	name: "fetchPlayerBalance",
	filename: "src/lib/playersServer.ts"
}, (opts) => fetchPlayerBalance.__executeServer(opts));
var fetchPlayerBalance = createServerFn({ method: "GET" }).validator((username) => username).handler(fetchPlayerBalance_createServerFn_handler, ({ data: username }) => getEntryBalance(username));
var upsertPlayerServer_createServerFn_handler = createServerRpc({
	id: "0aaaa298252c3612b2ac8efb6a1398f83ad231720c8e7316e21ffa61cb268912",
	name: "upsertPlayerServer",
	filename: "src/lib/playersServer.ts"
}, (opts) => upsertPlayerServer.__executeServer(opts));
var upsertPlayerServer = createServerFn({ method: "POST" }).validator((input) => input).handler(upsertPlayerServer_createServerFn_handler, ({ data }) => upsertEntry(data.username, { displayName: data.displayName }));
var setPlayerBalanceServer_createServerFn_handler = createServerRpc({
	id: "7252171fc1034ee7dddcbea0793998399014e120e57b3507e2328ac323f9f5f5",
	name: "setPlayerBalanceServer",
	filename: "src/lib/playersServer.ts"
}, (opts) => setPlayerBalanceServer.__executeServer(opts));
var setPlayerBalanceServer = createServerFn({ method: "POST" }).validator((input) => input).handler(setPlayerBalanceServer_createServerFn_handler, ({ data }) => setEntryBalance(data.username, data.balance));
var adjustPlayerBalanceServer_createServerFn_handler = createServerRpc({
	id: "634646ecfe1ce43ca0f5fc4f39faf7f1ddab2a97965769a430b00c875ddb5722",
	name: "adjustPlayerBalanceServer",
	filename: "src/lib/playersServer.ts"
}, (opts) => adjustPlayerBalanceServer.__executeServer(opts));
var adjustPlayerBalanceServer = createServerFn({ method: "POST" }).validator((input) => input).handler(adjustPlayerBalanceServer_createServerFn_handler, ({ data }) => adjustEntryBalance(data.username, data.delta));
var setUserVerifiedServer_createServerFn_handler = createServerRpc({
	id: "57d819ef1afb4142378bdcec3cc7c91056b1651f660982cbf5cf45e4ba412e95",
	name: "setUserVerifiedServer",
	filename: "src/lib/playersServer.ts"
}, (opts) => setUserVerifiedServer.__executeServer(opts));
var setUserVerifiedServer = createServerFn({ method: "POST" }).validator((input) => input).handler(setUserVerifiedServer_createServerFn_handler, ({ data }) => setUserVerified(data.username, data.verified));
//#endregion
export { adjustPlayerBalanceServer_createServerFn_handler, fetchPlayerBalance_createServerFn_handler, fetchPlayersList_createServerFn_handler, fetchPlayersRegistry_createServerFn_handler, setPlayerBalanceServer_createServerFn_handler, setUserVerifiedServer_createServerFn_handler, upsertPlayerServer_createServerFn_handler };

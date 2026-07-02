//#region \0rolldown/runtime.js
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-boIEPa30.js
var manifest = {
	"0aaaa298252c3612b2ac8efb6a1398f83ad231720c8e7316e21ffa61cb268912": {
		functionName: "upsertPlayerServer_createServerFn_handler",
		importer: () => import("./_ssr/playersServer-C4s3AH_U.mjs")
	},
	"0eb17c358af37f8039ac0343a60cd16420dcc1edf7dc3de9f1c05a49577a840f": {
		functionName: "loginAccount_createServerFn_handler",
		importer: () => import("./_ssr/authServer-LiAVXI6R.mjs")
	},
	"128e8a06800fb5a03cdd7dc6df93db8ff9a85fc7c8ccba64923a31dcb853ca4e": {
		functionName: "fetchPlayersRegistry_createServerFn_handler",
		importer: () => import("./_ssr/playersServer-C4s3AH_U.mjs")
	},
	"2d13a9a93b1deec59c96f78b5a8dccbac37297d8cc888ce412ba3363c185e1c1": {
		functionName: "getCrashSnapshot_createServerFn_handler",
		importer: () => import("./_ssr/crashRealtime-CR5ogO0u.mjs")
	},
	"4ececefb58b95a70bff8cf8a01bb10da823eb9cb70e8c06786489b18ca549a55": {
		functionName: "updateCrashAdmin_createServerFn_handler",
		importer: () => import("./_ssr/crashRealtime-CR5ogO0u.mjs")
	},
	"57d819ef1afb4142378bdcec3cc7c91056b1651f660982cbf5cf45e4ba412e95": {
		functionName: "setUserVerifiedServer_createServerFn_handler",
		importer: () => import("./_ssr/playersServer-C4s3AH_U.mjs")
	},
	"593021aebd9d9d1a49839b3b79af8251a1af24fd89675cd99e2f961c6e42c4e4": {
		functionName: "fetchPlayersList_createServerFn_handler",
		importer: () => import("./_ssr/playersServer-C4s3AH_U.mjs")
	},
	"634646ecfe1ce43ca0f5fc4f39faf7f1ddab2a97965769a430b00c875ddb5722": {
		functionName: "adjustPlayerBalanceServer_createServerFn_handler",
		importer: () => import("./_ssr/playersServer-C4s3AH_U.mjs")
	},
	"7252171fc1034ee7dddcbea0793998399014e120e57b3507e2328ac323f9f5f5": {
		functionName: "setPlayerBalanceServer_createServerFn_handler",
		importer: () => import("./_ssr/playersServer-C4s3AH_U.mjs")
	},
	"7cfdbe25ba60cac962ba7ee61532e61d0d4293c1943fbea952bd888bd9462dac": {
		functionName: "registerAccount_createServerFn_handler",
		importer: () => import("./_ssr/authServer-LiAVXI6R.mjs")
	},
	"cd91789d93128e43fd68214cb810d273a01dd8556f0711e1d8f22298c34e093c": {
		functionName: "fetchUserProfile_createServerFn_handler",
		importer: () => import("./_ssr/authServer-LiAVXI6R.mjs")
	},
	"db6e751b03b587ab94290735be624c54350c416921622cbd7612c05615e1debd": {
		functionName: "joinCrashRound_createServerFn_handler",
		importer: () => import("./_ssr/crashRealtime-CR5ogO0u.mjs")
	},
	"f858deaa9bfecc7f3eaa52cfd19f0ea7879a7852027df517dce0fab5e052e8a9": {
		functionName: "fetchPlayerBalance_createServerFn_handler",
		importer: () => import("./_ssr/playersServer-C4s3AH_U.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { __commonJSMin as n, __toESM as r, getServerFnById as t };

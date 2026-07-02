import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { a as createSsrRpc } from "./admin-B7GAjUKz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crashRealtime-O623N9wW.js
var getCrashSnapshot = createServerFn({ method: "GET" }).handler(createSsrRpc("2d13a9a93b1deec59c96f78b5a8dccbac37297d8cc888ce412ba3363c185e1c1"));
var joinCrashRound = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("db6e751b03b587ab94290735be624c54350c416921622cbd7612c05615e1debd"));
var updateCrashAdmin = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("4ececefb58b95a70bff8cf8a01bb10da823eb9cb70e8c06786489b18ca549a55"));
//#endregion
export { joinCrashRound as n, updateCrashAdmin as r, getCrashSnapshot as t };

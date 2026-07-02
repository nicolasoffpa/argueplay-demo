import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
import { a as loginUser, r as getPublicUser, s as registerUser } from "./usersStore-BR6wADEf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/authServer-LiAVXI6R.js
var registerAccount_createServerFn_handler = createServerRpc({
	id: "7cfdbe25ba60cac962ba7ee61532e61d0d4293c1943fbea952bd888bd9462dac",
	name: "registerAccount",
	filename: "src/lib/authServer.ts"
}, (opts) => registerAccount.__executeServer(opts));
var registerAccount = createServerFn({ method: "POST" }).validator((input) => input).handler(registerAccount_createServerFn_handler, ({ data }) => registerUser(data));
var loginAccount_createServerFn_handler = createServerRpc({
	id: "0eb17c358af37f8039ac0343a60cd16420dcc1edf7dc3de9f1c05a49577a840f",
	name: "loginAccount",
	filename: "src/lib/authServer.ts"
}, (opts) => loginAccount.__executeServer(opts));
var loginAccount = createServerFn({ method: "POST" }).validator((input) => input).handler(loginAccount_createServerFn_handler, ({ data }) => loginUser(data));
var fetchUserProfile_createServerFn_handler = createServerRpc({
	id: "cd91789d93128e43fd68214cb810d273a01dd8556f0711e1d8f22298c34e093c",
	name: "fetchUserProfile",
	filename: "src/lib/authServer.ts"
}, (opts) => fetchUserProfile.__executeServer(opts));
var fetchUserProfile = createServerFn({ method: "GET" }).validator((username) => username).handler(fetchUserProfile_createServerFn_handler, async ({ data: username }) => {
	const user = await getPublicUser(username);
	if (!user) throw new Error("Usuario no encontrado.");
	return user;
});
//#endregion
export { fetchUserProfile_createServerFn_handler, loginAccount_createServerFn_handler, registerAccount_createServerFn_handler };

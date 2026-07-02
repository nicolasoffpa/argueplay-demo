import { createServerFn } from "@tanstack/react-start";
import { getPublicUser, loginUser, registerUser } from "./usersStore";

export const registerAccount = createServerFn({ method: "POST" })
  .validator(
    (input: { username: string; password: string; displayName?: string }) => input,
  )
  .handler(({ data }) => registerUser(data));

export const loginAccount = createServerFn({ method: "POST" })
  .validator((input: { username: string; password: string }) => input)
  .handler(({ data }) => loginUser(data));

export const fetchUserProfile = createServerFn({ method: "GET" })
  .validator((username: string) => username)
  .handler(async ({ data: username }) => {
    const user = await getPublicUser(username);
    if (!user) throw new Error("Usuario no encontrado.");
    return user;
  });

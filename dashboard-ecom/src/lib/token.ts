"use server";

import { cookies } from "next/headers";

export const getToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) return null;
  return token.value;
};

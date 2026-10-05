"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ActionResponseType } from "../../types/actions-response";

/**
 * The dashboard has no user accounts. It is unlocked with the same ADMIN_KEY
 * that protects the admin routes on the Express API, and the key is kept in an
 * httpOnly cookie so it never reaches the browser JavaScript.
 */
export async function login(
  prevState: unknown,
  formData: FormData,
): Promise<ActionResponseType> {
  const adminKey = String(formData.get("adminKey") ?? "").trim();

  if (!adminKey) {
    return {
      success: false,
      message: "Enter the admin key",
    };
  }

  const res = await fetch(`${process.env.API_URL}/analytics/overview?days=7`, {
    headers: { Authorization: `Bearer ${adminKey}` },
    cache: "no-store",
  });

  if (res.status === 401) {
    return {
      success: false,
      message: "That admin key was rejected",
    };
  }

  if (!res.ok) {
    return {
      success: false,
      message: "The shop API is not reachable. Start the backend and try again.",
    };
  }

  (await cookies()).set("token", adminKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return {
    success: true,
    message: "Signed in",
  };
}

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
};
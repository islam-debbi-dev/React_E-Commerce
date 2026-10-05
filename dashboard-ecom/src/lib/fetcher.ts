"use server";

import { redirect } from "next/navigation";
import { getToken } from "./token";

const BASE_URL = process.env.API_URL;

const fetcher = async (url: string) => {
  const token = await getToken();

  const response = await fetch(`${BASE_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
  });

  if (response.status === 401) {
    // The admin key changed or the session expired.
    redirect("/login");
  }

  const res = await response.json();

  if (!response.ok) {
    throw new Error(res.error || res.message || "Failed to fetch data");
  }

  return res;
};

export default fetcher;
"use server";

import { getToken } from "@/lib/token";
import type { ActionResponseType } from "@/types/actions-response";

const IGNORED_FIELDS = new Set(["productId"]);

/**
 * The admin key lives in an httpOnly cookie, so every write has to be proxied
 * through a server action. Only non-empty fields are forwarded: the API reads a
 * missing field as "leave it alone", which keeps PATCH requests minimal.
 */
const toApiFormData = (formData: FormData) => {
  const payload = new FormData();

  formData.forEach((value, key) => {
    if (IGNORED_FIELDS.has(key)) return;

    if (typeof value === "string") {
      if (value.trim() !== "") payload.append(key, value);
      return;
    }

    if (value instanceof File && value.size > 0) {
      payload.append(key, value, value.name);
    }
  });

  return payload;
};

const send = async (path: string, method: string, formData: FormData) => {
  const adminKey = await getToken();

  if (!adminKey) {
    return {
      success: false,
      message: "Your session expired. Sign in again.",
    } satisfies ActionResponseType;
  }

  try {
    const response = await fetch(`${process.env.API_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${adminKey}`,
      },
      body: toApiFormData(formData),
      cache: "no-store",
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: result.error || result.message || "The product could not be saved",
      } satisfies ActionResponseType;
    }

    return {
      success: true,
      message: result.product?.title
        ? `"${result.product.title}" saved`
        : "Product deleted",
    } satisfies ActionResponseType;
  } catch {
    return {
      success: false,
      message: "The shop API is not reachable. Start the backend and try again.",
    } satisfies ActionResponseType;
  }
};

export async function createProductAction(
  prevState: unknown,
  formData: FormData,
): Promise<ActionResponseType> {
  return send("/products", "POST", formData);
}

export async function updateProductAction(
  prevState: unknown,
  formData: FormData,
): Promise<ActionResponseType> {
  const productId = String(formData.get("productId") ?? "").trim();

  if (!productId) {
    return {
      success: false,
      message: "Missing product id",
    } satisfies ActionResponseType;
  }

  return send(`/products/${productId}`, "PATCH", formData);
}

export async function deleteProductAction(
  productId: string,
): Promise<ActionResponseType> {
  const adminKey = await getToken();

  if (!adminKey) {
    return {
      success: false,
      message: "Your session expired. Sign in again.",
    } satisfies ActionResponseType;
  }

  try {
    const response = await fetch(`${process.env.API_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${adminKey}`,
      },
      cache: "no-store",
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: result.error || result.message || "The product could not be deleted",
      } satisfies ActionResponseType;
    }

    return {
      success: true,
      message: "Product deleted",
    } satisfies ActionResponseType;
  } catch {
    return {
      success: false,
      message: "The shop API is not reachable. Start the backend and try again.",
    } satisfies ActionResponseType;
  }
}
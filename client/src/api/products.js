const API_URL = import.meta.env.VITE_API_URL ?? "";

export const request = async (url, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      `Cannot reach the API at ${API_URL || window.location.origin}. Is the backend running (cd backend && npm run dev)?`
    );
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || `Request failed with status ${response.status}`);
  }

  return payload;
};

const toQuery = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : "";
};

export const getProducts = ({ q, search, ...rest } = {}) =>
  request(`/api/products${toQuery({ ...rest, search: search ?? q })}`);

export const getProduct = (id) => request(`/api/products/${id}`);

export const getProductsByCategory = (category, limit = 30) =>
  request(`/api/products${toQuery({ category, limit })}`);

export const getCategories = () => request("/api/categories");

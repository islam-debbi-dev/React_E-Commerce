const API_URL = process.env.REACT_APP_API_URL ?? "";
const ADMIN_KEY = process.env.REACT_APP_ADMIN_KEY ?? "";

export const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_URL}/api${path}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(ADMIN_KEY ? { "x-admin-key": ADMIN_KEY } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      `Cannot reach the API at ${API_URL || window.location.origin}/api. Is the backend running (cd backend && npm run dev)?`
    );
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || `Request failed with status ${response.status}`);
  }

  return payload;
};

export const getProducts = async () => {
  const data = await request("/products?limit=200");
  return data.products;
};

export const getProduct = async (id) => {
  const data = await request(`/products/${id}`);
  return data.product;
};

export const getProductsByCategory = async (category, limit = 11) => {
  const data = await request(
    `/products?category=${encodeURIComponent(category)}&limit=${limit}`
  );
  return data.products;
};

export const getCategories = async () => {
  const data = await request("/categories");
  return data.categories;
};

export const createProduct = async (product) => {
  const data = await request("/products", { method: "POST", body: product });
  return data.product;
};

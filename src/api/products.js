const BASE_URL = "https://dummyjson.com";

// Keeps the same shape the app already expects (image, rating.rate)
const normalize = (product) => ({
  ...product,
  image: product.thumbnail,
  rating: {
    rate: product.rating,
    count: product.reviews ? product.reviews.length : 0,
  },
});

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};

// limit=0 returns the full catalogue
export const getProducts = async () => {
  const data = await fetchJson(`${BASE_URL}/products?limit=0`);
  return data.products.map(normalize);
};

export const getProduct = async (id) => {
  const product = await fetchJson(`${BASE_URL}/products/${id}`);
  return normalize(product);
};

export const getProductsByCategory = async (category, limit = 10) => {
  const data = await fetchJson(
    `${BASE_URL}/products/category/${category}?limit=${limit}`
  );
  return data.products.map(normalize);
};

export const getCategories = async () => {
  return fetchJson(`${BASE_URL}/products/category-list`);
};

export const formatCategory = (category = "") =>
  category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

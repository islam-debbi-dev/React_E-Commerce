import "dotenv/config";

const required = (name, fallback = "") =>
  process.env[name] && process.env[name].trim() ? process.env[name].trim() : fallback;

const parseCloudinaryUrl = (value) => {
  if (!value) {
    return {};
  }
  try {
    const url = new URL(value);
    return {
      cloudName: url.hostname,
      apiKey: decodeURIComponent(url.username),
      apiSecret: decodeURIComponent(url.password),
    };
  } catch {
    throw new Error(`CLOUDINARY_URL is not a valid URL: ${value}`);
  }
};

export const config = {
  port: Number(required("PORT", "5001")),
  clientUrl: required("CLIENT_URL", "http://localhost:3000"),
  shopName: required("SHOP_NAME", "Ecommerce"),
  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/ecommerce"),
  shippingFlat: Number(required("SHIPPING_FLAT", "30")),
  currency: required("CURRENCY", "$"),
  adminKey: required("ADMIN_KEY"),
  telegram: {
    botToken: required("TELEGRAM_BOT_TOKEN"),
    chatId: required("TELEGRAM_CHAT_ID"),
    botUsername: required("TELEGRAM_BOT_USERNAME"),
  },
  whatsappNumber: required("WHATSAPP_NUMBER", "213676903083").replace(/[^\d]/g, ""),
  cloudinary: {
    url: required("CLOUDINARY_URL"),
    ...parseCloudinaryUrl(required("CLOUDINARY_URL")),
    ...(required("CLOUDINARY_CLOUD_NAME")
      ? {
          cloudName: required("CLOUDINARY_CLOUD_NAME"),
          apiKey: required("CLOUDINARY_API_KEY"),
          apiSecret: required("CLOUDINARY_API_SECRET"),
        }
      : {}),
  },
};

export const hasTelegram = () => Boolean(config.telegram.botToken && config.telegram.chatId);
export const hasCloudinary = () =>
  Boolean(
    config.cloudinary.url ||
      (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret)
  );

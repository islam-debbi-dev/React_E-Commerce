import { config, hasTelegram } from "../config/env.js";
import { buildOrderHtml, buildOrderText } from "./orderMessage.service.js";

const callTelegram = async (method, payload) => {
  const response = await fetch(
    `https://api.telegram.org/bot${config.telegram.botToken}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.description || `Telegram ${method} failed`);
  }
  return data.result;
};

export const sendOrderToTelegram = async (order) => {
  if (!hasTelegram()) {
    return {
      sent: false,
      error:
        "Telegram is not configured. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to backend/.env",
    };
  }

  try {
    await callTelegram("sendMessage", {
      chat_id: config.telegram.chatId,
      text: buildOrderText(order),
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
    return { sent: true, error: "", chatId: config.telegram.chatId };
  } catch (error) {
    return { sent: false, error: error.message, chatId: config.telegram.chatId };
  }
};

export const testTelegramConnection = () => hasTelegram();

import { config } from "../config/env.js";

const BASE = `https://api.telegram.org/bot${config.telegram.botToken}`;

const call = async (method, payload) => {
  const url = payload ? `${BASE}/${method}?${new URLSearchParams(payload)}` : `${BASE}/${method}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.description || "Telegram request failed");
  }
  return data.result;
};

const run = async () => {
  if (!config.telegram.botToken) {
    console.log(
      [
        "Telegram is not configured yet. Add to backend/.env:",
        "  TELEGRAM_BOT_TOKEN=123456789:AAH...   (from @BotFather -> /newbot)",
        "  TELEGRAM_CHAT_ID=123456789           (from getUpdates, see below)",
        "",
        "Then run: npm run telegram:check",
      ].join("\n")
    );
    return;
  }

  const me = await call("getMe");
  console.log(`bot: @${me.username} (${me.first_name})`);

  const updates = await call("getUpdates");
  const chats = new Map();
  for (const update of updates) {
    const chat = update.message?.chat ?? update.channel_post?.chat;
    if (chat) {
      chats.set(chat.id, chat.title ?? [chat.first_name, chat.last_name].filter(Boolean).join(" "));
    }
  }

  if (chats.size === 0) {
    console.log(
      [
        "No chats found yet:",
        `  1. open https://t.me/${me.username} and press Start`,
        "  2. send it any message",
        "  3. run this script again and copy the id into TELEGRAM_CHAT_ID",
      ].join("\n")
    );
  } else {
    console.log("recent chats (put one of these ids in TELEGRAM_CHAT_ID):");
    for (const [id, title] of chats) {
      console.log(`  ${id}  ${title}`);
    }
  }

  if (process.argv.includes("--send")) {
    if (!config.telegram.chatId) {
      console.log("set TELEGRAM_CHAT_ID in backend/.env before using --send");
      return;
    }
    const sent = await call("sendMessage", {
      chat_id: config.telegram.chatId,
      text: "🧪 Test message from your ecommerce backend. Telegram is connected.",
    });
    console.log(`sent test message to ${sent.chat.id}`);
  }
};

run().catch((error) => {
  console.error(`telegram check failed: ${error.message}`);
  process.exit(1);
});

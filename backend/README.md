# Ecommerce API

Express + MongoDB (Mongoose) API for the React Ecommerce frontend. No auth: every read
endpoint is public, and the write endpoints are protected only by an optional shared
`ADMIN_KEY` header (see [Security](#security)).

Products are stored in MongoDB, product images are stored in Cloudinary, and every order is
saved in MongoDB and pushed to you over Telegram, plus a ready-to-send WhatsApp link.

## Stack

| Concern    | Choice                                                  |
| ---------- | ------------------------------------------------------- |
| HTTP       | Express 4                                               |
| Database   | MongoDB + Mongoose 8                                    |
| Images     | Multer 2 (multipart) + Cloudinary SDK (auto q-format)   |
| Telegram   | Bot API (`api.telegram.org`)                            |
| WhatsApp   | `wa.me` deep link with the order pre-filled             |

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

```dotenv
PORT=5001
CLIENT_URL=http://localhost:3000
SHOP_NAME=Ecommerce
SHIPPING_FLAT=30
CURRENCY=$

MONGODB_URI=mongodb://127.0.0.1:27017/ecommerce

# either the single URL or the three parts (both work)
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# token from @BotFather, chat id from @userinfobot (or getUpdates)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
TELEGRAM_BOT_USERNAME=

WHATSAPP_NUMBER=213676903083

# leave empty to keep write endpoints open, or set a key and send it as x-admin-key
ADMIN_KEY=
```

Then:

```bash
npm run seed            # pull 194 products from DummyJSON into MongoDB
npm run telegram:check  # confirm the bot can reach your chat
npm run telegram:check -- --send   # also send a test message
npm run dev             # http://localhost:5001/api
```

`npm run seed -- --cloudinary` re-uploads the seeded images to Cloudinary instead of keeping
the DummyJSON URLs.

Check what is wired up:

```bash
curl http://localhost:5001/api/health
```

```json
{
  "status": "ok",
  "shop": "Ecommerce",
  "db": "connected",
  "integrations": { "telegram": true, "cloudinary": true, "whatsappNumber": "213676903083" }
}
```

## Endpoints

### Public

| Method | Path                        | Notes                                              |
| ------ | --------------------------- | -------------------------------------------------- |
| GET    | `/api/health`               | db + integration status                            |
| GET    | `/api/categories`           | `[{ slug, name, count }]` derived from the products |
| GET    | `/api/products`             | `?category=&search=&page=&limit=` (max 200)         |
| GET    | `/api/products/:id`         | by Mongo id or `sku`                               |
| POST   | `/api/orders`               | creates the order, sends Telegram, returns the WhatsApp link |

### Write endpoints (`x-admin-key` when `ADMIN_KEY` is set)

| Method | Path                            | Notes                                    |
| ------ | ------------------------------- | ---------------------------------------- |
| POST   | `/api/products`                 | multipart `image`/`images` or `imageUrl` |
| PATCH  | `/api/products/:id`             | same payload as create                   |
| DELETE | `/api/products/:id`             | also removes the Cloudinary assets       |
| GET    | `/api/orders`                   | `?status=&page=&limit=`                  |
| GET    | `/api/orders/:id`               | by Mongo id or `orderNumber`             |
| PATCH  | `/api/orders/:id/status`        | `pending/confirmed/shipped/delivered/cancelled` |
| POST   | `/api/orders/:id/notify`        | resend the order to Telegram            |

### Create an order

```bash
curl -X POST http://localhost:5001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Islam Debbi",
        "phone": "+213676903083",
        "address": "Algiers",
        "note": "call before delivery",
        "items": [{ "id": "<productId>", "qty": 2 }]
      }'
```

Response:

```json
{
  "order": { "orderNumber": "ORD-TV1IFBEJ", "total": 428.5, "status": "pending", "...": "..." },
  "whatsappUrl": "https://wa.me/213676903083?text=Hello%20Ecommerce...",
  "telegramSent": true,
  "telegramError": ""
}
```

Prices, shipping and the order number are always computed server side from the database, so
a tampered client payload cannot change them.

### Upload a product with an image

```bash
curl -X POST http://localhost:5001/api/products \
  -F "title=Galaxy S9" -F "category=smartphones" -F "price=549" -F "stock=4" \
  -F "image=@./s9.png"
```

The image goes to Cloudinary with `quality=auto`, `fetch_format=auto` and a 1200x1200 limit,
and the returned secure URL is stored on the product.

## How an order reaches you

1. `POST /api/orders` saves the order with an `orderNumber`.
2. The order text (customer, phone, address, note, item lines, subtotal, shipping, total) is
   sent to your Telegram chat through the bot. `notifications.telegram` records whether it
   worked, so a failed push never blocks the order.
3. The same text is URL-encoded into `https://wa.me/<WHATSAPP_NUMBER>?text=...`, which the
   checkout opens in a new tab so the customer only presses send.

## Security

There is no user auth by design. Product writes and the order list are open unless you set
`ADMIN_KEY` in `.env`; when it is set, those routes require a matching `x-admin-key` header.
Do not expose this API to the internet without setting it.

## Project layout

```
src
  app.js                     express app + graceful shutdown
  server.js                  entry point
  config/                    env, mongoose, cloudinary
  models/                    Product, Category, Order
  controllers/               products, orders
  routes/                    /api router
  services/                  cloudinary, telegram, order messages
  middleware/                multer upload, error handler, admin key
  seed/seed.js               DummyJSON -> MongoDB
```

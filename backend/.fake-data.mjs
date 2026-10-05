import { MongoMemoryServer } from "mongodb-memory-server";

const mongod = await MongoMemoryServer.create();
process.env.MONGODB_URI = mongod.getUri("ecommerce");

const { connectDatabase } = await import("./src/config/db.js");
const { start } = await import("./src/app.js");
const { default: Product } = await import("./src/models/Product.js");
const { default: Category, titleFromSlug } = await import("./src/models/Category.js");
const { cloudinary } = await import("./src/config/cloudinary.js");
const { uploadImage } = await import("./src/services/cloudinary.service.js");

await connectDatabase();

const CLOUDINARY_PRODUCTS = [
  {
    title: "Aurora Wireless Headphones",
    description:
      "Over ear headphones with active noise cancelling, 40h battery and a travel case. Handed in with the box.",
    price: 189.99,
    stock: 12,
    brand: "Aurora Audio",
    category: "headphones",
    photo: "https://picsum.photos/seed/headphones/1200/1200",
  },
  {
    title: "Nimbus Running Shoes",
    description:
      "Lightweight trainers with a breathable mesh upper and a cushioned foam sole, sizes 40 to 46.",
    price: 74.5,
    stock: 30,
    brand: "Nimbus",
    category: "shoes",
    photo: "https://picsum.photos/seed/runningshoes/1200/1200",
  },
  {
    title: "Solstice Ceramic Dinner Set",
    description:
      "Service for four: four plates, four bowls and four mugs, dishwasher safe glazed stoneware.",
    price: 62,
    stock: 8,
    brand: "Solstice Home",
    category: "kitchen",
    photo: "https://picsum.photos/seed/ceramicset/1200/1200",
  },
  {
    title: "Atlas Mechanical Keyboard",
    description:
      "Hot swap switches, PBT keycaps and a braided cable. Comes with a USB-C adapter.",
    price: 129,
    stock: 15,
    brand: "Atlas Peripherals",
    category: "laptops",
    photo: "https://picsum.photos/seed/mechanicalkeyboard/1200/1200",
  },
  {
    title: "Ember Pour Over Coffee Kit",
    description:
      "Glass carafe, stainless filter and a pack of 250g of single origin beans from Bejaia.",
    price: 41.75,
    stock: 25,
    brand: "Ember Roasters",
    category: "groceries",
    photo: "https://picsum.photos/seed/pourovercoffee/1200/1200",
  },
  {
    title: "Lumen Desk Lamp",
    description:
      "Adjustable aluminium lamp with three colour temperatures and a USB port in the base.",
    price: 54.3,
    stock: 18,
    brand: "Lumen",
    category: "furniture",
    photo: "https://picsum.photos/seed/desklamp/1200/1200",
  },
];

const remoteProducts = async () => {
  const { products } = await (await fetch("https://dummyjson.com/products?limit=0")).json();
  return products.map((item) => ({
    title: item.title,
    description: item.description,
    price: item.price,
    discountPercentage: item.discountPercentage,
    category: item.category,
    brand: item.brand,
    sku: item.sku,
    stock: item.stock,
    rating: { rate: item.rating, count: item.reviews?.length ?? 0 },
    image: item.thumbnail,
    images: [item.thumbnail],
    source: "dummyjson",
  }));
};

const uploadToCloudinary = async (url, folder) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) {
    throw new Error(`photo download failed: ${url} (${response.status})`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  return uploadImage({ buffer, mimetype: "image/jpeg", originalname: `${url.split("/").pop()}.jpg` }, folder);
};

const cloudinaryProducts = async () => {
  const docs = [];
  for (const item of CLOUDINARY_PRODUCTS) {
    const { photo, ...rest } = item;
    const base = {
      ...rest,
      discountPercentage: 0,
      rating: { rate: Number((3.8 + Math.random() * 1.2).toFixed(1)), count: 1 + Math.floor(Math.random() * 40) },
      source: "fake-cloudinary",
    };

    // The photo CDN is occasionally unreachable from a sandbox, so a failed
    // upload must not abort the whole seed.
    try {
      const { url, publicId } = await uploadToCloudinary(photo, "ecommerce/products");
      docs.push({ ...base, image: url, images: [url], cloudinaryIds: [publicId] });
      console.log(`[fake-data] uploaded ${rest.title} -> ${url}`);
    } catch (error) {
      const fallback = `https://placehold.co/1200x1200/png?text=${encodeURIComponent(rest.title)}`;
      docs.push({ ...base, image: fallback, images: [fallback], cloudinaryIds: [] });
      console.warn(`[fake-data] skipped photo for ${rest.title}: ${error.cause?.code || error.message}`);
    }
  }
  return docs;
};

const seed = async () => {
  const catalogue = [...(await remoteProducts()), ...(await cloudinaryProducts())];

  await Product.insertMany(catalogue);
  const slugs = [...new Set(catalogue.map((item) => item.category))];
  await Category.insertMany(slugs.map((slug) => ({ name: slug, title: titleFromSlug(slug) })));

  console.log(
    `[fake-data] ${catalogue.length} products (${catalogue.length - CLOUDINARY_PRODUCTS.length} remote, ${
      CLOUDINARY_PRODUCTS.length
    } hosted on Cloudinary) in ${slugs.length} categories`
  );
};

const NAMES = [
  ["Islam Debbi", "+213676903083"],
  ["Amine Bensalah", "+213555102030"],
  ["Lina Haddad", "+213661223344"],
  ["Yacine Meziane", "+213770998877"],
  ["Sarah Bouali", "+213550443322"],
  ["Karim Zerrouki", "+213699887744"],
];
const STATUSES = ["delivered", "delivered", "shipped", "confirmed", "pending", "cancelled"];

const seedOrders = async () => {
  const { default: Order } = await import("./src/models/Order.js");
  const catalogue = await Product.find().lean();
  const now = Date.now();
  const orders = [];

  for (let day = 27; day >= 0; day -= 1) {
    const perDay = 1 + ((day * 3) % 3);
    for (let n = 0; n < perDay; n += 1) {
      const picked = [catalogue[(day * 7 + n * 11) % catalogue.length], catalogue[(day * 5 + n * 17) % catalogue.length]];
      const items = picked.map((product) => ({
        productId: product._id.toString(),
        title: product.title,
        price: product.price,
        qty: 1 + ((day + n) % 3),
        image: product.image,
      }));
      const subtotal = Math.round(items.reduce((sum, item) => sum + item.price * item.qty, 0) * 100) / 100;
      const shipping = 30;
      const createdAt = new Date(now - day * 86400000 - n * 3600000 * 4);
      const [name, phone] = NAMES[(day + n * 2) % NAMES.length];
      const order = new Order({
        orderNumber: `ORD-${createdAt.getTime().toString(36).toUpperCase()}${n}`,
        customer: {
          name,
          phone,
          address: `${10 + n} Rue des Freres Bouadou, Algiers`,
          note: n === 0 ? "Please call before delivery." : "",
        },
        items,
        itemCount: items.reduce((sum, item) => sum + item.qty, 0),
        channel: (day + n) % 3 === 0 ? "whatsapp" : "telegram",
        subtotal,
        shipping,
        total: Math.round((subtotal + shipping) * 100) / 100,
        status: STATUSES[(day + n) % STATUSES.length],
      });
      orders.push({ doc: order, createdAt });
    }
  }

  await Order.insertMany(orders.map((entry) => entry.doc));
  await Order.collection.bulkWrite(
    orders.map((entry) => ({
      updateOne: {
        filter: { orderNumber: entry.doc.orderNumber },
        update: { $set: { createdAt: entry.createdAt, updatedAt: entry.createdAt } },
      },
    }))
  );
  console.log(`[fake-data] ${orders.length} demo orders across 28 days`);
};

await seed();
await seedOrders();
await start();

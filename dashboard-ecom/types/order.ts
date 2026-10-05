export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderChannel = "telegram" | "whatsapp";

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  qty: number;
  image: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: OrderCustomer;
  items: OrderItem[];
  itemCount: number;
  channel: OrderChannel;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  notifications: {
    telegram: {
      sent: boolean;
      error: string;
      chatId: string;
    };
    whatsappUrl: string;
  };
  createdAt: string;
}
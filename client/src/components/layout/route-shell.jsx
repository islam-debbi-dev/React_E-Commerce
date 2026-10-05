import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CartDrawer from "@/components/cart/cart-drawer";
import { CartDrawerProvider } from "@/components/cart/cart-drawer-context";

export default function RouteShell() {
  return (
    <CartDrawerProvider>
      <div className="flex min-h-full flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <CartDrawer />
    </CartDrawerProvider>
  );
}
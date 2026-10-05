import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";

import store from "./redux/store";
import ScrollToTop from "@/components/scroll-to-top";
import { ThemeProvider } from "@/components/theme-provider";
import RouteShell from "@/components/layout/route-shell";

import ProductList from "@/pages/ProductList";
import ProductDetails from "@/pages/ProductDetails";
import CartPage from "@/pages/CartPage";
import Checkout from "@/pages/Checkout";
import LegacyPage from "@/pages/LegacyPage";
import PageNotFound from "@/pages/PageNotFound";
import Wishlist from "@/pages/Wishlist";

import "@fontsource/geist-sans/400.css";
import "@fontsource/geist-sans/500.css";
import "@fontsource/geist-sans/600.css";
import "@fontsource/geist-sans/700.css";
import "@/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider defaultTheme="system">
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<RouteShell />}>
              <Route path="/" element={<ProductList />} />
              <Route path="/product" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<LegacyPage kind="about" />} />
              <Route path="/contact" element={<LegacyPage kind="contact" />} />
              <Route path="/login" element={<LegacyPage kind="login" />} />
              <Route path="/register" element={<LegacyPage kind="register" />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
          <Toaster richColors position="top-right" closeButton />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
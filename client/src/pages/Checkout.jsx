import React, { useState } from "react";
import { Footer, Navbar } from "../components";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { createOrder } from "../api/orders";
import { clearCart } from "../redux/action";
import { usePruneCart } from "../hooks/usePruneCart";

const SHIPPING = 30;

const EmptyCart = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 py-5 bg-light text-center">
          <h4 className="p-3 display-5">No item in Cart</h4>
          <Link to="/" className="btn btn-outline-dark mx-4">
            <i className="fa fa-arrow-left"></i> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

const Summary = ({ items, totalItems, subtotal }) => {
  return (
    <div className="col-md-5 col-lg-4 order-md-last">
      <div className="card mb-4">
        <div className="card-header py-3 bg-light">
          <h5 className="mb-0">Order Summary</h5>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {items.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center border-0 px-0"
              >
                <span>
                  {item.title} <small className="text-muted">x {item.qty}</small>
                </span>
                <span>${Math.round(item.price * item.qty)}</span>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
              Products ({totalItems})<span>${Math.round(subtotal)}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center px-0">
              Shipping
              <span>${SHIPPING}</span>
            </li>
            <li className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
              <div>
                <strong>Total amount</strong>
              </div>
              <span>
                <strong>${Math.round(subtotal + SHIPPING)}</strong>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Details = ({
  customer,
  onChange,
  sending,
  placedOrder,
  whatsappUrl,
  onTelegram,
  onWhatsApp,
  onReset,
}) => {
  return (
    <div className="col-md-7 col-lg-8">
      <div className="card mb-4">
        <div className="card-header py-3">
          <h4 className="mb-0">Your details</h4>
        </div>
        <div className="card-body">
          <form onSubmit={onTelegram} autoComplete="on">
            <div className="row g-3">
              <div className="col-sm-6 my-1">
                <label htmlFor="name" className="form-label">
                  Full name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="Jane Doe"
                  value={customer.name}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="col-sm-6 my-1">
                <label htmlFor="phone" className="form-label">
                  Phone number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phone"
                  name="phone"
                  placeholder="+213 676 903 083"
                  value={customer.phone}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="col-12 my-1">
                <label htmlFor="address" className="form-label">
                  Delivery address
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  placeholder="City, street, building"
                  value={customer.address}
                  onChange={onChange}
                />
              </div>

              <div className="col-12 my-1">
                <label htmlFor="note" className="form-label">
                  Note for the shop{" "}
                  <span className="text-muted">(Optional)</span>
                </label>
                <textarea
                  className="form-control"
                  id="note"
                  name="note"
                  rows="3"
                  placeholder="Call me before delivery"
                  value={customer.note}
                  onChange={onChange}
                ></textarea>
              </div>
            </div>

            <hr className="my-4" />

            <h4 className="mb-3">Send your order</h4>
            <p className="text-muted">
              No card needed. Pick how you want to send the order details, we
              receive them instantly.
            </p>

            {placedOrder && (
              <div className="alert alert-success" role="alert">
                Order <strong>{placedOrder.orderNumber}</strong> saved, total $
                {Math.round(placedOrder.total)} ({placedOrder.itemCount} items).
              </div>
            )}

            <div className="row">
              <div className="col-md-6 mb-2">
                <button
                  type="button"
                  className="w-100 btn btn-success"
                  disabled={Boolean(sending)}
                  onClick={onWhatsApp}
                >
                  <i className="fa fa-whatsapp mr-2"></i>
                  {sending === "whatsapp" ? "Opening WhatsApp..." : "Order on WhatsApp"}
                </button>
              </div>
              <div className="col-md-6 mb-2">
                <button
                  type="submit"
                  className="w-100 btn btn-info"
                  disabled={Boolean(sending)}
                >
                  <i className="fa fa-paper-plane mr-2"></i>
                  {sending === "telegram" ? "Sending..." : "Order on Telegram"}
                </button>
              </div>
            </div>

            {whatsappUrl && (
              <div className="alert alert-warning mt-3" role="alert">
                Your browser blocked the WhatsApp tab.{" "}
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Open the WhatsApp order
                </a>{" "}
                to finish sending it.
              </div>
            )}

            {placedOrder && (
              <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={onReset}>
                Start a new order
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  const state = useSelector((state) => state.handleCart);
  const dispatch = useDispatch();

  const [customer, setCustomer] = useState({ name: "", phone: "", address: "", note: "" });
  const [sending, setSending] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  usePruneCart(state);

  const updateField = (event) => {
    const { name, value } = event.target;
    setCustomer((previous) => ({ ...previous, [name]: value }));
  };

  const placeOrder = async (channel) => {
    if (!customer.name.trim() || !customer.phone.trim()) {
      toast.error("Name and phone number are required");
      return;
    }

    const tab = channel === "whatsapp" ? window.open("", "_blank") : null;

    setSending(channel);
    try {
      const data = await createOrder({
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        address: customer.address.trim(),
        note: customer.note.trim(),
        channel,
        items: state.map((item) => ({ id: item.id, qty: item.qty })),
      });

      setPlacedOrder(data.order);

      if (channel === "whatsapp") {
        if (tab && !tab.closed) {
          tab.location.href = data.whatsappUrl;
          toast.success("WhatsApp opened, press send to confirm your order");
        } else {
          setWhatsappUrl(data.whatsappUrl);
          toast("WhatsApp tab was blocked, use the link below", { icon: "⚠️" });
        }
      } else if (data.telegramSent) {
        toast.success(`Order ${data.order.orderNumber} sent to Telegram`);
      } else {
        toast.error(`Order saved, but Telegram push failed: ${data.telegramError}`);
      }
    } catch (error) {
      if (tab && !tab.closed) {
        tab.close();
      }
      toast.error(error.message);
    } finally {
      setSending("");
    }
  };

  const reset = () => {
    dispatch(clearCart());
    setPlacedOrder(null);
    setWhatsappUrl("");
    setCustomer({ name: "", phone: "", address: "", note: "" });
  };

  const subtotal = state.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = state.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Checkout</h1>
        <hr />
        {state.length ? (
          <div className="container py-5">
            <div className="row my-4">
              <Summary items={state} totalItems={totalItems} subtotal={subtotal} />
              <Details
                customer={customer}
                onChange={updateField}
                sending={sending}
                placedOrder={placedOrder}
                whatsappUrl={whatsappUrl}
                onTelegram={(event) => {
                  event.preventDefault();
                  placeOrder("telegram");
                }}
                onWhatsApp={() => placeOrder("whatsapp")}
                onReset={reset}
              />
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Checkout;

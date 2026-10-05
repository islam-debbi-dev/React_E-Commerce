import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Check,
  CircleCheck,
  ClipboardCheck,
  Loader2,
  MessageCircle,
  Package,
  Send,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import EmptyState from "@/components/empty-state";
import SuccessPanel from "@/components/checkout/success-panel";

import { useDispatch } from "react-redux";
import { clearCart } from "@/redux/action";
import { useCart, currency } from "@/hooks/use-cart";
import { usePruneCart } from "@/hooks/use-prune-cart";
import { createOrder } from "@/api/orders";

const steps = [
  { id: "details", label: "Details", icon: ClipboardCheck },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "confirm", label: "Confirm", icon: CircleCheck },
];

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z
    .string()
    .min(6, "Please enter your phone number")
    .regex(/^[+\d][\d\s()-]{6,}$/, "Use digits, spaces, + or - only"),
  address: z.string().max(160, "Address is too long").optional(),
  note: z.string().max(280, "Note is too long").optional(),
});

export default function Checkout() {
  const dispatch = useDispatch();
  const { items, itemCount, subtotal, shipping, total, isEmpty } = useCart();
  usePruneCart(items);

  const [step, setStep] = useState(0);
  const [channel, setChannel] = useState("telegram");
  const [placing, setPlacing] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", phone: "", address: "", note: "" },
    mode: "onBlur",
  });

  const goToDelivery = async () => {
    const valid = await trigger(["name", "phone"]);
    if (valid) {
      setStep(1);
      toast.success("Details saved");
    }
  };

  const placeOrder = async (values) => {
    if (placing) return;
    setPlacing(true);

    // Opened synchronously so the browser never blocks it as a popup.
    let waTab = null;
    if (channel === "whatsapp") {
      waTab = window.open("", "_blank");
    }

    try {
      const data = await createOrder({
        items: items.map((item) => ({ id: item.id, qty: item.qty })),
        name: values.name.trim(),
        phone: values.phone.trim(),
        address: (values.address ?? "").trim(),
        note: (values.note ?? "").trim(),
        channel,
      });

      if (channel === "whatsapp" && data.whatsappUrl) {
        if (waTab && !waTab.closed) {
          waTab.location.href = data.whatsappUrl;
        } else {
          waTab?.close();
          const opened = window.open(data.whatsappUrl, "_blank", "noopener");
          if (!opened) {
            toast.warning("WhatsApp was blocked, use the link on the next screen");
          }
        }
      } else {
        waTab?.close();
      }

      if (channel === "telegram") {
        if (data.telegramSent) {
          toast.success(`Order ${data.order.orderNumber} sent to Telegram`);
        } else {
          toast.error(`Order saved, but the Telegram push failed: ${data.telegramError}`);
        }
      }

      dispatch(clearCart());
      setResult({
        order: data.order,
        whatsappUrl: data.whatsappUrl,
        channel,
        tabBlocked: channel === "whatsapp" && !waTab,
      });
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      waTab?.close();
      toast.error("Could not place the order", { description: error.message });
      setStep(0);
    } finally {
      setPlacing(false);
    }
  };

  if (result) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-12">
        <SuccessPanel result={result} copied={copied} onCopy={setCopied} />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16">
        <EmptyState
          icon={Package}
          title="Nothing to check out"
          description="Your cart is empty. Add a product and come back to place your order."
          actionLabel="Browse products"
          actionTo="/product"
        />
      </div>
    );
  }

  const values = getValues();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <p className="text-sm text-muted-foreground">
          {itemCount} {itemCount === 1 ? "item" : "items"} · {currency(total)}
        </p>
      </header>

      <CheckoutSteps current={step} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          {step === 0 && (
            <Card>
              <CardContent className="space-y-5 p-5">
                <div className="space-y-1">
                  <h2 className="font-semibold">Your details</h2>
                  <p className="text-sm text-muted-foreground">
                    We only use these to confirm the order.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    placeholder="Islam Debbi"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby="name-error"
                    {...register("name")}
                  />
                  <FieldError id="name-error" message={errors.name?.message} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+213 6 00 00 00 00"
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby="phone-error"
                    {...register("phone")}
                  />
                  <FieldError id="phone-error" message={errors.phone?.message} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Delivery address{" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="address"
                    placeholder="Street, city"
                    autoComplete="street-address"
                    {...register("address")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">
                    Note{" "}
                    <span className="font-normal text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    id="note"
                    rows={3}
                    placeholder="When should we deliver?"
                    {...register("note")}
                  />
                </div>

                <div className="flex flex-wrap justify-between gap-3 pt-1">
                  <Button asChild variant="ghost" className="text-muted-foreground">
                    <Link to="/cart">
                      <ArrowLeft className="h-4 w-4" />
                      Back to cart
                    </Link>
                  </Button>
                  <Button onClick={goToDelivery} className="min-w-36 gap-2">
                    Continue
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 1 && (
            <Card>
              <CardContent className="space-y-5 p-5">
                <div className="space-y-1">
                  <h2 className="font-semibold">How should we confirm?</h2>
                  <p className="text-sm text-muted-foreground">
                    Pick a channel. Both send the same order summary to the shop.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <ChannelCard
                    active={channel === "telegram"}
                    onClick={() => setChannel("telegram")}
                    icon={Send}
                    title="Telegram"
                    description="Order is sent to the shop bot right away."
                  />
                  <ChannelCard
                    active={channel === "whatsapp"}
                    onClick={() => setChannel("whatsapp")}
                    icon={MessageCircle}
                    title="WhatsApp"
                    description="Opens a chat with the prefilled order."
                  />
                </div>

                <dl className="space-y-1 rounded-md bg-muted/50 p-4 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Name</dt>
                    <dd className="truncate font-medium">{values.name}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Phone</dt>
                    <dd className="font-medium">{values.phone}</dd>
                  </div>
                  {values.address && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Address</dt>
                      <dd className="truncate font-medium">{values.address}</dd>
                    </div>
                  )}
                  {values.note && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Note</dt>
                      <dd className="truncate font-medium">{values.note}</dd>
                    </div>
                  )}
                </dl>

                <div className="flex flex-wrap justify-between gap-3 pt-1">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(0)}
                    className="text-muted-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Edit details
                  </Button>
                  <form
                    onSubmit={handleSubmit((data) => placeOrder({ ...data, ...values }))}
                    className="flex"
                  >
                    <Button type="submit" disabled={placing} className="min-w-44 gap-2">
                      {placing ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Placing order…
                        </>
                      ) : (
                        <>
                          Place order
                          <Check className="h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="space-y-4 p-5">
              <h2 className="font-semibold">Your order</h2>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                        {item.qty}
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                      <p className="text-xs tabular-nums text-muted-foreground">
                        {currency(item.price)} each
                      </p>
                    </div>
                    <span className="text-sm font-medium tabular-nums">
                      {currency(item.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <Separator />

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{currency(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="tabular-nums">{currency(shipping)}</dd>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{currency(total)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

/**
 * The slot is always present so showing or clearing a message never reflows
 * the form. A layout shift while the pointer is down cancels the click that
 * follows mouseup, which used to swallow the "Continue" click.
 */
function FieldError({ id, message }) {
  return (
    <p
      id={id}
      aria-live="polite"
      className={cn("min-h-4 text-xs text-destructive", !message && "invisible")}
    >
      {message ?? "\u00a0"}
    </p>
  );
}

function ChannelCard({ active, onClick, icon: Icon, title, description }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 text-left transition-all",
        active
          ? "border-foreground bg-accent"
          : "hover:border-muted-foreground/40 hover:bg-accent/50"
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
          active ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 font-medium">
          {title}
          {active && <Check className="h-3.5 w-3.5" />}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
      </span>
    </button>
  );
}

export function CheckoutSteps({ current }) {
  return (
    <ol className="flex items-center gap-2 text-sm">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const done = index < current;
        const active = index === current;

        return (
          <li key={step.id} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                active && "border-foreground bg-foreground text-background",
                done && "border-foreground bg-accent",
                !active && !done && "text-muted-foreground"
              )}
            >
              {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
            </span>
            <span className={cn("hidden sm:inline", active ? "font-medium" : "text-muted-foreground")}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <span className={cn("ml-1 h-px flex-1", done ? "bg-foreground" : "bg-border")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
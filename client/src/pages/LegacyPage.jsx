import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const copy = {
  about: {
    title: "About us",
    intro:
      "A small demo shop built to show a full stack slice: a React storefront, an Express API, MongoDB storage, Cloudinary uploads and an admin dashboard.",
    sections: [
      {
        title: "What we sell",
        body: "Everything in the catalogue is seeded from DummyJSON and enriched with a few Cloudinary uploads, so images and prices behave like a real shop.",
      },
      {
        title: "How ordering works",
        body: "Checkout sends the order to the shop over Telegram or hands you a prefilled WhatsApp chat. Both channels are connected to the same admin dashboard.",
      },
      {
        title: "Why this exists",
        body: "It is a portfolio piece: the same neutral, high contrast design language is used across the storefront and the dashboard.",
      },
    ],
  },
  contact: {
    title: "Contact us",
    intro: "Questions about an order or a product? Send a message and we will reply.",
  },
  login: {
    title: "Welcome back",
    intro: "Sign in to track your orders and manage your wishlist.",
    submit: "Sign in",
    footer: "Need an account?",
    footerLink: "Create one",
    footerTo: "/register",
  },
  register: {
    title: "Create an account",
    intro: "Save your details once and check out faster next time.",
    submit: "Create account",
    footer: "Already registered?",
    footerLink: "Sign in",
    footerTo: "/login",
  },
};

export default function LegacyPage({ kind }) {
  const content = copy[kind];
  if (!content) return null;

  if (kind === "about") return <About content={content} />;
  if (kind === "contact") return <Contact content={content} />;
  return <Auth kind={kind} content={content} />;
}

function PageHeader({ title, intro }) {
  return (
    <header className="mb-8 flex flex-col gap-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mx-auto max-w-xl text-sm text-muted-foreground">{intro}</p>
    </header>
  );
}

function About({ content }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <PageHeader title={content.title} intro={content.intro} />
      <div className="space-y-6">
        {content.sections.map((section) => (
          <Card key={section.title}>
            <CardContent className="space-y-2 p-5">
              <h2 className="font-semibold">{section.title}</h2>
              <p className="leading-relaxed text-muted-foreground">{section.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button asChild>
          <Link to="/product">Browse the catalogue</Link>
        </Button>
      </div>
    </div>
  );
}

function Contact({ content }) {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-12">
      <PageHeader title={content.title} intro={content.intro} />

      <Card>
        <CardContent className="p-5">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
              toast.success("Message ready to send", {
                description: "This demo form does not submit anywhere yet.",
              });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input id="contact-email" type="email" placeholder="name@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea id="contact-message" rows={5} placeholder="How can we help?" required />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={sent}>
              <Send className="h-4 w-4" />
              {sent ? "Sent" : "Send message"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <div className="grid gap-4 text-sm sm:grid-cols-3">
        <a
          href="mailto:hello@ecommerce.test"
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Mail className="h-4 w-4" />
          hello@ecommerce.test
        </a>
        <a
          href="tel:+21300000000"
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Phone className="h-4 w-4" />
          +213 00 00 00 00
        </a>
        <span className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          Online only
        </span>
      </div>
    </div>
  );
}

function Auth({ kind, content }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16">
      <PageHeader title={content.title} intro={content.intro} />

      <Card>
        <CardContent className="p-5">
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              toast.info("Accounts are not enabled in this demo yet");
            }}
          >
            {kind === "register" && (
              <div className="space-y-2">
                <Label htmlFor="auth-name">Full name</Label>
                <Input id="auth-name" placeholder="Your name" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="auth-email">Email</Label>
              <Input id="auth-email" type="email" placeholder="name@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-password">Password</Label>
              <Input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {content.submit}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {content.footer}{" "}
        <Link to={content.footerTo} className="font-medium text-foreground hover:underline">
          {content.footerLink}
        </Link>
      </p>
    </div>
  );
}
const currency = process.env.NEXT_PUBLIC_CURRENCY || "$";

export const formatCurrency = (value: number, fractionDigits = 2) =>
  `${currency}${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;

export const formatCompactCurrency = (value: number) => {
  const amount = Number(value || 0);
  if (Math.abs(amount) < 1000) {
    return formatCurrency(amount, 0);
  }
  return `${currency}${(amount / 1000).toFixed(amount >= 10000 ? 0 : 1)}k`;
};

export const formatNumber = (value: number) =>
  Number(value || 0).toLocaleString("en-US");

export const isRenderableImage = (value: unknown): value is string =>
  typeof value === "string" && /^https?:\/\//.test(value.trim());

const parseDay = (value: string) => new Date(`${value}T00:00:00Z`);

export const formatDayLabel = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(parseDay(value));

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));

export const formatRelativeTime = (value: string) => {
  const diffMs = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diffMs / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;

  const days = Math.round(hours / 24);
  if (days < 30) return `${days} d ago`;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(value));
};
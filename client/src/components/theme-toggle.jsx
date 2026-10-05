import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="h-9 w-9" aria-hidden="true" />;
  }

  const next =
    theme === "system" ? "light" : theme === "light" ? "dark" : "system";
  const label =
    theme === "system" ? "System theme" : theme === "light" ? "Light theme" : "Dark theme";
  const Icon = theme === "system" ? Monitor : theme === "light" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={`${label} — click to switch`}
      className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <Icon className="h-[1.15rem] w-[1.15rem]" />
    </button>
  );
}
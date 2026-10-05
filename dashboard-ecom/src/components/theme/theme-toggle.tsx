/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Theme</span>
        <div className="flex items-center rounded-lg bg-muted p-1">
          <div className="h-8 w-8 rounded-md bg-background" />
          <div className="h-8 w-8 rounded-md" />
          <div className="h-8 w-8 rounded-md" />
        </div>
      </div>
    );
  }

  const getThemeLabel = () => {
    switch (theme) {
      case "system":
        return "System";
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      default:
        return "System";
    }
  };

  const cycleTheme = () => {
    switch (theme) {
      case "system":
        setTheme("light");
        break;
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("system");
        break;
      default:
        setTheme("system");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-foreground">
        {getThemeLabel()}
      </span>
      <div className="flex items-center rounded-lg bg-muted p-1 transition-all duration-200 hover:bg-muted/80">
        <button
          onClick={() => setTheme("system")}
          className={`flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 hover:scale-110 ${
            theme === "system"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="System theme"
        >
          <Monitor className="h-4 w-4" />
        </button>
        <button
          onClick={() => setTheme("light")}
          className={`flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 hover:scale-110 ${
            theme === "light"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="Light theme"
        >
          <Sun className="h-4 w-4" />
        </button>
        <button
          onClick={() => setTheme("dark")}
          className={`flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200 hover:scale-110 ${
            theme === "dark"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="Dark theme"
        >
          <Moon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

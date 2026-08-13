"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label="Toggle theme"
      className="relative flex items-center focus:outline-none"
      style={{ width: 48, height: 28 }}
    >
      {/* Switch housing */}
      <span
        className="absolute inset-0 rounded-full border border-zinc-400 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-800"
        style={{
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.25), inset 0 -1px 2px rgba(255,255,255,0.1)",
        }}
      />

      {/* Lever */}
      <span
        className="absolute top-1 bottom-1 rounded-full transition-all duration-200 ease-in-out"
        style={{
          width: 22,
          left: isDark ? 22 : 2,
          background: isDark
            ? "linear-gradient(180deg, #3f3f46 0%, #27272a 100%)"
            : "linear-gradient(180deg, #fafafa 0%, #e4e4e7 100%)",
          boxShadow: isDark
            ? "2px 0 4px rgba(0,0,0,0.5), 1px 0 0 rgba(255,255,255,0.05)"
            : "2px 0 4px rgba(0,0,0,0.2), 1px 0 0 rgba(255,255,255,0.8)",
          //border: isDark ? "1px solid #52525b" : "1px solid #d4d4d8",
        }}
      />

      {/* Labels */}
      <span
        className="absolute top-0 bottom-0 flex items-center font-mono leading-none select-none transition-opacity duration-200"
        style={{ fontSize: 8, left: 8, opacity: isDark ? 0.3 : 0.8 }}
      >
        ☀️
      </span>
      <span
        className="absolute top-0 bottom-0 flex items-center font-mono leading-none select-none transition-opacity duration-200"
        style={{ fontSize: 8, right: 8, opacity: isDark ? 0.8 : 0.3 }}
      >
        🌙
      </span>
    </button>
  );
}

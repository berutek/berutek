"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    try {
      document.documentElement.classList.toggle("dark", theme === "dark");
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* ignore when document is not available */
    }
  }, [theme]);

  return (
    <button
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      aria-label="Toggle theme"
      className="px-2 py-1 rounded-md border border-gray-700/50 bg-zinc-200 dark:bg-zinc-700 text-sm fixed bottom-4 right-4 focus:outline-none focus:ring focus:ring-blue-200"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}

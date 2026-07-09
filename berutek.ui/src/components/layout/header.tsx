"use client";

import { useState } from "react";
import ThemeToggle from "../theme/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-zinc-100 dark:bg-zinc-900">
      <div className="flex items-center justify-between h-16 px-8">
        <div className="flex items-center space-x-2">
          <img src="/berutek.icon.webp" alt="Berutek Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Berutek</h1>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="hidden md:block">
          <ul className="flex items-center space-x-4">
            <li>
              <a href="https://login.berutek.dev/?flow=openid_connect&flow_id=f3f93fbd-e5c9-4891-a536-2a9c5deda9b9" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                Log in
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 hover:bg-zinc-400 duration-300 dark:hover:text-gray-200 p-3 rounded-md bg-zinc-200 dark:bg-zinc-700">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className={`block h-0.5 w-6 bg-gray-800 dark:bg-gray-200 transition-transform duration-300 ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-gray-800 dark:bg-gray-200 transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-gray-800 dark:bg-gray-200 transition-transform duration-300 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-zinc-200 dark:border-zinc-700 px-8 py-4">
          <ul className="flex flex-col space-y-4">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
              <a
                href="https://login.berutek.dev/?flow=openid_connect&flow_id=f3f93fbd-e5c9-4891-a536-2a9c5deda9b9"
                className="block text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </a>
            </li>
            <li>
              <a
                href="/contact"
                className="block text-center text-gray-600 dark:text-gray-400 hover:text-gray-800 hover:bg-zinc-400 duration-300 dark:hover:text-gray-200 p-3 rounded-md bg-zinc-200 dark:bg-zinc-700"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

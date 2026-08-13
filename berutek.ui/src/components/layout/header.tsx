"use client";

import { useState } from "react";
import ThemeToggle from "../theme/ThemeToggle";

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-10 w-full flex bg-zinc-100 p-2 dark:bg-zinc-900 items-center justify-center mb-3">
      <div className="flex items-center justify-between fixed py-2 px-3 w-11/12 md:w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded-full top-3 shadow-md shadow-zinc-700/20 dark:shadow-zinc-700/60 backdrop-blur-md">
        <a href="/" className="flex items-center space-x-2">
          <img src="/berutek.icon.webp" alt="Berutek Logo" className="w-6 h-6" />
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Berutek</h1>
        </a>

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

        <nav className="hidden md:flex items-center space-x-4">
          <a href="/contact" className="text-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 hover:text-zinc-100 hover:bg-zinc-700 duration-300 dark:hover:text-zinc-800 p-2 rounded-full bg-zinc-900 dark:bg-zinc-50">
            Get in touch
          </a>
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
        <nav className="md:hidden bg-zinc-200 dark:bg-zinc-700 px-8 py-4 fixed flex flex-col gap-4 top-18 rounded-md w-11/12 shadow-lg shadow-zinc-700/20 dark:shadow-zinc-700/60 backdrop-blur-md">
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
            {/* <li className="border-t border-zinc-200 dark:border-zinc-700 pt-4">
              <a
                href="https://drive.berutek.dev/apps/user_oidc/login/3"
                className="block text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                onClick={() => setMenuOpen(false)}
              >
                Log in
              </a>
            </li> */}
          </ul>
          <a href="/contact" className="text-zinc-200 w-full text-center dark:text-zinc-800 dark:hover:bg-zinc-300 hover:text-zinc-100 hover:bg-zinc-500 duration-300 dark:hover:text-gray-500 p-2 rounded-md bg-zinc-600 dark:bg-zinc-200">
              Get in touch
            </a>
        </nav>
      )}
    </header>
  );
}

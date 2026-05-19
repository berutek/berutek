"use client";

import ThemeToggle from "../theme/ThemeToggle";

export default function Header() {
  return (
    <header className="w-full h-16 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-between px-4">
      <div className="flex items-center space-x-2">
        <img src="/berutek.icon.png" alt="Berutek Logo" className="w-8 h-8 " />
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Berutek</h1>
      </div>
      <nav className="">
        <ul className="flex space-x-6">
          <li>
            <a href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              Home
            </a>
          </li>
          <li>
            <a href="/services" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              Services
            </a>
          </li>
          <li>
            <a href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              Blog
            </a>
          </li>
          <li>
            <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              About
            </a>
          </li>
        </ul>
      </nav>
      <nav>
        <ul className="flex items-center space-x-4">
          <li>
            <a href="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              Log in
            </a>
          </li>
          <li>
            <a href="/signup" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 hover:bg-zinc-400 duration-300 dark:hover:text-gray-200 p-3 rounded-md bg-zinc-200 dark:bg-zinc-700">
              Hire me
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
"use client";

import { usePathname } from "next/navigation";
import { API_ENDPOINTS } from "@/src/services/api/endpoints";
import { useAuth } from "@/src/hooks/api/useAuth";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/reporting", label: "Reporting" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen w-full bg-zinc-100 dark:bg-zinc-900">
      <header className="sticky top-0 z-10 w-full border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16 gap-6">
          <div className="flex items-center gap-8 min-w-0">
            <a href="/admin" className="flex items-center gap-2 shrink-0">
              <img src="/berutek.icon.webp" alt="Berutek Logo" className="w-6 h-6" />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Admin
              </span>
            </a>

            <nav className="flex items-center gap-6 overflow-x-auto">
              {navLinks.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <a
                    key={href}
                    href={href}
                    className={`text-sm whitespace-nowrap transition-colors duration-300 ${
                      active
                        ? "text-zinc-900 dark:text-zinc-50 font-medium"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                    }`}
                  >
                    {label}
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {user?.displayname && (
              <span className="hidden sm:inline text-sm text-zinc-500 dark:text-zinc-400">
                {user.displayname}
              </span>
            )}
            <a
              href={API_ENDPOINTS.AUTH.LOGOUT}
              className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors duration-300"
            >
              Logout
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}

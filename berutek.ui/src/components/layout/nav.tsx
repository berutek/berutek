"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@hooks/api/useAuth";

export interface AdminAction {
  label: string;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  /** Rendered as the inverted pill CTA (like "Get in touch") */
  primary?: boolean;
  /** Rendered in the muted red used for Logout */
  danger?: boolean;
}

const ADMIN_GROUP = "admin";

export default function Nav({ actions }: { actions: AdminAction[] }) {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const isAdmin = isAuthenticated && (user?.groups?.includes(ADMIN_GROUP) ?? false);
  if (!isAdmin) return null;

  return (
    <nav className=" top-0 right-0 -translate-x-1/2 z-40 flex items-center py-1.5 px-2 bg-zinc-200 dark:bg-zinc-700 rounded-full shadow-md shadow-zinc-700/20 dark:shadow-zinc-700/60 backdrop-blur-md">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Collapse admin panel" : "Expand admin panel"}
        aria-expanded={open}
        className="flex items-center justify-center w-8 h-8 rounded-full text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 duration-300"
      >
        <Cog6ToothIcon
          className={`w-5 h-5 transition-transform duration-300 ${open ? "rotate-90" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="flex items-center gap-3 overflow-hidden"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="pl-1 text-xs font-mono text-zinc-500 dark:text-zinc-400 whitespace-nowrap select-none">
              Options
            </span>
            <hr />

            {actions.map(({ label, onClick, icon: Icon, primary, danger }) => (
              <button
                key={label}
                onClick={onClick}
                className={`flex items-center gap-1.5 text-sm whitespace-nowrap duration-300 ${
                  primary
                    ? "text-zinc-50 dark:text-zinc-900 bg-zinc-900 dark:bg-zinc-50 hover:bg-zinc-700 dark:hover:bg-zinc-200 px-3 py-1.5 rounded-full"
                    : danger
                      ? "text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 pr-1"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 pr-1"
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

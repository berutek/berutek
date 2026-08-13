"use client";

import { AnimatePresence } from "motion/react";
import type { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}

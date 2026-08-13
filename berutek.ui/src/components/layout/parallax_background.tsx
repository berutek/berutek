"use client";

import { motion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";

type TokenDef = {
    text: string;
    left: string;
    top: string;
    size: number;
    yEnd: number;
    rotEnd: number;
    opacity: number;
    delay: number;
};

const TOKENS: TokenDef[] = [
    { text: "()", left: "42%", top: "7%", size: 20, yEnd: -90, rotEnd: 0, opacity: 0.07, delay: 0.0 },
    { text: "import", left: "6%", top: "11%", size: 11, yEnd: -130, rotEnd: -3, opacity: 0.08, delay: 0.3 },
    { text: "const", left: "82%", top: "15%", size: 12, yEnd: -110, rotEnd: 2, opacity: 0.07, delay: 0.1 },
    { text: "await", left: "24%", top: "26%", size: 23, yEnd: -105, rotEnd: 0, opacity: 0.065, delay: 0.5 },
    { text: "=>", left: "12%", top: "42%", size: 28, yEnd: -80, rotEnd: 0, opacity: 0.09, delay: 0.2 },
    { text: "{ }", left: "88%", top: "34%", size: 18, yEnd: -70, rotEnd: 5, opacity: 0.07, delay: 0.4 },
    { text: "</>", left: "46%", top: "44%", size: 20, yEnd: -55, rotEnd: 0, opacity: 0.055, delay: 0.0 },
    { text: "async", left: "68%", top: "51%", size: 11, yEnd: -150, rotEnd: 0, opacity: 0.07, delay: 0.6 },
    { text: "/* */", left: "28%", top: "58%", size: 12, yEnd: -120, rotEnd: -2, opacity: 0.065, delay: 0.35 },
    { text: "function", left: "78%", top: "68%", size: 10, yEnd: -175, rotEnd: 1, opacity: 0.055, delay: 0.8 },
    { text: "//", left: "34%", top: "23%", size: 18, yEnd: -140, rotEnd: 0, opacity: 0.07, delay: 0.25 },
    { text: "null", left: "58%", top: "65%", size: 11, yEnd: -160, rotEnd: 5, opacity: 0.06, delay: 0.7 },
    { text: "@Controller", left: "8%", top: "78%", size: 10, yEnd: -200, rotEnd: 0, opacity: 0.055, delay: 0.9 },
    { text: "[ ]", left: "76%", top: "82%", size: 24, yEnd: -210, rotEnd: 0, opacity: 0.065, delay: 0.55 },
    { text: "type", left: "52%", top: "32%", size: 10, yEnd: -100, rotEnd: -2, opacity: 0.065, delay: 0.45 },
];

function Token({
    sv,
    text, left, top, size, yEnd, rotEnd, opacity, delay,
}: TokenDef & { sv: MotionValue<number> }) {
    const y = useTransform(sv, [0, 1], [0, yEnd]);
    const rotate = useTransform(sv, [0, 1], [0, rotEnd]);

    return (
        <motion.span
            className="absolute select-none text-zinc-900 dark:text-green-300"
            style={{
                left,
                top,
                fontSize: size,
                fontFamily: "var(--font-geist-mono)",
                y,
                rotate,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity }}
            transition={{ delay, duration: 2.5, ease: "easeOut" }}
        >
            {text}
        </motion.span>
    );
}

export default function ParallaxBackground() {
    const { scrollYProgress } = useScroll();
    const goldY = useTransform(scrollYProgress, [0, 1], [0, -65]);
    const slateY = useTransform(scrollYProgress, [0, 1], [0, -40]);

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">

            {/* Ambient slate bloom — bottom left */}
            <motion.div
                className="absolute -bottom-48 -left-48 w-[580px] h-[580px]"
                style={{ y: slateY }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3.5, delay: 0.4, ease: "easeOut" }}
            >
                <div
                    className="w-full h-full blur-[110px]"
                    style={{
                        background:
                            "radial-gradient(ellipse at 45% 55%, rgba(100,116,139,0.11) 0%, transparent 65%)",
                    }}
                />
            </motion.div>

            {/* Floating code tokens */}
            {TOKENS.map((tok) => (
                <Token key={tok.left + tok.top} sv={scrollYProgress} {...tok} />
            ))}

            {/* Gold blinking terminal cursor */}
            <motion.span
                className="absolute select-none"
                style={{
                    left: "79%",
                    top: "73%",
                    fontSize: 13,
                    fontFamily: "var(--font-geist-mono)",
                    color: "#D4AF37",
                    opacity: 0.22,
                }}
                animate={{ opacity: [0.22, 0, 0.22] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            >
                ▋
            </motion.span>

            {/* Horizontal scan line */}
            <motion.div
                className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-zinc-900/5 dark:via-gray-100/8 to-transparent"
                animate={{ y: ["0vh", "100vh"] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
            />
        </div>
    );
}

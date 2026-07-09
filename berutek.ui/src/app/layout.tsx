import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/header";
import ThemeToggle from "../components/theme/ThemeToggle";
import { AuthProvider } from "../providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://berutek.dev"),
  title: {
    default: "Berutek — Boutique Software Studio",
    template: "%s | Berutek",
  },
  description:
    "Berutek is a boutique software studio run by Giovanny Bernal — full-stack developer and systems engineer with 3+ years building production software for startups and small teams.",
  keywords: [
    "full-stack developer",
    "freelance software engineer",
    "web development",
    "cloud infrastructure",
    "Next.js developer",
    "React developer",
    "Node.js",
    "GCP",
    "Docker",
    "automation",
    "Giovanny Bernal",
    "boutique software studio",
  ],
  authors: [{ name: "Giovanny Bernal", url: "https://berutek.dev" }],
  creator: "Giovanny Bernal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://berutek.dev",
    siteName: "Berutek",
    title: "Berutek — Boutique Software Studio",
    description:
      "Full-stack development, cloud infrastructure, and automation for startups and small teams. Direct communication, end-to-end ownership, 3+ years in production.",
    images: [
      {
        url: "/berutek.icon.webp",
        width: 512,
        height: 512,
        alt: "Berutek logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Berutek — Boutique Software Studio",
    description:
      "Full-stack development, cloud infrastructure, and automation for startups and small teams.",
    images: ["/berutek.icon.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/berutek.icon.webp",
    apple: "/berutek.icon.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

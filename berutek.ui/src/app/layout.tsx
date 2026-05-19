import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/layout/header";
import ThemeToggle from "../components/theme/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BeruTek - AI-Powered Freelance Marketplace",
  description: "BeruTek is an AI-powered freelance marketplace that connects businesses with top-tier freelancers for a wide range of services. Our platform leverages cutting-edge AI technology to match clients with the best freelancers based on their skills, experience, and project requirements. Whether you're looking for web development, graphic design, content creation, or any other freelance service, BeruTek has you covered. Join us today and experience the future of freelancing!  ",
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
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}

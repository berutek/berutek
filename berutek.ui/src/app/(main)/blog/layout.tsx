import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Weekly notes from Giovanny Bernal at Berutek — what's being built, what broke, and what was learned shipping production software.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog — Berutek",
    description:
      "Weekly notes on building production software: full-stack development, cloud infrastructure, and automation.",
    url: "https://berutek.dev/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

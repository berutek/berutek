import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Giovanny Bernal at Berutek. Describe your project and receive a response within one business day — no sales team, just a direct conversation.",
  openGraph: {
    title: "Contact — Berutek",
    description:
      "Start a conversation about your project. Direct contact with the engineer who will build it.",
    url: "https://berutek.dev/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

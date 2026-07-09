import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/signup", "/login/2fa", "/no-account"],
    },
    sitemap: "https://berutek.dev/sitemap.xml",
  };
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // "/admin" as a prefix already covers everything under it per the robots.txt spec.
      disallow: ["/login", "/signup", "/login/2fa", "/no-account", "/admin"],
    },
    sitemap: "https://berutek.dev/sitemap.xml",
  };
}

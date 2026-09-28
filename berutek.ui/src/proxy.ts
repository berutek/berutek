import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_GROUP, type User } from "@/src/types/auth.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030/api/v1";

// "/" needs the admin/main split, and everything under "/admin" needs to reject non-admins.
export const config = {
  matcher: ["/", "/admin", "/admin/:path*"],
};

async function isAdminSession(cookie: string | null): Promise<boolean> {
  if (!cookie) return false;

  try {
    // Session is validated by the NestJS backend, so the cookie has to be forwarded
    // explicitly here — this fetch isn't a browser request, so it won't attach it on its own.
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: { cookie },
    });

    if (!res.ok) return false;

    const profile: Partial<User> = await res.json();
    return profile.groups?.includes(ADMIN_GROUP) ?? false;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const admin = await isAdminSession(request.headers.get("cookie"));

  if (pathname === "/") {
    return admin ? NextResponse.rewrite(new URL("/admin", request.url)) : NextResponse.next();
  }

  // pathname === "/admin" or "/admin/*"
  if (!admin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

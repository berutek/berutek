import { API_ENDPOINTS } from "@/src/services/api/endpoints";
import { NextRequest, NextResponse } from "next/server";

async function toJsonResponse(res: Response) {
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function GET() {
  const res = await fetch(API_ENDPOINTS.BLOGS.LIST, { cache: "no-store" });
  return toJsonResponse(res);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  // Forward the session cookie — the backend guards creation behind the admin role
  const res = await fetch(API_ENDPOINTS.BLOGS.LIST, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") ?? "",
    },
    body: JSON.stringify(body),
  });

  return toJsonResponse(res);
}

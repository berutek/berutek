import { API_ENDPOINTS } from "@/src/services/api/endpoints";
import { NextRequest, NextResponse } from "next/server";

type Context = { params: Promise<{ id: string }> };

async function toJsonResponse(res: Response) {
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

export async function GET(_req: NextRequest, ctx: Context) {
  const { id } = await ctx.params;
  const res = await fetch(API_ENDPOINTS.BLOGS.BY_ID(id), { cache: "no-store" });
  return toJsonResponse(res);
}

export async function PATCH(req: NextRequest, ctx: Context) {
  const { id } = await ctx.params;
  const body = await req.json();

  // Forward the session cookie — the backend guards updates behind the admin role
  const res = await fetch(API_ENDPOINTS.BLOGS.BY_ID(id), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") ?? "",
    },
    body: JSON.stringify(body),
  });

  return toJsonResponse(res);
}

export async function DELETE(req: NextRequest, ctx: Context) {
  const { id } = await ctx.params;

  const res = await fetch(API_ENDPOINTS.BLOGS.BY_ID(id), {
    method: "DELETE",
    headers: { cookie: req.headers.get("cookie") ?? "" },
  });

  return toJsonResponse(res);
}

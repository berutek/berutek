import { API_ENDPOINTS } from "@/src/services/api/endpoints";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { recaptchaToken, ...form } = body;

  if (!recaptchaToken) {
    return NextResponse.json({ error: "reCAPTCHA token missing" }, { status: 400 });
  }

  const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.NEXT_PUBLIC_RECAPTCHA_SECRET_KEY!,
      response: recaptchaToken,
    }),
  });

  const verify = await verifyRes.json();
  if (!verify.success) {
    return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 });
  }

  const leadRes = await fetch(`${API_ENDPOINTS.LEADS.CREATE}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });

  if (!leadRes.ok) {
    return NextResponse.json({ error: 'Failed to store lead' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

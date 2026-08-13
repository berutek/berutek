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
      secret: process.env.RECAPTCHA_SECRET_KEY!,
      response: recaptchaToken,
    }),
  });

  const verify = await verifyRes.json();
  if (!verify.success) {
    return NextResponse.json({ error: "reCAPTCHA verification failed" }, { status: 400 });
  }

  // TODO: send email or store submission
  console.log("Contact form submission:", form);

  return NextResponse.json({ ok: true });
}

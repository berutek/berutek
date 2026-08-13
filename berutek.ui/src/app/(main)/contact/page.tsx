"use client";

import { PhoneIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha-v2";

type Severity = "low" | "medium" | "high" | "urgent";

interface ContactForm {
  name: string;
  company: string;
  email: string;
  description: string;
  severity: Severity;
}

const SEVERITY_OPTIONS: { value: Severity; label: string; hint: string }[] = [
  { value: "low", label: "Low", hint: "Nice to have, no deadline pressure" },
  { value: "medium", label: "Medium", hint: "Important, flexible timeline" },
  { value: "high", label: "High", hint: "Business-critical, tight deadline" },
  { value: "urgent", label: "Urgent", hint: "Blocking operations, needs immediate attention" },
];

const INITIAL_FORM: ContactForm = {
  name: "",
  company: "",
  email: "",
  description: "",
  severity: "medium",
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(INITIAL_FORM);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!recaptchaToken) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setForm(INITIAL_FORM);
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } catch {
      setStatus("error");
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  }

  return (
    <main className="w-full max-w-5xl px-6 py-16 mx-auto">

      {/* Hero */}
      <section className="mb-16 text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
          Contact
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 leading-tight">
          Let's talk about your project.
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
          Fill out the form below and I'll get back to you within one business day.
          No sales team, no runround, just a direct conversation.
        </p>
      </section>

      {/* Form + Info */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* Contact form */}
        <div className="lg:col-span-2">
          {status === "sent" ? (
            <div className="p-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
              <span className="text-4xl text-zinc-400 dark:text-zinc-500 select-none">◈</span>
              <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                Message received.
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                I'll review your project details and follow up at{" "}
                <span className="font-mono text-zinc-700 dark:text-zinc-300">{form.email || "your email"}</span>{" "}
                within one business day.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                Send another message →
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-6"
            >
              {/* Name + Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Name" required>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className={inputClass}
                  />
                </Field>

                <Field label="Company">
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company (optional)"
                    className={inputClass}
                  />
                </Field>
              </div>

              {/* Email */}
              <Field label="Email" required>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                  className={inputClass}
                />
              </Field>

              {/* Description */}
              <Field label="Project description" required>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your project, goals, timeline, and any technical context that would help me understand the scope."
                  required
                  rows={5}
                  className={`${inputClass} resize-none`}
                />
              </Field>

              {/* Severity */}
              <Field label="Priority / severity">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SEVERITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, severity: opt.value }))}
                      title={opt.hint}
                      className={[
                        "px-3 py-2.5 rounded-lg border text-xs font-mono transition-colors text-left cursor-pointer",
                        form.severity === opt.value
                          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900"
                          : "border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500",
                      ].join(" ")}
                    >
                      <span className="block font-semibold mb-0.5 capitalize">{opt.label}</span>
                      <span className="block text-[10px] leading-tight opacity-70">{opt.hint}</span>
                    </button>
                  ))}
                </div>
              </Field>

              {status === "error" && (
                <p className="text-sm text-red-500 dark:text-red-400">
                  Something went wrong. Please try again or email me directly at giovanny@berutek.dev.
                </p>
              )}

              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                onChange={setRecaptchaToken}
                onExpired={() => setRecaptchaToken(null)}
              />

              <button
                type="submit"
                disabled={status === "sending" || !recaptchaToken}
                className="w-full px-6 py-3 rounded-lg bg-zinc-900 cursor-pointer text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
              Direct contact
            </p>
            <div className="space-y-3 text-sm">
              <a
                href="mailto:giovanny@berutek.dev"
                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <span className="text-zinc-400 dark:text-zinc-500 select-none">✉</span>
                giovanny@berutek.dev
              </a>
              <a
                href="https://wa.link/70dtua"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <PhoneIcon className="text-green-500 w-4 h-4" />
                Whatsapp
              </a>
              <a
                href="https://github.com/berutek"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <span className="text-zinc-400 dark:text-zinc-500 select-none">⬡</span>
                github.com/berutek
              </a>
              <a
                href="https://linkedin.com/in/berutek"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <span className="text-zinc-400 dark:text-zinc-500 select-none">⬢</span>
                linkedin.com/in/berutek
              </a>
            </div>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
              Book a call
            </p>
            <div className="space-y-3 text-sm">
              <a
                href="https://drive.berutek.dev/apps/calendar/appointment/mPjgXDb6Nkgq"
                target="_blank"
                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                <span className="text-zinc-400 dark:text-zinc-500 select-none">📅</span>
                30-min free scoping call
              </a>
              <hr className="border-zinc-200 dark:border-zinc-800" />
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
                Timezone
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Based in the Americas, typically available Mon–Fri, 8 AM–7 PM ET.
              </p>
            </div>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
              What to expect
            </p>
            <ul className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <li className="flex gap-2">
                <span className="text-zinc-300 dark:text-zinc-600 select-none">⊙</span>
                Reply within one business day
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-300 dark:text-zinc-600 select-none">◈</span>
                Free scoping call if there&apos;s a fit
              </li>
              <li className="flex gap-2">
                <span className="text-zinc-300 dark:text-zinc-600 select-none">∿</span>
                No obligation, no pressure
              </li>
            </ul>
          </div>
        </div>

      </section>

    </main>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        {label}
        {required && <span className="ml-1 text-zinc-400 dark:text-zinc-600">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent transition-shadow";

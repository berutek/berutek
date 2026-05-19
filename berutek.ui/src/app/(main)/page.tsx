const highlights = [
  {
    icon: "◈",
    title: "Full-Stack Development",
    description:
      "End-to-end web applications — from pixel-perfect React interfaces to robust Node.js backends. Shipped as complete, production-ready products.",
  },
  {
    icon: "☁",
    title: "Cloud & DevOps",
    description:
      "Container-based deployments on Google Cloud Platform with automated CI/CD pipelines. Infrastructure that scales without surprises.",
  },
  {
    icon: "⟳",
    title: "Automation & Integrations",
    description:
      "Custom scripts and API integrations that connect your tools, eliminate manual work, and keep your data accurate across platforms.",
  },
];

const differentiators = [
  {
    icon: "⊙",
    title: "Direct communication",
    description:
      "You work with me — not a project manager or a rotating team. Every decision goes through one accountable person.",
  },
  {
    icon: "⬡",
    title: "End-to-end ownership",
    description:
      "From database schema to deployment pipeline, I handle the full stack. No handoff gaps, no coordination overhead.",
  },
  {
    icon: "∿",
    title: "5+ years in production",
    description:
      "Not portfolio projects — real systems handling real users. I've seen what breaks at scale and design to avoid it.",
  },
];

export default function Home() {
  return (
    <main className="w-full max-w-5xl px-6 py-16 mx-auto">

      {/* Hero */}
      <section className="mb-24 text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
          Software Engineering Studio
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 leading-tight">
          We build the software&nbsp;behind&nbsp;your business.
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
          Berutek is a boutique development studio run by Giovanny Berutek — a full-stack engineer
          and systems specialist with 5+ years building production software for startups and small
          teams who need things done right.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a
            href="/signup"
            className="px-5 py-2.5 rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Hire me
          </a>
          <a
            href="/services"
            className="px-5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            See our services →
          </a>
        </div>
      </section>

      {/* About */}
      <section className="mb-20">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-8">
          About
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              One studio. One engineer. Full ownership.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-4">
              Berutek was founded on the belief that small teams deserve the same quality of
              engineering as enterprise companies — without the overhead, the slow timelines, or the
              communication gaps that come from working with large agencies.
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              Every project is handled personally by Giovanny, from the first conversation to the
              final deployment. That means faster decisions, cleaner code, and software that actually
              fits the problem it was built to solve.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
              Founder
            </p>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Giovanny Berutek
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Full-Stack Developer &amp; Systems Engineer
            </p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {["TypeScript", "React", "Node.js", "GCP", "Linux", "Docker"].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
            <a
              href="https://github.com/berutek"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              github.com/berutek →
            </a>
          </div>
        </div>
      </section>

      {/* Service highlights */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            What we do
          </p>
          <a
            href="/services"
            className="text-xs font-mono text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
          >
            View all 8 services →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <span className="text-2xl text-zinc-400 dark:text-zinc-500 select-none">
                {item.icon}
              </span>
              <h3 className="mt-3 mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Berutek */}
      <section className="mb-20">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-8">
          Why Berutek
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            >
              <span className="text-2xl text-zinc-400 dark:text-zinc-500 select-none">
                {item.icon}
              </span>
              <h3 className="mt-3 mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {item.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-10 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
          Ready to build something?
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto text-sm">
          Whether you have a clear spec or just an idea, I can help you scope it, build it, and ship it.
        </p>
        <a
          href="/signup"
          className="inline-block px-6 py-3 rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Get in touch
        </a>
      </section>

    </main>
  );
}

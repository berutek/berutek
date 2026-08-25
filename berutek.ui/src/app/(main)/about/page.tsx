import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Giovanny Bernal and Berutek — a boutique software studio built on direct communication, end-to-end ownership, and production-grade engineering for startups and small teams.",
  openGraph: {
    title: "About Berutek",
    description:
      "One engineer, full accountability. The story behind Berutek and how Giovanny Bernal builds production software for small teams.",
    url: "https://berutek.dev/about",
  },
};

const values = [
  {
    icon: "⊙",
    title: "Ownership over handoffs",
    description:
      "Every project is handled by one person, end-to-end. No rotating team, no gaps in context, no \"that's the other department's problem.\"",
  },
  {
    icon: "◈",
    title: "Quality by default",
    description:
      "Clean architecture, typed codebases, and deployment pipelines that work. I don't cut corners, I just cut the overhead that comes with large teams.",
  },
  {
    icon: "∿",
    title: "Built for the long run",
    description:
      "Code I ship is code I'd maintain. Every decision is made with future you in mind, not just the demo deadline.",
  },
];

const stackCategories = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Java", "Bash"],
  },
  {
    label: "Frontend",
    items: ["Next.js", "React", "Tailwind CSS"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express", "NestJS", "Spring Boot"],
  },
  {
    label: "Databases",
    items: ["MySQL", "MongoDB", "Redis", "PostgreSQL"],
  },
  {
    label: "Infrastructure",
    items: ["Docker", "GCP", "Cloud Run", "Cloud Functions", "Linux", "Nginx"],
  },
  {
    label: "Tooling",
    items: ["Git", "GitHub Actions", "Postman", "Figma"],
  },
];

const stats = [
  { value: "3+", label: "Years in production" },
  { value: "4", label: "Core services offered" },
  { value: "1", label: "Engineer, fully accountable" },
  { value: "∞", label: "Commitment to quality" },
];

export default function AboutPage() {
  return (
    <main className="w-full max-w-5xl px-6 py-16 mx-auto">

      {/* Hero */}
      <section className="mb-24 text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
          About Berutek
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 leading-tight">
          One engineer. Full accountability.
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
          Berutek is a boutique software studio run by Giovanny Bernal, a full-stack engineer and
          systems specialist dedicated to building production-grade software for startups and small
          teams who can't afford to get it wrong.
        </p>
      </section>

      {/* Story */}
      <section className="mb-20">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-8">
          The story
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-5">
              Built from frustration with the status quo.
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
              I started Berutek after seeing the same pattern repeat itself: small companies hiring
              large agencies, losing weeks to miscommunication, and ending up with software that
              worked in the demo but broke in production.
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
              The problem isn't always skill, it's structure. When too many hands touch the
              same project, things fall between the cracks. Berutek exists to fix that: one engineer
              who owns the entire stack and is directly accountable for the outcome.
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Over 3 years, I've built full-stack web apps, managed Linux servers, designed database
              schemas, wired up cloud infrastructure, and shipped automation pipelines that saved
              teams hours every week. Every project made the next one sharper.
            </p>
          </div>

          {/* Founder card */}
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-5">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
                Founder
              </p>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
                Giovanny Bernal
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Full-Stack Developer - Systems Engineer
              </p>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <p>⊕  3+ years shipping production software</p>
              <p>☁  Cloud infrastructure on Google Cloud Platform</p>
              <p>⬢  Linux systems administration - hardening</p>
              <p>∿  Automation, integrations, and API design</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {["TypeScript", "React", "Node.js", "GCP", "Linux", "Docker", "Python"].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <a
                href="https://github.com/berutek"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                github.com/berutek →
              </a>
              <a
                href="mailto:giovanny@berutek.dev"
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                giovanny@berutek.dev →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center"
            >
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                {stat.value}
              </p>
              <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mb-20">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-8">
          How I work
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {values.map((item) => (
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

      {/* Tech stack */}
      <section className="mb-20">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-8">
          Tech stack
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stackCategories.map((category) => (
            <div key={category.label}>
              <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mb-3">
                {category.label}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 rounded-lg text-xs font-mono border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-10 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
          Let's build something together.
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-md mx-auto text-sm">
          Whether you have a full spec or just an idea on a napkin, I can help you scope it,
          build it, and ship it, without the overhead of a full agency.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="/contact"
            className="px-6 py-3 rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Hire me
          </a>
          <a
            href="/services"
            className="px-6 py-3 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            See our services →
          </a>
        </div>
      </section>

    </main>
  );
}

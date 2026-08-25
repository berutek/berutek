import type { Metadata } from "next";
import GetInTouch from "@/src/components/getInTouch";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-stack web development, backend APIs, cloud infrastructure on GCP, Linux administration, database design, automation, custom email servers, and CRM integrations by Giovanny Bernal.",
  openGraph: {
    title: "Services — Berutek",
    description:
      "8 freelance services: full-stack development, cloud infrastructure, Linux administration, database design, automation, and more. TypeScript, React, Node.js, GCP, Docker.",
    url: "https://berutek.dev/services",
  },
};

const services = [
  {
    icon: "◈",
    title: "Full-Stack Web Development",
    description:
      "End-to-end web applications built with Next.js, React, and Node.js. From responsive UIs to robust server-side logic, delivered as a complete, production-ready product.",
    tags: ["Next.js", "React", "TypeScript", "Node.js"],
  },
  {
    icon: "⬡",
    title: "Backend API Development",
    description:
      "Scalable REST APIs and microservices using Node.js/Express or Java/Spring Boot. Designed with clean architecture, proper auth flows, and real-time capabilities via WebSockets.",
    tags: ["Node.js", "Express", "Java", "Spring Boot", "WebSockets"],
  },
  {
    icon: "☁",
    title: "Cloud Infrastructure & DevOps",
    description:
      "Container-based deployments on Google Cloud Platform using Cloud Run and Cloud Functions. CI/CD pipelines, scheduled jobs, and infrastructure that scales without surprises.",
    tags: ["Docker", "GCP", "Cloud Run", "Cloud Functions"],
  },
  {
    icon: "⬢",
    title: "Linux Systems Administration",
    description:
      "3+ years managing Linux environments. Server setup, hardening, SSH/SFTP configuration, process management, and long-term system reliability for self-hosted or cloud workloads.",
    tags: ["Linux", "SSH", "SFTP", "Bash", "System Hardening"],
  },
  {
    icon: "⊕",
    title: "Database Design & Management",
    description:
      "Schema design, query optimization, and ongoing management for relational and document databases. Built to handle growth without painful migrations down the road.",
    tags: ["MySQL", "MongoDB", "Schema Design", "Optimization"],
  },
  {
    icon: "∿",
    title: "Automation & Integrations",
    description:
      "Custom automation scripts and third-party API integrations, from Google Workspace and CRM platforms to email pipelines and scheduled data workflows.",
    tags: ["Python", "Google APIs", "OAuth 2.0", "Automation"],
  },
  {
    icon: "✉",
    title: "Custom Email Server Setup",
    description:
      "Self-hosted SMTP/IMAP mail servers configured from scratch. Deliverability tuning, SPF/DKIM/DMARC records, and ongoing maintenance for complete ownership of your email stack.",
    tags: ["SMTP", "IMAP", "DNS", "Email Deliverability"],
  },
  {
    icon: "⟳",
    title: "CRM & Workflow Integrations",
    description:
      "Bridge your tools together. From Housecall Pro and Google Sheets to custom dashboards, I build the glue layer that keeps your data accurate and your team unblocked.",
    tags: ["CRM APIs", "Google Sheets", "Webhooks", "Pipelines"],
  },
];

const stack = [
  "TypeScript", "JavaScript", "Python", "Java",
  "Next.js", "React", "Node.js", "Express", "Spring Boot",
  "MySQL", "MongoDB", "postgreSQL",
  "Docker", "GCP", "Linux",
];

export default function ServicesPage() {
  return (
    <main className="w-full max-w-5xl px-6 py-16 mx-auto">

      {/* Hero */}
      <section className="mb-20 text-center">
        <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
          Freelance Services
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 leading-tight">
          Scalable, secure, and elegant solutions
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg">
          I'm Giovanny, a full-stack developer and systems engineer with 3+ years building
          production software. I work with startups and small teams who need things done right,
          not just done fast.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a
            href="/contact"
            className="px-5 py-2.5 rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Hire me
          </a>
          <a
            href="/work"
            className="px-5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            View my work <ArrowRightIcon className="inline-block w-4 h-4 ml-1" />
          </a>
        </div>
      </section>

      {/* Services grid */}
      <section className="mb-20">
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-8">
          What I offer
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="group p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
            >
              <span className="text-2xl text-zinc-400 dark:text-zinc-500 select-none">
                {service.icon}
              </span>
              <h3 className="mt-3 mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {service.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-20">
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">
          Tech stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1.5 rounded-lg text-sm font-mono border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-900"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <GetInTouch />

    </main>
  );
}

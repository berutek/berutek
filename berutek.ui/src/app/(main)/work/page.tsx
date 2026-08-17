import type { Metadata } from "next";
import GetInTouch from "@/src/components/getInTouch";
import ArrowRightIcon from "@heroicons/react/24/solid/esm/ArrowRightIcon";
import { ProjectCard } from "@/src/components/work/ProjectCard";
import type { Project } from "@/src/components/work/ProjectDetailsModal";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Projects built by Berutek: BeruDrive (self-hosted cloud storage), BeruPortal (server management portal), BeruAI (AI automation workflows), and more production systems.",
  openGraph: {
    title: "Work — Berutek",
    description:
      "Real production systems built by Giovanny Bernal: self-hosted cloud storage, server management portals, and AI automation workflows.",
    url: "https://berutek.dev/work",
  },
};

export default function ProjectsPage() {

  const projects: Project[] = [
    {
      icon: "BeruDrive.png",
      title: "BeruDrive",
      description: "Self-hosted cloud storage built on NextCloud — private, encrypted, and fully under BeruTeK control.",
      link: "https://drive.berutek.dev",
      status: "live",
      year: "2025",
      technologies: ["NextCloud", "Docker", "Nginx", "Cloudflare", "Linux", "PHP", "PostgreSQL", "Authelia"],
      details: "A fully self-hosted cloud storage solution built on NextCloud and deployed on a personal server using Docker. Provides private, encrypted file storage and sharing without any dependency on third-party cloud providers like Google Drive or Dropbox.",
      highlights: [
        "End-to-end encrypted file storage and sharing",
        "Custom domain with automatic SSL via Let's Encrypt and Cloudflare",
        "Docker-based deployment for zero-downtime updates",
        "Granular user management and folder-level permissions",
        "WebDAV and mobile sync client support",
      ],
      history: "Built as a response to privacy concerns with mainstream cloud providers. Deployed on an existing home server, using Docker Compose to manage the NextCloud stack alongside its MariaDB database. Cloudflare handles DNS and proxying, while Let's Encrypt provides TLS certificates automatically.",
    },
    {
      icon: "BeruServer.png",
      title: "BeruServer",
      description: "Personal server management portal running on Fedora Linux with Cockpit — the backbone of all Berutek infrastructure.",
      link: "https://server.berutek.dev",
      status: "live",
      year: "2024",
      technologies: ["Fedora Linux", "Cockpit", "Nginx", "Docker", "FTP", "SSH", "CI/CD"],
      details: "A hardened personal server portal built on Fedora Linux with Cockpit providing the web-based management interface. Serves as the central infrastructure hub for hosting all Berutek services, with strict security configurations across SSH, HTTP, and FTP layers.",
      highlights: [
        "Web-based resource monitoring and process management via Cockpit",
        "Key-based SSH authentication only — password auth disabled",
        "Nginx reverse proxy routing all services through a single entry point",
        "Intrusion prevention with Fail2Ban and UFW firewall rules",
        "Docker containers for service isolation and easy rollbacks",
      ],
      history: "Started when the number of self-hosted services grew beyond what was manageable over raw SSH. Fedora was chosen for its up-to-date packages and SELinux support. Cockpit was added to provide a browser-based dashboard without opening additional attack surface. Security hardening was applied iteratively, informed by real-world intrusion attempts logged by Fail2Ban.",
    },
    {
      icon: "BeruAI.png",
      title: "BeruAI",
      description: "Self-hosted n8n instance powering AI automation workflows that connect services and eliminate repetitive manual work.",
      link: "https://n8n.berutek.dev",
      status: "live",
      year: "2026",
      technologies: ["n8n", "Docker", "Claude AI", "REST APIs", "Webhooks", "PostgreSQL"],
      details: "A self-hosted n8n automation platform integrated with Claude AI and various third-party services. Used to design, run, and monitor multi-step workflows that automate repetitive tasks across the Berutek ecosystem — from data processing to AI-assisted content pipelines.",
      highlights: [
        "Visual workflow builder with branching logic and error handling",
        "AI-powered document processing and summarization via Claude",
        "Webhook-triggered automations for real-time event responses",
        "REST API integrations with third-party SaaS tools",
        "PostgreSQL backend for persistent workflow execution history",
      ],
      history: "Built to automate the growing number of repetitive tasks across Berutek's internal tools. n8n was chosen over hosted alternatives like Zapier for its self-hosted nature, transparent pricing, and extensible node system. Claude AI was integrated as the reasoning layer for tasks that require understanding unstructured text — summarization, classification, and drafting.",
    },
    {
      icon: "berutek.icon.webp",
      title: "BeruPortal",
      description: "Self-hosted portal for managing and monitoring Berutek's infrastructure and services.",
      link: "https://portal.berutek.dev",
      status: "in-progress",
      year: "2026",
      technologies: ["n8n", "Docker", "Claude AI", "REST APIs", "Webhooks", "PostgreSQL"],
      details: "A self-hosted n8n automation platform integrated with Claude AI and various third-party services. Used to design, run, and monitor multi-step workflows that automate repetitive tasks across the Berutek ecosystem — from data processing to AI-assisted content pipelines.",
      highlights: [
        "Visual workflow builder with branching logic and error handling",
        "AI-powered document processing and summarization via Claude",
        "Webhook-triggered automations for real-time event responses",
        "REST API integrations with third-party SaaS tools",
        "PostgreSQL backend for persistent workflow execution history",
      ],
      history: "Built to automate the growing number of repetitive tasks across Berutek's internal tools. n8n was chosen over hosted alternatives like Zapier for its self-hosted nature, transparent pricing, and extensible node system. Claude AI was integrated as the reasoning layer for tasks that require understanding unstructured text — summarization, classification, and drafting.",
    },
  ];

  return (
    <main className="w-full max-w-5xl px-6 py-16 mx-auto">
      <section className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 leading-tight text-center">
          My Work
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg text-center mb-12">
          Here are some of the projects I've worked on recently. I'm always looking for new
          opportunities to collaborate and create amazing things, so if you have an idea or just want
          to chat, feel free to reach out!
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a
            href="/contact"
            className="px-5 py-2.5 rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Hire me
          </a>
          <a
            href="/about"
            className="px-5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            About me <ArrowRightIcon className="inline-block w-4 h-4 ml-1" />
          </a>
        </div>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-20">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
      <GetInTouch />
    </main>
  );
}
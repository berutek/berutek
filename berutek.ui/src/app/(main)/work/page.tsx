import type { Metadata } from "next";
import GetInTouch from "@/src/components/getInTouch";
import ArrowRightIcon from "@heroicons/react/24/solid/esm/ArrowRightIcon";

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

  const projects = [
    {
      title: "BeruDrive - Self-hosted cloud storage",
      description: "Developed a self-hosted cloud storage solution using NextCloud. The application allows users to store, manage, and share files securely.",
      link: "https://drive.berutek.dev"
    },
    {
      title: "BeruPortal - Personal server portal management",
      description: "Created a personal server portal management system using Fedora & Clockpit. The portal provides an intuitive interface for managing server resources, monitoring performance, deploying applications and most impoortant high security for ssh, http & ftp servers.",
      link: "https://portal.berutek.dev"
    },
    {
      title: "BeruAI - AI Automation workflows",
      description: "Developed AI-powered automation workflows to streamline repetitive tasks and improve efficiency. The solution integrates with existing systems to provide seamless automation capabilities.",
      link: "https://n8n.berutek.dev"
    }
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
          <div className="flex flex-col gap-3 group p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors" key={index}>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              {project.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {project.description}
            </p>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:underline mt-auto"
            >
              View my work →
            </a>
          </div>
        ))}
      </div>
      <GetInTouch />
    </main>
  );
}
'use client';

import type { Metadata } from "next";
import GetInTouch from "@/src/components/getInTouch";
import { BlogTimeline } from "@/src/components/blog/BlogTimeline";
import type { BlogPost } from "@/src/components/blog/DetailsModal";
import Nav from "@/src/components/layout/nav";


export default function BlogPage() {

  const posts: BlogPost[] = [
    {
      title: "Kicking off the Berutek blog",
      date: "2026-08-17",
      description:
        "Why I'm starting a weekly log: keeping myself honest about progress and sharing what I learn running my own infrastructure.",
      tags: ["meta", "writing"],
      category: "thought",
      content: `
        <p>I've been building Berutek's ecosystem for a while now — <strong>BeruDrive</strong>, <strong>BeruServer</strong>, <strong>BeruAI</strong> — and most of what I learn along the way disappears into commit messages and shell history. This blog is my attempt to fix that.</p>
        <p>The plan is simple: one post a week. Sometimes it will be a progress update on whatever I'm building, sometimes a longer thought about self-hosting, automation, or the tools I use. Nothing polished, just honest notes from the workshop.</p>
        <p>The timeline format you're looking at is intentional — newest at the top, history flowing down. Double-click any panel to read the full post.</p>
      `,
    },
    {
      title: "BeruPortal: first working prototype",
      date: "2026-08-10",
      description:
        "The service management portal now talks to the NestJS backend — CRUD for services, session handling, and a first pass at the dashboard.",
      tags: ["beruportal", "nestjs", "nextjs"],
      category: "update",
      content: `
        <p>This week BeruPortal went from an empty repo to a working prototype. The NestJS backend now exposes a service module with full CRUD operations and session management, and the Next.js frontend can authenticate against it.</p>
        <h2>The tricky part</h2>
        <p>Getting the session configuration right behind the Nginx reverse proxy — <code>cookies</code>, <code>trust proxy</code> settings, and CORS all had to line up before login would survive a page refresh.</p>
        <p>Next up: wiring the dashboard to live server metrics so I can finally retire a few of my ad-hoc SSH check scripts.</p>
      `,
    },
  ];

  return (
    <main className="w-full max-w-5xl px-6 py-16 mx-auto">
      <section className="mb-12 text-center relative">
        <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 leading-tight text-center">
          Blog
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-lg text-center">
          Weekly updates and thoughts, what I'm building, what broke, and what I learned along the
          way.
        </p>
      </section>
      <div className="mb-20">
        <BlogTimeline posts={posts} />
      </div>
      <GetInTouch />
    </main>
  );
}

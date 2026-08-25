'use client';

import { useEffect, useState } from "react";
import GetInTouch from "@/src/components/getInTouch";
import { BlogTimeline } from "@/src/components/blog/BlogTimeline";
import type { BlogPost } from "@/src/components/blog/DetailsModal";
import { fetchPosts } from "@services/api/blogs";


export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts()
      .then(setPosts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load posts'));
  }, []);

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
        {error ? (
          <p className="text-sm text-center text-red-600 dark:text-red-400" role="alert">
            Couldn't load posts: {error}
          </p>
        ) : posts === null ? (
          <p className="text-sm text-center font-mono text-zinc-400 dark:text-zinc-500">
            Loading posts…
          </p>
        ) : (
          <>
            {posts.length === 0 && (
              <p className="mb-10 text-sm text-center font-mono text-zinc-400 dark:text-zinc-500">
                No posts yet — check back soon.
              </p>
            )}
            {/* Rendered even when empty so admins still get the create button */}
            <BlogTimeline posts={posts} />
          </>
        )}
      </div>
      <GetInTouch />
    </main>
  );
}

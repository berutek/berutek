import type { BlogPost } from '@/src/components/blog/DetailsModal';

/** Blog record as returned by the NestJS backend (proxied through /api/blog) */
export interface ApiBlog {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[] | null;
  category: BlogPost['category'] | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/** Fields an admin can set when creating or editing a post */
export interface BlogPayload {
  title: string;
  description: string;
  content: string;
  tags: string[];
  category?: BlogPost['category'];
}

export function mapBlogToPost(blog: ApiBlog): BlogPost {
  return {
    id: blog.id,
    title: blog.title,
    description: blog.description,
    content: blog.content,
    tags: blog.tags ?? [],
    category: blog.category ?? undefined,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
  };
}

async function handle<T>(res: Response): Promise<T> {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      (Array.isArray(body?.details) && body.details.map((d: { message: string }) => d.message).join(', ')) ||
      body?.message ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body as T;
}

export async function fetchPosts(): Promise<BlogPost[]> {
  const blogs = await handle<ApiBlog[]>(await fetch('/api/blog', { cache: 'no-store' }));
  return blogs.map(mapBlogToPost);
}

export async function createPost(payload: BlogPayload): Promise<BlogPost> {
  const blog = await handle<ApiBlog>(
    await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );
  return mapBlogToPost(blog);
}

export async function updatePost(id: string, payload: BlogPayload): Promise<BlogPost> {
  const blog = await handle<ApiBlog>(
    await fetch(`/api/blog/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
  );
  return mapBlogToPost(blog);
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `Request failed (${res.status})`);
  }
}

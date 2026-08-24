import { isAxiosError } from 'axios';
import type { BlogPost } from '@/src/components/blog/DetailsModal';
import apiClient from './client';
import { API_ENDPOINTS } from './endpoints';

/** Blog record as returned by the NestJS backend */
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

function toApiError(err: unknown): Error {
  if (isAxiosError(err)) {
    const body = err.response?.data;
    const message =
      (Array.isArray(body?.details) && body.details.map((d: { message: string }) => d.message).join(', ')) ||
      body?.message ||
      `Request failed (${err.response?.status ?? 'network error'})`;
    return new Error(message);
  }
  return err instanceof Error ? err : new Error('Request failed');
}

// Requests go straight to the backend (withCredentials on the axios client),
// so the session cookie is sent to the API host and admin guards can see it.
async function request<T>(fn: () => Promise<{ data: T }>): Promise<T> {
  try {
    const { data } = await fn();
    return data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function fetchPosts(): Promise<BlogPost[]> {
  const blogs = await request<ApiBlog[]>(() => apiClient.getInstance().get(API_ENDPOINTS.BLOGS.LIST));
  return blogs.map(mapBlogToPost);
}

export async function createPost(payload: BlogPayload): Promise<BlogPost> {
  const blog = await request<ApiBlog>(() => apiClient.getInstance().post(API_ENDPOINTS.BLOGS.LIST, payload));
  return mapBlogToPost(blog);
}

export async function updatePost(id: string, payload: BlogPayload): Promise<BlogPost> {
  const blog = await request<ApiBlog>(() => apiClient.getInstance().patch(API_ENDPOINTS.BLOGS.BY_ID(id), payload));
  return mapBlogToPost(blog);
}

export async function deletePost(id: string): Promise<void> {
  await request(() => apiClient.getInstance().delete(API_ENDPOINTS.BLOGS.BY_ID(id)));
}

import z from "zod";

export const createBlogSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().min(1, "Description is required").max(255),
    content: z.string().min(1, "Content is required"),
    tags: z.array(z.string().min(1).max(50)).max(20).default([]),
    category: z.enum(['update', 'thought', 'release']).optional(),
}).required({ title: true, description: true, content: true });

export type CreateBlogDto = z.infer<typeof createBlogSchema>;

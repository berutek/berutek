import z from "zod";

export const updateBlogSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    description: z.string().min(1).max(255).optional(),
    content: z.string().min(1).optional(),
    tags: z.array(z.string().min(1).max(50)).max(20).optional(),
    category: z.enum(['update', 'thought', 'release']).nullable().optional(),
});

export type UpdateBlogDto = z.infer<typeof updateBlogSchema>;

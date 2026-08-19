import z from "zod";

export const updateServiceSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    tags: z.array(z.string().min(1).regex(/^[^^,]+$/, "Tags cannot contain '^' or ','")).optional(),
    icon: z.string().optional(),
});

export type UpdateServiceDto = z.infer<typeof updateServiceSchema>;

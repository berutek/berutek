import z from "zod";

export const createServiceSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    tags: z.array(z.string().min(1).regex(/^[^^,]+$/, "Tags cannot contain '^' or ','")).default([]),
    icon: z.string().optional(),
}).required({ name: true });

export type CreateServiceDto = z.infer<typeof createServiceSchema>;

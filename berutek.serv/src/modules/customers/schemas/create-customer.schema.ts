import z from "zod";

export const createCustomerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    companyName: z.string().optional(),
    email: z.email("Invalid email format"),
    phone: z.string().optional(),
    address: z.string().optional(),
}).required({ name: true, email: true });

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;

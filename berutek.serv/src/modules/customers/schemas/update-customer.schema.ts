import z from "zod";

export const updateCustomerSchema = z.object({
    name: z.string().min(1).optional(),
    companyName: z.string().optional(),
    email: z.email("Invalid email format").optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
});

export type UpdateCustomerDto = z.infer<typeof updateCustomerSchema>;

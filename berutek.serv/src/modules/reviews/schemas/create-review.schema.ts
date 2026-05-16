import z from "zod";

export const createReviewSchema = z.object({
    customerId: z.string().uuid("customerId must be a valid UUID"),
    rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
    comment: z.string().optional(),
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;

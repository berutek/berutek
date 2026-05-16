import z from "zod";

export const updateReviewSchema = z.object({
    rating: z.number().int().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").optional(),
    comment: z.string().optional(),
});

export type UpdateReviewDto = z.infer<typeof updateReviewSchema>;

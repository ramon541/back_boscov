import z from "zod";

const reviewSchema = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  movieId: z.number().int(),
  rating: z.number().min(0).max(10),
  comment: z.string().optional(),
});

export default reviewSchema;

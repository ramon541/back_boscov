import z from "zod";

const reviewSchema = z.object({
  id: z.number().int().optional(),
  userId: z.number().int(),
  movieId: z.number().int(),
  rating: z
    .number()
    .min(0, "A nota mínima é 0")
    .max(5, "A nota máxima é 5")
    .refine((val) => val * 2 === Math.floor(val * 2), {
      message: "A nota deve estar em passos de 0.5 (ex: 3.5, 4.0, 4.5)",
    }),
  comment: z.string().nullable().optional(),
});

export interface IReview extends z.infer<typeof reviewSchema> {}

export default reviewSchema;

import z from "zod";

const movieSchema = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  director: z.string(),
  releaseYear: z.date(),
  genreId: z.number().int(),
  duration: z.string(),
  production: z.string().optional(),
  classification: z.number().int(),
  poster: z.string().url().optional(),
});

export interface IMovie extends z.infer<typeof movieSchema> {}

export default movieSchema;

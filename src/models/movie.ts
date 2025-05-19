import z from "zod";

export const MovieClassification = z.enum([
  "C_L",
  "C_10",
  "C_12",
  "C_14",
  "C_16",
  "C_18",
]);

const movieSchema = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  director: z.string(),
  releaseYear: z.string(),
  duration: z.string(),
  production: z.string(),
  classification: MovieClassification,
  poster: z.string().url().nullable().optional(),
});

export interface IMovie extends z.infer<typeof movieSchema> {}

export default movieSchema;

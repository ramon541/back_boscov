import z from 'zod';

const genreMovieSchema = z.object({
    id: z.number().int().optional(),
    genreId: z.number().int(),
    movieId: z.number().int(),
});

export interface IGenreMovie extends z.infer<typeof genreMovieSchema> {}

export default genreMovieSchema;

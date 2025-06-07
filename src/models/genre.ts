import z from 'zod';

const genreSchema = z.object({
    id: z.number().int().optional(),
    description: z
        .string()
        .min(3, 'A descrição deve ter pelo menos 3 caracteres')
        .max(50, 'A descrição deve ter no máximo 50 caracteres'),
});

export interface IGenre extends z.infer<typeof genreSchema> {}

export default genreSchema;

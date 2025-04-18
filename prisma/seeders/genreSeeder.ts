import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedGenres() {
  try {
    // Limpar gêneros existentes
    await prisma.genre.deleteMany();
    
    // Reset da sequence de ID (específico para SQLite)
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='genre'`;

    // Criar gêneros de filmes
    const genres = [
      { description: 'Ação' },
      { description: 'Aventura' },
      { description: 'Comédia' },
      { description: 'Drama' },
      { description: 'Ficção Científica' },
      { description: 'Terror' },
      { description: 'Romance' },
      { description: 'Animação' },
      { description: 'Documentário' },
      { description: 'Suspense' }
    ];

    for (const genre of genres) {
      await prisma.genre.create({
        data: genre
      });
    }

    console.log('✅ Gêneros criados com sucesso');
  } catch (error) {
    console.error('Erro ao criar gêneros:', error);
  }
}

export { seedGenres };
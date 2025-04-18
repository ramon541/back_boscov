import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedReviews() {
  try {
    // Limpar avaliações existentes
    await prisma.review.deleteMany();
    
    // Reset da sequence de ID (específico para SQLite)
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='review'`;

    // Criar avaliações de filmes
    const reviews = [
      {
        userId: 1, // Admin User
        movieId: 1, // Interestelar
        rating: 4.8,
        comment: 'Uma obra-prima do cinema de ficção científica. A cinematografia e a história são impressionantes.'
      },
      {
        userId: 2, // Common User
        movieId: 1, // Interestelar
        rating: 4.5,
        comment: 'Filme incrível, mas um pouco confuso em algumas partes.'
      },
      {
        userId: 3, // John Doe
        movieId: 2, // O Poderoso Chefão
        rating: 5.0,
        comment: 'Um clássico atemporal. Uma das melhores performances de Marlon Brando.'
      },
      {
        userId: 4, // Jane Smith
        movieId: 2, // O Poderoso Chefão
        rating: 4.7,
        comment: 'A cinematografia, a atuação e a história são impecáveis.'
      },
      {
        userId: 1, // Admin User
        movieId: 3, // Vingadores: Ultimato
        rating: 4.6,
        comment: 'Um encerramento perfeito para a saga do infinito da Marvel.'
      },
      {
        userId: 3, // John Doe
        movieId: 3, // Vingadores: Ultimato
        rating: 4.2,
        comment: 'Ótimo filme, mas achei que algumas partes foram apressadas.'
      },
      {
        userId: 2, // Common User
        movieId: 4, // Toy Story
        rating: 4.9,
        comment: 'Um filme que revolucionou a animação e ainda é incrível até hoje.'
      },
      {
        userId: 4, // Jane Smith
        movieId: 5, // Titanic
        rating: 4.4,
        comment: 'Um romance emocionante com efeitos visuais impressionantes para sua época.'
      }
    ];

    for (const review of reviews) {
      await prisma.review.create({
        data: review
      });
    }

    console.log('✅ Avaliações criadas com sucesso');
  } catch (error) {
    console.error('Erro ao criar avaliações:', error);
  }
}

export { seedReviews };
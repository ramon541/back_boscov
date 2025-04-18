import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMovies() {
  try {
    // Limpar filmes e relações existentes
    await prisma.genreMovie.deleteMany();
    await prisma.review.deleteMany();
    await prisma.movie.deleteMany();
    
    // Reset da sequence de ID (específico para SQLite)
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='movie'`;
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='genreMovie'`;

    // Criar filmes com seus gêneros primários
    const movies = [
      { 
        name: 'Interestelar', 
        director: 'Christopher Nolan', 
        releaseYear: new Date('2014-11-07'),
        genreId: 5, // Ficção Científica
        duration: '2h 49m',
        production: 'Paramount Pictures',
        classification: 12,
        poster: 'interstellar.jpg'
      },
      { 
        name: 'O Poderoso Chefão', 
        director: 'Francis Ford Coppola', 
        releaseYear: new Date('1972-03-24'),
        genreId: 4, // Drama
        duration: '2h 55m',
        production: 'Paramount Pictures',
        classification: 14,
        poster: 'godfather.jpg'
      },
      { 
        name: 'Vingadores: Ultimato', 
        director: 'Anthony e Joe Russo', 
        releaseYear: new Date('2019-04-26'),
        genreId: 1, // Ação
        duration: '3h 1m',
        production: 'Marvel Studios',
        classification: 12,
        poster: 'avengers_endgame.jpg'
      },
      { 
        name: 'Toy Story', 
        director: 'John Lasseter', 
        releaseYear: new Date('1995-11-22'),
        genreId: 8, // Animação
        duration: '1h 21m',
        production: 'Pixar Animation Studios',
        classification: 0,
        poster: 'toy_story.jpg'
      },
      { 
        name: 'Titanic', 
        director: 'James Cameron', 
        releaseYear: new Date('1997-12-19'),
        genreId: 7, // Romance
        duration: '3h 14m',
        production: '20th Century Fox',
        classification: 12,
        poster: 'titanic.jpg'
      }
    ];

    // Criar os filmes
    for (const movie of movies) {
      await prisma.movie.create({
        data: movie
      });
    }

    // Adicionar gêneros secundários aos filmes
    const genreMovies = [
      { movieId: 1, genreId: 2 }, // Interestelar - Aventura
      { movieId: 1, genreId: 4 }, // Interestelar - Drama
      { movieId: 2, genreId: 10 }, // O Poderoso Chefão - Suspense
      { movieId: 3, genreId: 2 }, // Vingadores: Ultimato - Aventura
      { movieId: 3, genreId: 5 }, // Vingadores: Ultimato - Ficção Científica
      { movieId: 4, genreId: 3 }, // Toy Story - Comédia
      { movieId: 4, genreId: 2 }, // Toy Story - Aventura
      { movieId: 5, genreId: 4 }  // Titanic - Drama
    ];

    for (const relation of genreMovies) {
      await prisma.genreMovie.create({
        data: relation
      });
    }

    console.log('✅ Filmes e relações de gêneros criados com sucesso');
  } catch (error) {
    console.error('Erro ao criar filmes:', error);
  }
}

export { seedMovies };
import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeders/userSeeder';
import { seedGenres } from './seeders/genreSeeder';
import { seedMovies } from './seeders/movieSeeder';
import { seedReviews } from './seeders/reviewSeeder';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Iniciando processo de seed do banco de dados...');
    
    // Executa os seeders em sequência (a ordem é importante por causa das relações)
    await seedUsers();
    await seedGenres();
    await seedMovies();
    await seedReviews();
    
    console.log('✅ Processo de seed concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o processo de seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
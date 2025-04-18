import { PrismaClient, UserType } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    // Limpar usuários existentes
    await prisma.user.deleteMany();
    
    // Reset da sequence de ID (específico para SQLite)
    await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name='user'`;

    // Criar usuários de teste
    const passwordHash = await hash('password123', 10);
    
    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: passwordHash,
        nickname: 'admin',
        birthDate: new Date('1990-01-01'),
        userType: UserType.A,
        active: true
      },
      {
        name: 'Common User',
        email: 'user@example.com',
        password: passwordHash,
        nickname: 'user1',
        birthDate: new Date('1995-05-15'),
        userType: UserType.C,
        active: true
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: passwordHash,
        nickname: 'johnny',
        birthDate: new Date('1988-11-23'),
        userType: UserType.C,
        active: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: passwordHash,
        nickname: 'jane_s',
        birthDate: new Date('1992-07-30'),
        userType: UserType.C,
        active: true
      }
    ];

    for (const user of users) {
      await prisma.user.create({
        data: user
      });
    }

    console.log('✅ Usuários criados com sucesso');
  } catch (error) {
    console.error('Erro ao criar usuários:', error);
  }
}

export { seedUsers };
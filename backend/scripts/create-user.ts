import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as readline from 'readline';

const prisma = new PrismaClient();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
};

async function main() {
  try {
    console.log('--- Create New Admin User ---');
    
    const email = await question('Email: ');
    if (!email) {
      console.error('Email is required');
      process.exit(1);
    }

    const password = await question('Password: ');
    if (!password) {
      console.error('Password is required');
      process.exit(1);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.error(`User with email ${email} already exists.`);
      process.exit(1);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log(`\nUser created successfully!`);
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();

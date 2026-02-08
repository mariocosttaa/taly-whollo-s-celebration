import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@talywhollo.com';
  const password = 'admin'; 
  const hashedPassword = await bcrypt.hash(password, 10);

  // First try to find
  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (existing) {
      console.log('User exists, updating password...');
      await prisma.user.update({
          where: { email },
          data: { password: hashedPassword }
      });
  } else {
      console.log('User does not exist, creating...');
      await prisma.user.create({
          data: {
              email,
              password: hashedPassword
          }
      });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  console.log('User verified:', user);
  
  // Verify password immediately
  const isMatch = await bcrypt.compare('admin', user?.password || '');
  console.log('Password check (admin):', isMatch);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

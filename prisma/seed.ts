import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.users.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      petugas: {
        create: {
          nama_petugas: 'Administrator',
          alamat: 'Kantor Pusat',
          telp: '081234567890',
        },
      },
    },
  });

  console.log('Seeder berhasil! Admin sudah dibuat.');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

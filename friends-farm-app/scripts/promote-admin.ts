import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.updateMany({ data: { is_admin: false } });
  const admin = await prisma.user.update({
    where: { id: '019ba4e8-55a3-7228-970a-86e1f2418f8c' },
    data: { is_admin: true }
  });
  console.log('Promoted user to Admin:', admin.email);
}
main().catch(console.error).finally(() => prisma.$disconnect());

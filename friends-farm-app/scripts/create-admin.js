const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

const prisma = new PrismaClient();

async function main() {
    const email = 'friendsfarm.eg@gmail.com';
    const password = 'Friendsfarm@2025';
    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        const user = await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                is_admin: true,
                name: 'Admin User',
            }
        });
        console.log('Updated existing user:', user.email);
    } else {
        const user = await prisma.user.create({
            data: {
                id: randomUUID(),
                email,
                password: hashedPassword,
                is_admin: true,
                name: 'Admin User',
                image: "https://ui-avatars.com/api/?name=Admin+User&background=1B5E20&color=fff",
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        console.log('Created new admin user:', user.email);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

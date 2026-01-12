import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'abdalasayed76@gmail.com'

    try {
        const user = await prisma.users.upsert({
            where: { email },
            update: { is_admin: true },
            create: {
                id: crypto.randomUUID(),
                email,
                is_admin: true,
                name: 'Abdallah Sayed'
            }
        })
        console.log(`Successfully promoted ${email} to ADMIN.`)
        console.log('User details:', user)
    } catch (error) {
        console.error('Error promoting user:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()

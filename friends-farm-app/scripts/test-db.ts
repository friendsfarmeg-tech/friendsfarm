import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const userCount = await prisma.user.count()
        console.log('Successfully connected to DB. User count:', userCount)
    } catch (error) {
        console.error('Failed to connect to DB:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()

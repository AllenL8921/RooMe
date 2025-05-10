import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Delete existing data
    await prisma.listing.deleteMany();
    await prisma.user.deleteMany();
    await prisma.hobby.deleteMany();

    // Seed hobbies
    const hobbies = [
        { name: 'Reading', description: 'Enjoying books and literature', category: 'Indoor' },
        { name: 'Hiking', description: 'Exploring nature trails', category: 'Outdoor' },
        { name: 'Cooking', description: 'Preparing and experimenting with food', category: 'Indoor' },
        { name: 'Gaming', description: 'Playing video games', category: 'Indoor' },
        { name: 'Photography', description: 'Capturing moments through a lens', category: 'Outdoor' },
    ];

    for (const hobby of hobbies) {
        await prisma.hobby.upsert({
            where: { name: hobby.name },
            update: {},
            create: hobby,
        });
    }

    // Seed users
    const users = [
        { firstName: 'John', lastName: 'Doe', email: 'john@example.com', clerkId: 'clerk_123' },
        { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', clerkId: 'clerk_456' },
        { firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', clerkId: 'clerk_789' },
        { firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', clerkId: 'clerk_101' },
        { firstName: 'Charlie', lastName: 'Davis', email: 'charlie@example.com', clerkId: 'clerk_102' },
        { firstName: 'Diana', lastName: 'Evans', email: 'diana@example.com', clerkId: 'clerk_103' },
        { firstName: 'Eve', lastName: 'Foster', email: 'eve@example.com', clerkId: 'clerk_104' },
        { firstName: 'Frank', lastName: 'Green', email: 'frank@example.com', clerkId: 'clerk_105' },
        { firstName: 'Grace', lastName: 'Harris', email: 'grace@example.com', clerkId: 'clerk_106' },
        { firstName: 'Hank', lastName: 'Ivy', email: 'hank@example.com', clerkId: 'clerk_107' },
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: user,
        });
    }

    // Seed listings
    const listings = [
        { title: 'Cozy Apartment', description: 'A cozy apartment in the heart of the city', price: 1000, creator_clerkId: 'clerk_123', is_active: true, is_featured: false },
        { title: 'Modern House', description: 'A modern house with great amenities', price: 2000, creator_clerkId: 'clerk_456', is_active: true, is_featured: false },
    ];

    for (const listing of listings) {
        await prisma.listing.upsert({
            where: { id: 1 },
            update: {},
            create: listing,
        });
    }

    console.log('Database has been seeded.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 
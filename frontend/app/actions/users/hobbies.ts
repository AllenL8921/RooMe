'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addHobbiesToUser(clerkId: string, hobbyIds: number[]) {
    try {
        // First, get the user's ID from their clerkId
        const user = await prisma.user.findUnique({
            where: { clerkId },
            select: { id: true }
        })

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        // Check if each hobby exists, if not, create it
        for (const hobbyId of hobbyIds) {
            const hobby = await prisma.hobby.findUnique({
                where: { id: hobbyId }
            })

            if (!hobby) {
                // Create the hobby if it doesn't exist
                await prisma.hobby.create({
                    data: { id: hobbyId, name: `Hobby ${hobbyId}` } // You might want to provide a name or other details
                })
            }
        }

        // Add the hobbies to the user
        await prisma.userHobby.createMany({
            data: hobbyIds.map(hobbyId => ({
                userId: user.id,
                hobbyId
            })),
            skipDuplicates: true // Skip if the hobby is already associated with the user
        })

        revalidatePath('/profile')
        return { success: true }
    } catch (error) {
        console.error('Error adding hobbies to user:', error)
        return { success: false, error: 'Failed to add hobbies' }
    }
}

export async function removeHobbyFromUser(clerkId: string, hobbyId: number) {
    try {
        // First, get the user's ID from their clerkId
        const user = await prisma.user.findUnique({
            where: { clerkId },
            select: { id: true }
        })

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        // Remove the hobby from the user
        await prisma.userHobby.deleteMany({
            where: {
                userId: user.id,
                hobbyId
            }
        })

        revalidatePath('/profile')
        return { success: true }
    } catch (error) {
        console.error('Error removing hobby from user:', error)
        return { success: false, error: 'Failed to remove hobby' }
    }
}

export async function getUserHobbies(clerkId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { clerkId },
            include: {
                UserHobby: {
                    include: {
                        hobby: true
                    }
                }
            }
        })

        if (!user) {
            return { success: false, error: 'User not found' }
        }

        return {
            success: true,
            hobbies: user.UserHobby.map(uh => uh.hobby)
        }
    } catch (error) {
        console.error('Error fetching user hobbies:', error)
        return { success: false, error: 'Failed to fetch hobbies' }
    }
} 
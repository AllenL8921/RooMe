import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/utils/prisma/client";
import MatchClient from "./MatchClient";
import { Prisma } from "@prisma/client";

export const dynamic = 'force-dynamic';

export default async function MatchPage() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-xl text-red-600">Please sign in to view matches</div>
                </div>
            );
        }

        // Get current user's preferences and hobbies
        const currentUser = await prisma.user.findUnique({
            where: { clerkId: userId },
            include: {
                UserHobby: {
                    include: {
                        hobby: true
                    }
                }
            }
        });

        if (!currentUser) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-xl text-red-600">User not found</div>
                </div>
            );
        }

        // Create base where conditions
        const whereConditions: Prisma.UserWhereInput = {
            clerkId: { not: userId }, // Exclude current user
            OR: [
                { cleanliness: currentUser.cleanliness },
                { smoking: currentUser.smoking },
                { pets: currentUser.pets },
            ],
            UserHobby: {
                some: {
                    hobby: {
                        id: {
                            in: currentUser.UserHobby.map(uh => uh.hobbyId)
                        }
                    }
                }
            }
        };

        // Add budget conditions only if both min and max budgets are set
        if (currentUser.min_budget !== null && currentUser.max_budget !== null) {
            (whereConditions.OR as Prisma.UserWhereInput[]).push({
                AND: [
                    { min_budget: { lte: currentUser.max_budget } },
                    { max_budget: { gte: currentUser.min_budget } }
                ]
            });
        }

        // Get potential matches based on preferences and hobbies
        const matches = await prisma.user.findMany({
            where: whereConditions,
            include: {
                UserHobby: {
                    include: {
                        hobby: true
                    }
                }
            }
        });

        return (
            <MatchClient
                currentUser={currentUser}
                matches={matches}
            />
        );
    } catch (error) {
        console.error('Error in MatchPage:', error);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">An error occurred while loading matches</div>
            </div>
        );
    }
}
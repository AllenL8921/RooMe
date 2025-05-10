import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/utils/prisma/client";
import MatchesClient from "./MatchesClient";

export default async function MatchesPage() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-xl text-red-600">Please sign in to view your matches</div>
                </div>
            );
        }

        // Get current user
        const currentUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!currentUser) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-xl text-red-600">User not found</div>
                </div>
            );
        }

        // Get all matches (both liked and matched)
        const matches = await prisma.match.findMany({
            where: {
                OR: [
                    { user1Id: currentUser.id },
                    { user2Id: currentUser.id }
                ]
            },
            include: {
                user1: {
                    include: {
                        UserHobby: {
                            include: {
                                hobby: true
                            }
                        }
                    }
                },
                user2: {
                    include: {
                        UserHobby: {
                            include: {
                                hobby: true
                            }
                        }
                    }
                }
            }
        });

        // Get all liked users (one-way likes)
        const likedUsers = await prisma.like.findMany({
            where: {
                fromUserId: currentUser.id
            },
            include: {
                toUser: {
                    include: {
                        UserHobby: {
                            include: {
                                hobby: true
                            }
                        }
                    }
                }
            }
        });

        return (
            <MatchesClient
                currentUser={currentUser}
                matches={matches}
                likedUsers={likedUsers}
            />
        );
    } catch (error) {
        console.error('Error in MatchesPage:', error);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">An error occurred while loading matches</div>
            </div>
        );
    }
} 
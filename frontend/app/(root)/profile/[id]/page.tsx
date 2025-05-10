import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/utils/prisma/client";
import ProfileClient from "./ProfileClient";
import { redirect } from "next/navigation";

type Props = {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProfilePage({ params, searchParams }: Props) {
    const { userId: currentUserId } = await auth();
    const { id: userId } = await params;
    await searchParams; // Ensure searchParams is resolved
    const isOwnProfile = currentUserId === userId;

    // If it's the current user's profile and they don't exist in our database yet,
    // redirect them to the onboarding page
    if (isOwnProfile) {
        const user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!user) {
            redirect('/onboard');
        }
    }

    // Fetch user data
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        include: {
            UserHobby: {
                include: {
                    hobby: true
                }
            }
        }
    });

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">User not found</div>
            </div>
        );
    }

    return (
        <ProfileClient
            user={user}
            isOwnProfile={isOwnProfile}
        />
    );
} 
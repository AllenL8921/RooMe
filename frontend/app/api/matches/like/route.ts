import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fromUserId, toUserId } = body;

        // Create a like
        const like = await prisma.Like.create({
            data: {
                fromUserId,
                toUserId,
            },
        });

        // Check if there's a mutual match
        const mutualLike = await prisma.Like.findUnique({
            where: {
                fromUserId_toUserId: {
                    fromUserId: toUserId,
                    toUserId: fromUserId,
                },
            },
        });

        if (mutualLike) {
            // Create a match
            const match = await prisma.Match.create({
                data: {
                    user1Id: fromUserId,
                    user2Id: toUserId,
                },
            });

            return NextResponse.json({
                success: true,
                match: true,
                matchData: match,
            });
        }

        return NextResponse.json({
            success: true,
            match: false,
            likeData: like,
        });
    } catch (error) {
        console.error("Error in like endpoint:", error);
        return NextResponse.json(
            { success: false, error: "Failed to process like" },
            { status: 500 }
        );
    }
} 
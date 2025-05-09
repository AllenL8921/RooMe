import { prisma } from "@/utils/prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fromUserId, toUserId } = body;

        // Check if a like already exists
        const existingLike = await prisma.like.findUnique({
            where: {
                fromUserId_toUserId: {
                    fromUserId,
                    toUserId,
                },
            },
        });

        if (existingLike) {
            return NextResponse.json({
                success: true,
                match: false,
                likeData: existingLike,
            });
        }

        // Create a like
        const like = await prisma.like.create({
            data: {
                fromUserId,
                toUserId,
            },
        });

        // Check if there's a mutual match
        const mutualLike = await prisma.like.findUnique({
            where: {
                fromUserId_toUserId: {
                    fromUserId: toUserId,
                    toUserId: fromUserId,
                },
            },
        });

        if (mutualLike) {
            // Create a match
            const match = await prisma.match.create({
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
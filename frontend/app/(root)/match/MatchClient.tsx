"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, UserHobby, Hobby } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";

interface MatchClientProps {
    currentUser: User & {
        UserHobby: (UserHobby & {
            hobby: Hobby;
        })[];
    };
    matches: (User & {
        UserHobby: (UserHobby & {
            hobby: Hobby;
        })[];
    })[];
}

export default function MatchClient({ currentUser, matches }: MatchClientProps) {
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [showMatch, setShowMatch] = useState(false);
    const [matchedUser, setMatchedUser] = useState<User | null>(null);

    const currentMatch = matches[currentMatchIndex];

    const handleLike = async () => {
        try {
            const response = await fetch("/api/matches/like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fromUserId: currentUser.id,
                    toUserId: currentMatch.id,
                }),
            });

            const data = await response.json();

            if (data.success && data.match) {
                setMatchedUser(currentMatch);
                setShowMatch(true);
            }

            setDirection(1);
            setTimeout(() => {
                setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
                setDirection(0);
            }, 300);
        } catch (error) {
            console.error("Error liking user:", error);
        }
    };

    const handleDislike = () => {
        setDirection(-1);
        setTimeout(() => {
            setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
            setDirection(0);
        }, 300);
    };

    if (matches.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">No Matches Found</h1>
                    <p className="text-gray-600 mb-4">
                        We couldn&apos;t find any potential roommates that match your preferences.
                    </p>
                    <Link
                        href="/profile/hobbies"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Update Your Preferences
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 bg-gray-100">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Find Your Roommate</h1>

                <div className="relative h-[600px]">
                    <AnimatePresence>
                        <motion.div
                            key={currentMatchIndex}
                            initial={{
                                x: direction === 1 ? 500 : direction === -1 ? -500 : 0,
                                opacity: 0,
                                rotate: direction === 1 ? 30 : direction === -1 ? -30 : 0
                            }}
                            animate={{
                                x: 0,
                                opacity: 1,
                                rotate: 0
                            }}
                            exit={{
                                x: direction === 1 ? 500 : -500,
                                opacity: 0,
                                rotate: direction === 1 ? 30 : -30
                            }}
                            transition={{ duration: 0.3 }}
                            className="absolute w-full"
                            style={{ zIndex: 10 }}
                        >
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="h-[400px] bg-gray-200 relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-6xl text-gray-400">
                                            {(currentMatch.firstName?.[0] || "U").toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h2 className="text-2xl font-semibold mb-2">
                                        {currentMatch.firstName} {currentMatch.lastName}
                                    </h2>
                                    {currentMatch.location && (
                                        <p className="text-gray-500 mb-4">{currentMatch.location}</p>
                                    )}

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">Preferences</h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <p className="text-gray-600">Cleanliness</p>
                                                    <p className="font-medium">{currentMatch.cleanliness || "Not specified"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Smoking</p>
                                                    <p className="font-medium">{currentMatch.smoking || "Not specified"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Pets</p>
                                                    <p className="font-medium">{currentMatch.pets || "Not specified"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Budget</p>
                                                    <p className="font-medium">
                                                        {currentMatch.min_budget && currentMatch.max_budget
                                                            ? `$${currentMatch.min_budget} - $${currentMatch.max_budget}`
                                                            : "Not specified"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">Shared Hobbies</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {currentMatch.UserHobby.filter(uh =>
                                                    currentUser.UserHobby.some(
                                                        currentUh => currentUh.hobbyId === uh.hobbyId
                                                    )
                                                ).map(({ hobby }) => (
                                                    <span
                                                        key={hobby.id}
                                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                                    >
                                                        {hobby.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-center gap-8 mt-16 relative" style={{ zIndex: 20 }}>
                    <button
                        onClick={handleDislike}
                        className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-red-500 hover:bg-red-50 transform hover:scale-110 transition-transform"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <button
                        onClick={handleLike}
                        className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-green-500 hover:bg-green-50 transform hover:scale-110 transition-transform"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Match Modal */}
            {showMatch && matchedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
                        <h2 className="text-3xl font-bold mb-4">It&apos;s a Match! 🎉</h2>
                        <p className="text-gray-600 mb-6">
                            You and {matchedUser.firstName} have matched! You can now start chatting.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowMatch(false)}
                                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
                            >
                                Keep Swiping
                            </button>
                            <Link
                                href={`/chat/${matchedUser.clerkId}`}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                            >
                                Start Chat
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 
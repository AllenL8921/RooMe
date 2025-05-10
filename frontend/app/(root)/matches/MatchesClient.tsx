"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, UserHobby, Hobby, Match, Like } from "@prisma/client";

type UserWithHobbies = User & {
    UserHobby: (UserHobby & {
        hobby: Hobby;
    })[];
};

interface MatchesClientProps {
    currentUser: User;
    matches: (Match & {
        user1: UserWithHobbies;
        user2: UserWithHobbies;
    })[];
    likedUsers: (Like & {
        toUser: UserWithHobbies;
    })[];
}

export default function MatchesClient({ currentUser, matches, likedUsers }: MatchesClientProps) {
    const [activeTab, setActiveTab] = useState<'matches' | 'liked'>('matches');

    const getOtherUser = (match: Match & { user1: UserWithHobbies; user2: UserWithHobbies }) => {
        return match.user1Id === currentUser.id ? match.user2 : match.user1;
    };

    return (
        <div className="min-h-screen py-8 px-4 bg-gray-100">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8">Your Matches</h1>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <button
                        onClick={() => setActiveTab('matches')}
                        className={`px-6 py-2 rounded-l-lg ${activeTab === 'matches'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600'
                            }`}
                    >
                        Matches ({matches.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('liked')}
                        className={`px-6 py-2 rounded-r-lg ${activeTab === 'liked'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-600'
                            }`}
                    >
                        Liked ({likedUsers.length})
                    </button>
                </div>

                {/* Matches Tab */}
                {activeTab === 'matches' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matches.map((match) => {
                            const otherUser = getOtherUser(match);
                            return (
                                <div key={match.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                    <div className="h-48 bg-gray-200 relative">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-6xl text-gray-400">
                                                {(otherUser.firstName?.[0] || "U").toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-2">
                                            {otherUser.firstName} {otherUser.lastName}
                                        </h2>
                                        {otherUser.location && (
                                            <p className="text-gray-500 mb-4">{otherUser.location}</p>
                                        )}

                                        <div className="mb-4">
                                            <h3 className="font-semibold text-gray-700 mb-2">Shared Hobbies</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {otherUser.UserHobby.map(({ hobby }: { hobby: Hobby }) => (
                                                    <span
                                                        key={hobby.id}
                                                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                                                    >
                                                        {hobby.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <Link
                                            href={`/chat/${otherUser.clerkId}`}
                                            className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        >
                                            Send Message
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Liked Tab */}
                {activeTab === 'liked' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {likedUsers.map((like) => (
                            <div key={like.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="h-48 bg-gray-200 relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-6xl text-gray-400">
                                            {(like.toUser.firstName?.[0] || "U").toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-2">
                                        {like.toUser.firstName} {like.toUser.lastName}
                                    </h2>
                                    {like.toUser.location && (
                                        <p className="text-gray-500 mb-4">{like.toUser.location}</p>
                                    )}

                                    <div className="mb-4">
                                        <h3 className="font-semibold text-gray-700 mb-2">Hobbies</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {like.toUser.UserHobby.map(({ hobby }: { hobby: Hobby }) => (
                                                <span
                                                    key={hobby.id}
                                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                                                >
                                                    {hobby.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="text-center text-gray-500">
                                        Waiting for them to like you back...
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'matches' && matches.length === 0 && (
                    <div className="text-center text-gray-600">
                        <p className="mb-4">You haven&apos;t matched with anyone yet.</p>
                        <Link
                            href="/match"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Start matching with people
                        </Link>
                    </div>
                )}

                {activeTab === 'liked' && likedUsers.length === 0 && (
                    <div className="text-center text-gray-600">
                        <p className="mb-4">You haven&apos;t liked anyone yet.</p>
                        <Link
                            href="/match"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Start matching with people
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
} 
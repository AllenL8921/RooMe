"use client";

import React from "react";
import Link from "next/link";
import { Hobby, User, UserHobby } from "@prisma/client";
import Image from 'next/image';
import { useUser } from "@clerk/nextjs";
import UserPosts from '@/app/components/users/UserPosts';
import UserReviews from '@/app/components/users/UserReviews';

interface ProfileClientProps {
    user: User & {
        UserHobby: (UserHobby & {
            hobby: Hobby;
        })[];
    };
    isOwnProfile: boolean;
}

export default function ProfileClient({ user, isOwnProfile }: ProfileClientProps) {
    const { user: clerkUser } = useUser();
    const profileImageUrl = isOwnProfile ? clerkUser?.imageUrl : `https://api.clerk.com/v1/users/${user.clerkId}/profile_image`;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 md:pr-4">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                                    <Image
                                        src={profileImageUrl || "/default-avatar.png"}
                                        alt={`${user.firstName}'s profile`}
                                        width={96}
                                        height={96}
                                        className="rounded-full"
                                    />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">
                                        {user.firstName} {user.lastName}
                                    </h1>
                                    <p className="text-gray-600">{user.email}</p>
                                    {user.location && (
                                        <p className="text-gray-500">{user.location}</p>
                                    )}
                                </div>
                            </div>

                            {user.bio && (
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold mb-2">About</h2>
                                    <p className="text-gray-700">{user.bio}</p>
                                </div>
                            )}

                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">Preferences</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600">Cleanliness</p>
                                        <p className="font-medium">{user.cleanliness || "Not specified"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Smoking</p>
                                        <p className="font-medium">{user.smoking || "Not specified"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Pets</p>
                                        <p className="font-medium">{user.pets || "Not specified"}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Budget</p>
                                        <p className="font-medium">
                                            {user.min_budget && user.max_budget
                                                ? `$${user.min_budget} - $${user.max_budget}`
                                                : "Not specified"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-2">Hobbies</h2>
                                <div className="flex flex-wrap gap-2">
                                    {user.UserHobby.map(({ hobby }) => (
                                        <span
                                            key={hobby.id}
                                            className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {hobby.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {isOwnProfile && (
                                <div className="flex space-x-4">
                                    <Link
                                        href="/profile/hobbies"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                    >
                                        Manage Hobbies
                                    </Link>
                                    <Link
                                        href={`/listings/myListings`}
                                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                                    >
                                        View My Listings
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="md:w-1/2 md:pl-4">
                        <UserPosts />
                        <UserReviews />
                    </div>
                </div>
            </div>
        </div>
    );
} 
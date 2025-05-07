// CreateListingForm.tsx

"use client"; // Indicating that this is a client component

import React, { useState, useEffect } from "react";
import { createListing, getHobbies } from "@/app/actions/listings/listings";
import { Listing, Hobby, User } from "@prisma/client";
import { useAuth } from '@clerk/nextjs';

type ListingWithHobbies = Listing & {
    ListingHobby: {
        hobby: Hobby
    }[]
    user: User
}

type HobbyResponse = {
    id: number
    name: string
    description: string | null
    category: string | null
    iconUrl: string | null
}

const PREFERENCE_OPTIONS = [
    { value: 1, label: 'Not Important' },
    { value: 2, label: 'Somewhat Important' },
    { value: 3, label: 'Important' },
    { value: 4, label: 'Very Important' },
    { value: 5, label: 'Essential' }
]

export default function CreateListingForm() {
    const { userId } = useAuth();
    const [result, setResult] = useState<{ success: boolean; listing?: ListingWithHobbies; error?: string } | null>(null);
    const [hobbies, setHobbies] = useState<HobbyResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadHobbies() {
            const response = await getHobbies();
            if (response.success && response.hobbies) {
                setHobbies(response.hobbies);
            }
            setLoading(false);
        }
        loadHobbies();
    }, []);

    async function handleSubmit(formData: FormData) {
        if (!userId) {
            setResult({ success: false, error: 'You must be signed in to create a listing' });
            return;
        }

        // Add the userId to the formData
        formData.append('creator_clerkId', userId);
        const result = await createListing(formData);
        if (result.success && result.listing) {
            setResult({ success: true, listing: result.listing as ListingWithHobbies });
        } else {
            setResult({ success: false, error: result.error });
        }
    }

    if (loading) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Listing</h1>

            <form action={handleSubmit} className="space-y-6">
                {/* Basic Information Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Basic Information</h2>

                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            className="w-full p-2 border rounded"
                            rows={4}
                        />
                    </div>

                    <div>
                        <label htmlFor="price" className="block text-sm font-medium mb-1">
                            Price
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            required
                            min="0"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium mb-1">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-1">
                            Category
                        </label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label htmlFor="image_url" className="block text-sm font-medium mb-1">
                            Image URL
                        </label>
                        <input
                            type="url"
                            id="image_url"
                            name="image_url"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                {/* User Preferences Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">User Preferences</h2>

                    <div>
                        <label htmlFor="cleanliness" className="block text-sm font-medium mb-1">
                            Cleanliness Preference
                        </label>
                        <select
                            id="cleanliness"
                            name="cleanliness"
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select preference</option>
                            {PREFERENCE_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="smoking" className="block text-sm font-medium mb-1">
                            Smoking Preference
                        </label>
                        <select
                            id="smoking"
                            name="smoking"
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select preference</option>
                            {PREFERENCE_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="pets" className="block text-sm font-medium mb-1">
                            Pets Preference
                        </label>
                        <select
                            id="pets"
                            name="pets"
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select preference</option>
                            {PREFERENCE_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="min_budget" className="block text-sm font-medium mb-1">
                                Minimum Budget
                            </label>
                            <input
                                type="number"
                                id="min_budget"
                                name="min_budget"
                                min="0"
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label htmlFor="max_budget" className="block text-sm font-medium mb-1">
                                Maximum Budget
                            </label>
                            <input
                                type="number"
                                id="max_budget"
                                name="max_budget"
                                min="0"
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                </div>

                {/* Hobbies Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Hobbies</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {hobbies.map(hobby => (
                            <label key={hobby.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="hobbies"
                                    value={hobby.id}
                                    className="rounded"
                                />
                                <span>{hobby.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Listing Images Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Listing Images</h2>
                    <div>
                        <label htmlFor="listing_images" className="block text-sm font-medium mb-1">
                            Upload Images
                        </label>
                        <input
                            type="file"
                            id="listing_images"
                            name="listing_images"
                            accept="image/*"
                            multiple
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div id="image_preview" className="grid grid-cols-2 gap-2 mt-2">
                        {/* Image previews will be inserted here via JavaScript */}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Listing'}
                </button>
            </form>

            {result && (
                <div className={`mt-4 p-4 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                    {result.success ? (
                        <div>
                            <p className="text-green-800">Listing created successfully!</p>
                            <pre className="mt-2 text-sm overflow-auto">
                                {JSON.stringify(result.listing, null, 2)}
                            </pre>
                        </div>
                    ) : (
                        <p className="text-red-800">Error: {result.error}</p>
                    )}
                </div>
            )}
        </div>
    );
}

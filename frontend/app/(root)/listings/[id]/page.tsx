import React from 'react';
import { getListingById, getUserListings } from '@/app/actions/listings/listingActions';

interface ListingPageProps {
    params: {
        id: string;
    }
}

export default async function Page({ params }: ListingPageProps) {
    try {
        const id = params.id;

        // Check if the ID is a Clerk user ID (starts with 'user_')
        if (id.startsWith('user_')) {
            const listings = await getUserListings(id);

            if (!listings || listings.length === 0) {
                return (
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-xl text-red-600">No listings found for this user</div>
                    </div>
                );
            }

            return (
                <div className="container mx-auto p-4">
                    <h1 className="text-3xl font-bold mb-8">User&apos;s Listings</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                            <div key={listing.id} className="bg-white rounded-lg shadow-md p-4">
                                <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
                                <p className="text-gray-600 mb-2">{listing.description}</p>
                                <p className="text-lg font-bold text-blue-600">${listing.price} / mo</p>
                                {listing.location && (
                                    <p className="text-sm text-gray-500 mt-2">{listing.location}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Handle numeric listing ID
        const listingId = Number(id);
        if (isNaN(listingId)) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-xl text-red-600">Invalid listing ID format</div>
                </div>
            );
        }

        const listing = await getListingById(listingId);

        if (!listing) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-xl text-red-600">Listing not found</div>
                </div>
            );
        }

        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
                <p className="text-gray-600 mb-4">{listing.description}</p>
                <p className="text-lg font-bold text-blue-600 mb-4">${listing.price} / mo</p>

                {listing.location && (
                    <p className="text-sm text-gray-500 mb-4">{listing.location}</p>
                )}

                {listing.ListingHobby.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Hobbies:</h3>
                        <div className="flex flex-wrap gap-2">
                            {listing.ListingHobby.map(({ hobby }) => (
                                <span
                                    key={hobby.id}
                                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                                >
                                    {hobby.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                <h2 className="text-2xl font-bold mt-8 mb-4">People Interested</h2>
                <ul>
                    {listing.user ? (
                        <li className="mb-2">
                            <span className="font-semibold">{listing.user.firstName} {listing.user.lastName}</span>
                        </li>
                    ) : (
                        <li>No one interested yet</li>
                    )}
                </ul>
            </div>
        );
    } catch (error) {
        console.error('Error loading listing:', error);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">Error loading listing</div>
            </div>
        );
    }
}
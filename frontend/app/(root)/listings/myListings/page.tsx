'use client';

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { getUserListings } from '@/app/actions/listings/listingActions';
import ListingCard from '@/app/components/listings/ListingCard';

interface Listing {
    id: number;
    title: string;
    description: string;
    price: number;
    image_url: string | null;
    location: string | null;
    category: string | null;
    is_active: boolean;
    is_featured: boolean;
    creator_clerkId: string;
    ListingHobby: {
        hobby: {
            id: number;
            name: string;
        };
    }[];
}

const MyListingsPage = () => {
    const { user, isLoaded } = useUser();
    const [listings, setListings] = React.useState<Listing[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchListings = async () => {
            if (isLoaded && user) {
                try {
                    const userListings = await getUserListings(user.id);
                    setListings(userListings);
                } catch (error) {
                    console.error('Error fetching listings:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchListings();
    }, [user, isLoaded]);

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading your listings...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">Please sign in to view your listings</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Listings</h1>
            {listings.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">You have not created any listings yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <ListingCard
                            key={listing.id}
                            listing={listing}
                            isOwner={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyListingsPage;
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteListing } from "@/app/actions/listings/listingActions";
import { useAuth } from '@clerk/nextjs';
import Image from "next/image";

interface ListingCardProps {
    listing: {
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
    };
    isOwner?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, isOwner = false }) => {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this listing?")) return;

        setIsDeleting(true);
        try {
            await deleteListing(listing.id);
            router.refresh();
        } catch (error) {
            console.error("Error deleting listing:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link href={`/listings/${listing.id}`}>
                <div className="relative h-48 w-full">
                    {listing.image_url ? (
                        <Image
                            src={listing.image_url}
                            alt={listing.title}
                            width={500}
                            height={300}
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No image available</span>
                        </div>
                    )}
                    {listing.is_featured && (
                        <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                            Featured
                        </div>
                    )}
                </div>

                <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{listing.title}</h2>
                    <p className="text-gray-600 mb-2">{listing.description}</p>
                    <p className="text-lg font-bold text-blue-600">${listing.price / 100} / mo</p>
                    {listing.location && (
                        <p className="text-sm text-gray-500 mt-2">{listing.location}</p>
                    )}
                    {listing.ListingHobby.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {listing.ListingHobby.map(({ hobby }) => (
                                <span
                                    key={hobby.id}
                                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                                >
                                    {hobby.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Link>

            {isOwner && (
                <div className="p-4 border-t">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-red-300"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Listing'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ListingCard; 
'use server';

import { prisma } from "@/utils/prisma/client";



// Create a new listing
export async function createListing(listingData: {
    title: string;
    description: string;
    price: number;
    image_url?: string;
    location: string;
    category: string;
    is_active?: boolean;
    is_featured?: boolean;
    clerkId: string;
    hobbyIds: number[];
}) {
    try {
        const newListing = await prisma.listing.create({
            data: {
                title: listingData.title,
                description: listingData.description,
                price: listingData.price,
                image_url: listingData.image_url,
                location: listingData.location,
                category: listingData.category,
                is_active: listingData.is_active ?? true,
                is_featured: listingData.is_featured ?? false,
                creator_clerkId: listingData.clerkId,
                ListingHobby: {
                    create: listingData.hobbyIds.map((hobbyId) => ({
                        hobbyId,
                    })),
                },
            },
            include: {
                ListingHobby: {
                    include: {
                        hobby: true,
                    },
                },
            },
        });

        return newListing;
    } catch (error) {
        console.error("Error creating listing:", error);
        throw error;
    }
}

// Get all listings
export async function getAllListings() {
    try {
        const listings = await prisma.listing.findMany({
            include: {
                ListingHobby: {
                    include: {
                        hobby: true,
                    },
                },
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Check if listing is empty
        if (listings.length === 0) {
            console.log('No listings found');
            return [];
        }

        return listings;
    } catch (error) {
        console.error("Error fetching listings:", error);
        throw error;
    }
}

// Get a single listing by ID
export async function getListingById(id: number) {
    try {
        const listing = await prisma.listing.findUnique({
            where: { id },
            include: {
                ListingHobby: {
                    include: {
                        hobby: true,
                    },
                },
                user: true,
            },
        });
        return listing;
    } catch (error) {
        console.error("Error fetching listing:", error);
        throw error;
    }
}

type UpdateListingData = {
    title?: string;
    description?: string;
    price?: number;
    image_url?: string;
    location?: string;
    category?: string;
    is_active?: boolean;
    is_featured?: boolean;
    hobbyIds?: number[];
};

export async function updateListing(id: number, listingData: UpdateListingData) {
    try {
        const { hobbyIds, ...updateData } = listingData;

        const updatedListing = await prisma.listing.update({
            where: { id },
            data: {
                ...updateData,
                ...(hobbyIds && {
                    ListingHobby: {
                        deleteMany: {},
                        create: hobbyIds.map((hobbyId) => ({
                            hobbyId,
                        })),
                    },
                }),
            },
            include: {
                ListingHobby: {
                    include: {
                        hobby: true,
                    },
                },
            },
        });
        return updatedListing;
    } catch (error) {
        console.error("Error updating listing:", error);
        throw error;
    }
}


// Delete a listing
export async function deleteListing(id: number) {
    try {
        await prisma.listing.delete({
            where: { id },
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting listing:", error);
        throw error;
    }
}

// Get listings for a specific user
export async function getUserListings(clerkId: string) {
    try {
        const listings = await prisma.listing.findMany({
            where: {
                creator_clerkId: clerkId
            },
            include: {
                ListingHobby: {
                    include: {
                        hobby: true,
                    },
                },
                user: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return listings;
    } catch (error) {
        console.error("Error fetching user listings:", error);
        throw error;
    }
} 
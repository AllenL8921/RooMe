"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllListings } from "@/app/actions/listings/listingActions";
import ListingCard from "@/app/components/listings/ListingCard";
import { useAuth } from "@clerk/nextjs";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Listing {
    id: number;
    title: string;
    description: string;
    price: number;
    category: string | null;
    image_url: string | null;
    location: string | null;
    is_active: boolean;
    is_featured: boolean;
    creator_clerkId: string;
    ListingHobby: {
        hobby: {
            id: number;
            name: string;
            category: string | null;
            description: string | null;
            iconUrl: string | null;
        };
    }[];
}

export default function ListingsPage() {
    const router = useRouter();
    const { userId } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    const [priceRange, setPriceRange] = useState('all');

    useEffect(() => {
        async function fetchListings() {
            try {
                const data = await getAllListings();
                setListings(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch listings');
            } finally {
                setLoading(false);
            }
        }

        fetchListings();
    }, []);

    const filteredListings = listings.filter((listing) => {
        const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'all' || listing.category === category;
        const matchesPrice = priceRange === 'all' ||
            (priceRange === 'low' && listing.price < 1000) ||
            (priceRange === 'medium' && listing.price >= 1000 && listing.price < 2000) ||
            (priceRange === 'high' && listing.price >= 2000);

        return matchesSearch && matchesCategory && matchesPrice;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading listings...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Available Listings</h1>
                {userId && (
                    <button
                        onClick={() => router.push("/listings/create")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 cursor-pointer"
                    >
                        Create New Listing
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Input
                    type="text"
                    placeholder="Search listings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                />

                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="low">Under $1000</SelectItem>
                        <SelectItem value="medium">$1000 - $2000</SelectItem>
                        <SelectItem value="high">Over $2000</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {filteredListings.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600">No listings found matching your criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((listing) => (
                        <ListingCard
                            key={listing.id}
                            listing={listing}
                            isOwner={listing.creator_clerkId === userId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
} 
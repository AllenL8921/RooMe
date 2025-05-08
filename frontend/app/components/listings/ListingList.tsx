'use client';

import React, { useState } from 'react';
import { Listing } from '@/app/types/listing';

interface Props {
    listings: Listing[];
}

const ListingList: React.FC<Props> = ({ listings }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % listings.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + listings.length) % listings.length);
    };

    if (listings.length === 0) {
        return (
            <div className="text-center p-4">
                <p className="text-gray-600">No listings available.</p>
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="overflow-hidden">
                <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {listings.map((listing) => (
                        <div key={listing.id} className="w-full flex-shrink-0 p-4">
                            <div className="border p-4 rounded shadow">
                                <h2 className="text-xl font-semibold">{listing.title}</h2>
                                <p className="text-gray-600">{listing.description}</p>
                                <p className="text-sm mt-2">${listing.price} / mo</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={prevSlide} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full">
                &lt;
            </button>
            <button onClick={nextSlide} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full">
                &gt;
            </button>
        </div>
    );
};

export default ListingList;

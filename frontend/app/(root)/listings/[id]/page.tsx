import React from 'react';
import { getListingById } from '@/app/actions/listings/listingActions';

type Props = {
    params: {
        id: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
};

const ListingDetailPage = async ({ params }: Props) => {
    const listing = await getListingById(parseInt(params.id));
    console.log(listing);

    if (!listing) {
        return <div>Listing not found</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
            <p className="text-gray-600 mb-4">{listing.description}</p>
            <p className="text-lg font-bold text-blue-600 mb-4">${listing.price / 100} / mo</p>

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
};

export default ListingDetailPage
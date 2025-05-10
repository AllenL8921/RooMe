'use client';

import React, { useState } from 'react';
import { fetchZillowListing } from '@/app/actions/listings/zillowActions';

interface BasicInfoFormProps {
    formData: {
        title: string;
        description: string;
        price: string;
        location: string;
        category: string;
        image_url: string;
    };
    updateFormData: (data: Partial<BasicInfoFormProps['formData']>) => void;
    onNext: () => void;
}

export default function BasicInfoForm({ formData, updateFormData, onNext }: BasicInfoFormProps) {
    const [zillowUrl, setZillowUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    const handleZillowFetch = async () => {
        if (!zillowUrl) {
            setError('Please enter a Zillow URL');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await fetchZillowListing(zillowUrl);

            if (result.success && result.data) {
                // Map Zillow category to our categories
                const categoryMap: { [key: string]: string } = {
                    'Single Family': 'house',
                    'Multi Family': 'house',
                    'Apartment': 'apartment',
                    'Condo': 'apartment',
                    'Studio': 'studio',
                    'Room': 'room',
                    'Townhouse': 'house',
                    'Mobile': 'house',
                    'Land': 'house'
                };

                const mappedCategory = categoryMap[result.data.category] || 'house';

                // Update form with Zillow data
                updateFormData({
                    title: result.data.title || '',
                    description: result.data.description || '',
                    price: result.data.price ? (result.data.price / 100).toString() : '',
                    location: result.data.location || '',
                    category: mappedCategory,
                    image_url: result.data.image_url || ''
                });

                // Clear any previous errors
                setError(null);
            } else {
                setError(result.error || 'Failed to fetch Zillow listing');
            }
        } catch (err) {
            setError('An error occurred while fetching the listing');
            console.error('Error fetching Zillow listing:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Basic Information</h2>

                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium mb-2">Import from Zillow</h3>
                    <div className="flex gap-2">
                        <input
                            type="url"
                            value={zillowUrl}
                            onChange={(e) => setZillowUrl(e.target.value)}
                            placeholder="Enter Zillow listing URL"
                            className="flex-1 p-2 border rounded"
                        />
                        <button
                            type="button"
                            onClick={handleZillowFetch}
                            disabled={isLoading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {isLoading ? 'Loading...' : 'Import'}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => updateFormData({ title: e.target.value })}
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
                        value={formData.description}
                        onChange={(e) => updateFormData({ description: e.target.value })}
                        required
                        className="w-full p-2 border rounded"
                        rows={4}
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium mb-1">
                        Price (per month) *
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={formData.price}
                        onChange={(e) => updateFormData({ price: e.target.value })}
                        required
                        min="0"
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-1">
                        Location *
                    </label>
                    <input
                        type="text"
                        id="location"
                        value={formData.location}
                        onChange={(e) => updateFormData({ location: e.target.value })}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">
                        Category *
                    </label>
                    <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => updateFormData({ category: e.target.value })}
                        required
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select a category</option>
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="studio">Studio</option>
                        <option value="room">Room</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="image_url" className="block text-sm font-medium mb-1">
                        Main Image URL
                    </label>
                    <input
                        type="url"
                        id="image_url"
                        value={formData.image_url}
                        onChange={(e) => updateFormData({ image_url: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                    Next
                </button>
            </div>
        </form>
    );
} 
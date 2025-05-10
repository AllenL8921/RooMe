'use client';

import React, { useState } from 'react';

interface ImagesFormProps {
    formData: {
        listing_images: File[];
    };
    updateFormData: (data: Partial<ImagesFormProps['formData']>) => void;
    onSubmit: () => void;
    onBack: () => void;
}

export default function ImagesForm({ formData, updateFormData, onSubmit, onBack }: ImagesFormProps) {
    const [previews, setPreviews] = useState<string[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        updateFormData({ listing_images: files });

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);

        // Cleanup old previews
        return () => {
            newPreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Listing Images</h2>
                <p className="text-gray-600">Upload images of your listing</p>

                <div>
                    <label htmlFor="listing_images" className="block text-sm font-medium mb-1">
                        Upload Images
                    </label>
                    <input
                        type="file"
                        id="listing_images"
                        onChange={handleImageChange}
                        accept="image/*"
                        multiple
                        className="w-full p-2 border rounded"
                    />
                </div>

                {previews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative aspect-square">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                    Back
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                    Create Listing
                </button>
            </div>
        </form>
    );
} 
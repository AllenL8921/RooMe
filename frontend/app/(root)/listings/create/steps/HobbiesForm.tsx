'use client';

import React, { useState, useEffect } from 'react';
import { getHobbies } from '@/app/actions/listings/listings';

interface Hobby {
    id: number;
    name: string;
    description: string | null;
    category: string | null;
    iconUrl: string | null;
}

interface HobbiesFormProps {
    formData: {
        hobbies: number[];
    };
    updateFormData: (data: Partial<HobbiesFormProps['formData']>) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function HobbiesForm({ formData, updateFormData, onNext, onBack }: HobbiesFormProps) {
    const [hobbies, setHobbies] = useState<Hobby[]>([]);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    const handleHobbyChange = (hobbyId: number) => {
        const newHobbies = formData.hobbies.includes(hobbyId)
            ? formData.hobbies.filter(id => id !== hobbyId)
            : [...formData.hobbies, hobbyId];
        updateFormData({ hobbies: newHobbies });
    };

    if (loading) {
        return <div>Loading hobbies...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Hobbies</h2>
                <p className="text-gray-600">Select the hobbies that interest you</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hobbies.map(hobby => (
                        <label
                            key={hobby.id}
                            className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${formData.hobbies.includes(hobby.id) ? 'border-blue-500 bg-blue-50' : ''
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={formData.hobbies.includes(hobby.id)}
                                onChange={() => handleHobbyChange(hobby.id)}
                                className="rounded"
                            />
                            <span>{hobby.name}</span>
                        </label>
                    ))}
                </div>
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
                    Next
                </button>
            </div>
        </form>
    );
} 
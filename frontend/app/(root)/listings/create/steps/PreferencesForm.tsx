'use client';

import React from 'react';

const PREFERENCE_OPTIONS = [
    { value: 1, label: 'Not Important' },
    { value: 2, label: 'Somewhat Important' },
    { value: 3, label: 'Important' },
    { value: 4, label: 'Very Important' },
    { value: 5, label: 'Essential' }
];

interface PreferencesFormProps {
    formData: {
        cleanliness: string;
        smoking: string;
        pets: string;
        min_budget: string;
        max_budget: string;
    };
    updateFormData: (data: Partial<PreferencesFormProps['formData']>) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function PreferencesForm({ formData, updateFormData, onNext, onBack }: PreferencesFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">User Preferences</h2>

                <div>
                    <label htmlFor="cleanliness" className="block text-sm font-medium mb-1">
                        Cleanliness Preference
                    </label>
                    <select
                        id="cleanliness"
                        value={formData.cleanliness}
                        onChange={(e) => updateFormData({ cleanliness: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select preference</option>
                        {PREFERENCE_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="smoking" className="block text-sm font-medium mb-1">
                        Smoking Preference
                    </label>
                    <select
                        id="smoking"
                        value={formData.smoking}
                        onChange={(e) => updateFormData({ smoking: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select preference</option>
                        {PREFERENCE_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="pets" className="block text-sm font-medium mb-1">
                        Pets Preference
                    </label>
                    <select
                        id="pets"
                        value={formData.pets}
                        onChange={(e) => updateFormData({ pets: e.target.value })}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select preference</option>
                        {PREFERENCE_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="min_budget" className="block text-sm font-medium mb-1">
                            Minimum Budget
                        </label>
                        <input
                            type="number"
                            id="min_budget"
                            value={formData.min_budget}
                            onChange={(e) => updateFormData({ min_budget: e.target.value })}
                            min="0"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label htmlFor="max_budget" className="block text-sm font-medium mb-1">
                            Maximum Budget
                        </label>
                        <input
                            type="number"
                            id="max_budget"
                            value={formData.max_budget}
                            onChange={(e) => updateFormData({ max_budget: e.target.value })}
                            min="0"
                            className="w-full p-2 border rounded"
                        />
                    </div>
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
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BasicInfoForm from './steps/BasicInfoForm';
import PreferencesForm from './steps/PreferencesForm';
import HobbiesForm from './steps/HobbiesForm';
import ImagesForm from './steps/ImagesForm';

interface FormData {
    title: string;
    description: string;
    price: string;
    location: string;
    category: string;
    image_url: string;
    cleanliness: string;
    smoking: string;
    pets: string;
    min_budget: string;
    max_budget: string;
    hobbies: number[];
    listing_images: File[];
}

export default function CreateListingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        price: '',
        location: '',
        category: '',
        image_url: '',
        cleanliness: '',
        smoking: '',
        pets: '',
        min_budget: '',
        max_budget: '',
        hobbies: [],
        listing_images: []
    });

    const updateFormData = (data: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <BasicInfoForm
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                    />
                );
            case 2:
                return (
                    <PreferencesForm
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 3:
                return (
                    <HobbiesForm
                        formData={formData}
                        updateFormData={updateFormData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 4:
                return (
                    <ImagesForm
                        formData={formData}
                        updateFormData={updateFormData}
                        onSubmit={async () => {
                            const formDataToSubmit = new FormData();
                            Object.entries(formData).forEach(([key, value]) => {
                                if (key === 'hobbies' && Array.isArray(value)) {
                                    value.forEach(hobbyId => {
                                        formDataToSubmit.append('hobbies', hobbyId.toString());
                                    });
                                } else if (key === 'listing_images' && Array.isArray(value)) {
                                    value.forEach(file => {
                                        formDataToSubmit.append('listing_images', file);
                                    });
                                } else if (typeof value === 'string') {
                                    formDataToSubmit.append(key, value);
                                }
                            });

                            const response = await fetch('/api/listings', {
                                method: 'POST',
                                body: formDataToSubmit
                            });

                            if (response.ok) {
                                const data = await response.json();
                                router.push(`/listings/${data.id}`);
                            }
                        }}
                        onBack={prevStep}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-4">Create New Listing</h1>
                <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                        {[1, 2, 3, 4].map((s) => (
                            <div
                                key={s}
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${s === step
                                    ? 'bg-blue-500 text-white'
                                    : s < step
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                {s}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {renderStep()}
        </div>
    );
}
// components/Hero.js
"use client"
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

interface HeroProps {
    imageUrl: string;
    imageAlt: string;
    heading: string;
}

const Hero = (props: HeroProps) => {
    const { userId } = useAuth();

    return (
        <section className="relative w-full h-[400px] sm:h-[600px]">
            {/* Hero Image */}
            <Image
                src={props.imageUrl}
                alt={props.imageAlt}
                fill
                style={{ objectFit: 'cover' }}
                priority
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Hero Text/Description */}
            <div className='container flex justify-center items-center absolute inset-0 text-white'>
                <div className='text-center max-w-3xl px-4'>
                    <h1 className='text-4xl md:text-5xl font-bold mb-4'>
                        {props.heading}
                    </h1>
                    <p className='text-lg md:text-xl mb-8 text-gray-100'>
                        Find your perfect match and start your journey to a better living situation
                    </p>

                    <div className='space-y-4'>
                        {userId ? (
                            <Link
                                href="/listings"
                                className='inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-300'
                            >
                                Start Matching
                            </Link>
                        ) : (
                            <Link
                                href="/sign-in"
                                className='inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors duration-300'
                            >
                                Sign in to Start Matching
                            </Link>
                        )}

                        <p className='text-sm text-gray-200'>
                            Join thousands of students and young professionals finding their ideal roommates
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;

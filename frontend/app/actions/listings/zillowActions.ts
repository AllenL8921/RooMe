'use server';

import { z } from 'zod';
import { headers } from 'next/headers';

const ZillowResponseSchema = z.object({
    title: z.string(),
    description: z.string(),
    price: z.number(),
    location: z.string(),
    category: z.string(),
    image_url: z.string().url().optional().or(z.literal('')),
});

export type ZillowResponse = z.infer<typeof ZillowResponseSchema>;

export async function fetchZillowListing(url: string): Promise<{ success: boolean; data?: ZillowResponse; error?: string }> {
    try {
        // Validate URL
        if (!url.includes('zillow.com')) {
            return { success: false, error: 'Invalid Zillow URL' };
        }

        // Get the current origin from headers
        const headersList = await headers();
        const host = headersList.get('host');
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const origin = `${protocol}://${host}`;

        // Make request to our API endpoint that will handle the Zillow scraping
        const response = await fetch(`${origin}/api/zillow?url=${encodeURIComponent(url)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch Zillow data');
        }

        const data = await response.json();

        // Validate the response data
        const validatedData = ZillowResponseSchema.parse(data);

        return { success: true, data: validatedData };
    } catch (error) {
        console.error('Error fetching Zillow listing:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch Zillow listing'
        };
    }
} 
import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });

        // Extract listing data
        const listingData = await page.evaluate(() => {
            const title = document.querySelector('h1')?.textContent?.trim() || '';
            const description = document.querySelector('[data-test="description"]')?.textContent?.trim() || '';
            const priceText = document.querySelector('[data-test="price"]')?.textContent?.trim() || '';
            const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
            const location = document.querySelector('[data-test="address"]')?.textContent?.trim() || '';
            const category = document.querySelector('[data-test="property-type"]')?.textContent?.trim() || '';
            const imageUrl = document.querySelector('[data-test="image"]')?.getAttribute('src') || '';

            return {
                title,
                description,
                price,
                location,
                category,
                image_url: imageUrl
            };
        });

        await browser.close();

        return NextResponse.json(listingData);
    } catch (error) {
        console.error('Error scraping Zillow:', error);
        return NextResponse.json(
            { error: 'Failed to fetch Zillow listing' },
            { status: 500 }
        );
    }
} 
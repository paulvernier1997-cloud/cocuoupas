import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
        return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const url = `https://instagram-looter2.p.rapidapi.com/search?query=${encodeURIComponent(query)}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
            'x-rapidapi-host': process.env.RAPIDAPI_HOST || ''
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        // On renvoie les résultats à ton interface
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
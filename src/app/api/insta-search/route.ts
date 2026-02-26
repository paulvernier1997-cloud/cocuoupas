import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) return NextResponse.json({ error: 'Query is required' }, { status: 400 });

    const url = `https://instagram-looter2.p.rapidapi.com/search?query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': process.env.RAPIDAPI_KEY || '',
                'x-rapidapi-host': process.env.RAPIDAPI_HOST || ''
            }
        });

        const result = await response.json();
        console.log("DEBUG API:", result); // Ceci s'affichera dans tes logs Vercel

        // Cette partie cherche les utilisateurs peu importe le nom de la case (users, data, etc.)
        const users = result.users || result.data || result.items || (Array.isArray(result) ? result : []);

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'API Error' }, { status: 500 });
    }
}
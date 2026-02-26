import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    // Si la recherche est vide, on arrête tout de suite
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

        // Sécurité au cas où l'API bloque (quota dépassé, erreur serveur)
        if (!response.ok) {
            console.error(`Erreur API: ${response.status}`);
            return NextResponse.json([], { status: 200 }); // On renvoie une liste vide pour ne pas faire planter le site
        }

        const result = await response.json();

        // On cible exactement le tableau "users" de la réponse d'Instagram
        const rawUsers = result.users || [];

        // On extrait la substantifique moelle (on sort les données de la case "user")
        const cleanUsers = rawUsers.map((item: any) => {
            const u = item.user || {};
            return {
                username: u.username || "",
                full_name: u.full_name || "",
                profile_pic_url: u.profile_pic_url || "",
                is_verified: u.is_verified || false
            };
        });

        // On renvoie la liste propre au site
        return NextResponse.json(cleanUsers);

    } catch (error) {
        console.error("Erreur d'exécution de la route:", error);
        return NextResponse.json([], { status: 200 }); // Pareil, on protège le frontend avec une liste vide
    }
}
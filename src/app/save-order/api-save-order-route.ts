// app/api/save-order/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, ref, offer, search, method } = await req.json();

    // Validation basique
    if (!email || !ref || !offer) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Insérer dans Supabase
    const { error } = await supabase.from("orders").insert({
      email,
      reference: ref,
      offer, // "standard" ou "integral"
      search_query: search, // ce qui a été recherché (email, @pseudo, etc.)
      search_method: method, // "EMAIL", "INSTA" ou "FACE"
      status: "pending", // tu le passeras à "paid" manuellement quand tu vois le paiement Stripe
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Erreur base de données" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("API error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

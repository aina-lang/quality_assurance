// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email et mot de passe requis" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
    }

    // Chercher l'utilisateur
    const [rows]: any = await pool.query(
      "SELECT * FROM clients WHERE email = ?",
      [email]
    );
    const user = rows?.[0];

    console.log(user);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Utilisateur non trouvé" },
        { status: 404, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Mot de passe incorrect" },
        { status: 401, headers: { "Access-Control-Allow-Origin": "*" } }
      );
    }

    // Générer le token JWT avec le rôle client
    const token = jwt.sign(
      { id: user.id, email: user.email, role: "client" },
      process.env.AUTH_SECRET as string,
      { expiresIn: "1h" }
    );


    const [rows1]: any = await pool.query(
      "SELECT * FROM subscriptions WHERE client_id = ?",
      [user.id]
    );


    console.log(rows1?.[0]);

    // Réponse JSON complète
    return NextResponse.json(
      {
        success: true,
        message: "Connexion réussie",
        data: {
          subscription: rows1?.[0],
          token,
          user: { ...user, role: "client" },

          // {
          //   id: user.id,
          //   email: user.email,
          //   company_name: user.company_name,
          //   account_type: user.account_type,
          // },
        },
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (err) {
    console.error("Erreur serveur:", err);
    return NextResponse.json(
      { success: false, message: "Erreur interne du serveur" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }
}

// Gérer les OPTIONS pour le préflight CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}


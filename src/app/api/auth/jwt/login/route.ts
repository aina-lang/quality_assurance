// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { pool } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";
import { Client, Subscription, JWTPayload } from "@/app/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email?: string; password?: string };
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
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM clients WHERE email = ?",
      [email]
    );
    const user = rows?.[0] as Client | undefined;

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
      { id: user.id, email: user.email, role: "client" } as JWTPayload,
      process.env.AUTH_SECRET as string,
      { expiresIn: "30m" }
    );

    const [rows1] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM subscriptions WHERE client_id = ?",
      [user.id]
    );
    const subscription = rows1?.[0] as Subscription | undefined;

    // Réponse JSON complète
    return NextResponse.json(
      {
        success: true,
        message: "Connexion réussie",
        data: {
          subscription,
          token,
          user: { ...user, role: "client" as const },
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
    const error = err as Error;
    console.error("Erreur serveur:", error);
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


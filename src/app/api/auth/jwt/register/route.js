import bcrypt from "bcrypt"
import { pool } from "@/app/lib/db"

export async function POST(req) {
    try {
        const { email, password } = await req.json()

        // Vérifie les entrées
        if (!email || !password) {
            return new Response(
                JSON.stringify({ error: "Email et mot de passe requis" }),
                { status: 400 }
            )
        }

        // Vérifie si l'utilisateur existe déjà
        const [rows] = await pool.query("SELECT * FROM clients WHERE email = ?", [email])
        if (rows.length > 0) {
            return new Response(
                JSON.stringify({ error: "Un utilisateur avec cet email existe déjà" }),
                { status: 409 }
            )
        }

        // Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10)

        // Insère le nouvel utilisateur
        await pool.query("INSERT INTO clients (email, password) VALUES (?, ?)", [
            email,
            hashedPassword,
        ])

        return new Response(
            JSON.stringify({ message: "Utilisateur créé avec succès" }),
            { status: 201 }
        )
    } catch (err) {
        console.error(err)
        return new Response(
            JSON.stringify({ error: "Erreur serveur" }),
            { status: 500 }
        )
    }
}

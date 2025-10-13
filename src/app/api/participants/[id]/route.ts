import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/lib/db";
import { Participant } from "@/app/lib/types";

// Fonction utilitaire pour CORS
const addCORSHeaders = (response: NextResponse) => {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Max-Age", "86400");
    return response;
};

// Handler OPTIONS (préflight CORS)
export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });
    return addCORSHeaders(response);
}

// GET : Récupérer un participant par ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const [rows] = await pool.execute("SELECT * FROM participants WHERE id = ?", [params.id]);
        if ((rows as any[]).length === 0) throw new Error("Participant non trouvé");

        const response = NextResponse.json({ data: (rows as any[])[0] }, { status: 200 });
        return addCORSHeaders(response);
    } catch (error: any) {
        console.error("Erreur GET /participants/[id]:", error);
        const response = NextResponse.json({ message: error.message }, { status: 404 });
        return addCORSHeaders(response);
    }
}

// PUT : Modifier un participant
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const body = (await req.json()) as Partial<Participant>;

        const setClauses: string[] = [];
        const values: any[] = [];

        if (body.name !== undefined) {
            setClauses.push("name = ?");
            values.push(body.name);
        }
        if (body.email !== undefined) {
            setClauses.push("email = ?");
            values.push(body.email);
        }
        if (body.poste !== undefined) {
            setClauses.push("poste = ?");
            values.push(body.poste);
        }
        if (body.domain_id !== undefined) {
            setClauses.push("domain_id = ?");
            values.push(body.domain_id);
        }

        if (setClauses.length === 0) throw new Error("Aucun champ à mettre à jour");

        values.push(params.id);

        const [result] = await pool.execute(
            `UPDATE participants SET ${setClauses.join(", ")} WHERE id = ?`,
            values
        );

        if ((result as any).affectedRows === 0) throw new Error("Participant non trouvé");

        const [updated] = await pool.execute("SELECT * FROM participants WHERE id = ?", [params.id]);
        const response = NextResponse.json({ data: (updated as any[])[0] }, { status: 200 });
        return addCORSHeaders(response);
    } catch (error: any) {
        console.error("Erreur PUT /participants/[id]:", error);
        const response = NextResponse.json({ message: error.message }, { status: 400 });
        return addCORSHeaders(response);
    }
}

// DELETE : Supprimer un participant
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const [result] = await pool.execute("DELETE FROM participants WHERE id = ?", [params.id]);
        if ((result as any).affectedRows === 0) throw new Error("Participant non trouvé");

        const response = NextResponse.json({ message: "Participant supprimé" }, { status: 200 });
        return addCORSHeaders(response);
    } catch (error: any) {
        console.error("Erreur DELETE /participants/[id]:", error);
        const response = NextResponse.json({ message: error.message }, { status: 400 });
        return addCORSHeaders(response);
    }
}

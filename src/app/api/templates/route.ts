import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { pool } from "@/app/lib/db";
import { Template } from "@/app/lib/types";
import { verifyToken } from "@/lib/utils";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";

// Ajout headers CORS
const addCORSHeaders = (response: NextResponse) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
};

// OPTIONS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return addCORSHeaders(response);
}

export async function POST(req: NextRequest) {
  try {
    verifyToken(req);
    const body = await req.json() as Omit<Template, "id" | "created_at" | "updated_at"> & {
      preview_image_base64?: string; // image encodée en Base64
    };

    if (!body.name || !body.domain_id)
      throw new Error("Champs requis : name et domain_id");

    console.log(body);

    let previewImageUrl: string | null = null;

    if (body.preview_image_base64) {
      const matches = body.preview_image_base64.match(/^data:(.+);base64,(.+)$/);
      if (!matches) throw new Error("Format image invalide");

      const ext = matches[1].split("/")[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);

      previewImageUrl = `/uploads/${fileName}`;
    }

    const [result] = await pool.execute(
      "INSERT INTO templates (domain_id, name, content, preview_image) VALUES (?, ?, ?, ?)",
      [
        body.domain_id,
        body.name,
        JSON.stringify(body.content || {}),
        previewImageUrl,
      ]
    );

    const insertId = (result as ResultSetHeader).insertId;
    console.log("id inserée", insertId);

    if (!insertId) {
      throw new Error('Erreur lors de la création du template');
    }

    const [newTemplate] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM templates WHERE id = ?",
      [insertId]
    );

    const response = NextResponse.json({ data: newTemplate[0] as Template }, { status: 201 });
    return addCORSHeaders(response);
  } catch (error) {
    const err = error as Error;
    const response = NextResponse.json({ message: err.message }, { status: 400 });
    return addCORSHeaders(response);
  }
}

// PUT : Mettre à jour un template
export async function PUT(req: NextRequest) {
  try {
    verifyToken(req);
    const body = await req.json() as Template;
    if (!body.id) throw new Error('ID requis');

    const setClauses: string[] = [];
    const params: (string | number | unknown)[] = [];

    if (body.name !== undefined) { setClauses.push('name = ?'); params.push(body.name); }
    if (body.content !== undefined) { setClauses.push('content = ?'); params.push(JSON.stringify(body.content)); }
    if (body.domain_id !== undefined) { setClauses.push('domain_id = ?'); params.push(body.domain_id); }
    if (body.preview_image !== undefined) { setClauses.push('preview_image = ?'); params.push(body.preview_image); }

    params.push(body.id);

    const [updateResult] = await pool.execute(
      `UPDATE templates SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );

    if ((updateResult as unknown as { affectedRows: number }).affectedRows === 0) throw new Error('Template non trouvé');

    const [updated] = await pool.execute<RowDataPacket[]>('SELECT * FROM templates WHERE id = ?', [body.id]);
    const response = NextResponse.json({ data: updated[0] as Template }, { status: 200 });
    return addCORSHeaders(response);
  } catch (error) {
    const err = error as Error;
    const response = NextResponse.json({ message: err.message }, { status: 400 });
    return addCORSHeaders(response);
  }
}


// DELETE : Supprimer un template
export async function DELETE(req: NextRequest) {
  try {
    const decoded = verifyToken(req);
    console.log(decoded);

    if (!decoded) {
      const res = NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
      return addCORSHeaders(res);
    }
    const { id } = await req.json() as { id: number };
    if (!id) throw new Error('ID requis');

    const [result] = await pool.execute('DELETE FROM templates WHERE id = ?', [id]);
    if ((result as unknown as { affectedRows: number }).affectedRows === 0) throw new Error('Template non trouvé');

    const response = NextResponse.json({ message: 'Template supprimé' }, { status: 200 });
    return addCORSHeaders(response);
  } catch (error) {
    const err = error as Error;
    const response = NextResponse.json({ message: err.message }, { status: 400 });
    return addCORSHeaders(response);
  }
}


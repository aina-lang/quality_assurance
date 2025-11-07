import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/lib/db";
import { Template } from "@/app/lib/types";
import { verifyToken } from "@/lib/utils";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// ============================================================
// ⚙️ Configuration DigitalOcean Spaces
// ============================================================
const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION ?? "sfo3",
  endpoint: process.env.DO_SPACES_ENDPOINT ?? "https://sfo3.digitaloceanspaces.com",
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

// ============================================================
// 🧩 Helper CORS
// ============================================================
const addCORSHeaders = (response: NextResponse) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
};

export async function OPTIONS() {
  return addCORSHeaders(new NextResponse(null, { status: 204 }));
}

// ============================================================
// 🟢 POST - Ajouter un template
// ============================================================
export async function POST(req: NextRequest) {
  try {
    verifyToken(req);

    const body = (await req.json()) as Omit<Template, "id" | "created_at" | "updated_at"> & {
      preview_image_base64?: string;
    };

    if (!body.name || !body.domain_id) throw new Error("Champs requis : name et domain_id");

    let previewImageUrl: string | null = null;

    // 📸 Upload image sur DigitalOcean Spaces
    if (body.preview_image_base64) {
      const matches = body.preview_image_base64.match(/^data:(.+);base64,(.+)$/);
      if (!matches) throw new Error("Format image invalide");

      const contentType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");

      const ext = contentType.split("/")[1];
      const key = `uploads/templates/${Date.now()}.${ext}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          ACL: "public-read",
        })
      );

      previewImageUrl = `${process.env.DO_SPACES_ENDPOINT!.replace(
        "https://",
        `https://${process.env.DO_SPACES_BUCKET!}.`
      )}/${key}`;
    }

    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO templates (domain_id, name, content, preview_image) VALUES (?, ?, ?, ?)",
      [body.domain_id, body.name, JSON.stringify(body.content || {}), previewImageUrl]
    );

    const insertId = result.insertId;
    if (!insertId) throw new Error("Erreur lors de la création du template");

    const [newTemplate] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM templates WHERE id = ?",
      [insertId]
    );

    return addCORSHeaders(NextResponse.json({ data: newTemplate[0] as Template }, { status: 201 }));
  } catch (error) {
    console.error("❌ Erreur POST template:", error);
    return addCORSHeaders(
      NextResponse.json({ message: (error as Error).message }, { status: 400 })
    );
  }
}

// ============================================================
// 🟡 PUT - Mettre à jour un template
// ============================================================
export async function PUT(req: NextRequest) {
  try {
    verifyToken(req);

    const body = (await req.json()) as Template & { preview_image_base64?: string };
    if (!body.id) throw new Error("ID requis");

    const setClauses: string[] = [];
    const params: (string | number | unknown)[] = [];

    // 🖼️ Nouvelle image ?
    if (body.preview_image_base64) {
      const matches = body.preview_image_base64.match(/^data:(.+);base64,(.+)$/);
      if (!matches) throw new Error("Format image invalide");

      const contentType = matches[1];
      const base64Data = matches[2];
      const buffer = Buffer.from(base64Data, "base64");
      const ext = contentType.split("/")[1];
      const key = `uploads/templates/${Date.now()}.${ext}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: contentType,
          ACL: "public-read",
        })
      );

      const previewImageUrl = `${process.env.DO_SPACES_ENDPOINT!.replace(
        "https://",
        `https://${process.env.DO_SPACES_BUCKET!}.`
      )}/${key}`;

      setClauses.push("preview_image = ?");
      params.push(previewImageUrl);
    }

    if (body.name !== undefined) {
      setClauses.push("name = ?");
      params.push(body.name);
    }
    if (body.content !== undefined) {
      setClauses.push("content = ?");
      params.push(JSON.stringify(body.content));
    }
    if (body.domain_id !== undefined) {
      setClauses.push("domain_id = ?");
      params.push(body.domain_id);
    }

    params.push(body.id);

    const [updateResult] = await pool.execute<ResultSetHeader>(
      `UPDATE templates SET ${setClauses.join(", ")} WHERE id = ?`,
      params
    );

    if (updateResult.affectedRows === 0) throw new Error("Template non trouvé");

    const [updated] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM templates WHERE id = ?",
      [body.id]
    );

    return addCORSHeaders(NextResponse.json({ data: updated[0] as Template }, { status: 200 }));
  } catch (error) {
    console.error("❌ Erreur PUT template:", error);
    return addCORSHeaders(
      NextResponse.json({ message: (error as Error).message }, { status: 400 })
    );
  }
}

// ============================================================
// 🔴 DELETE - Supprimer un template + image associée
// ============================================================
export async function DELETE(req: NextRequest) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return addCORSHeaders(NextResponse.json({ message: "Non autorisé" }, { status: 401 }));
    }

    const { id } = (await req.json()) as { id: number };
    if (!id) throw new Error("ID requis");

    // 🔍 Récupérer le template avant suppression
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT preview_image FROM templates WHERE id = ?",
      [id]
    );

    if (!rows.length) throw new Error("Template non trouvé");

    const imageUrl = rows[0].preview_image as string | null;

    // 🧹 Supprimer le fichier sur Spaces s’il existe
    if (imageUrl) {
      const bucket = process.env.DO_SPACES_BUCKET!;
      const endpoint = process.env.DO_SPACES_ENDPOINT!;
      const key = imageUrl.replace(`${endpoint.replace("https://", `https://${bucket}.`)}/`, "");

      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
          })
        );
        console.log(`🗑️ Image supprimée: ${key}`);
      } catch (err) {
        console.warn("⚠️ Impossible de supprimer l’image:", err);
      }
    }

    // 🗃️ Supprimer le template en DB
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM templates WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) throw new Error("Template non trouvé");

    return addCORSHeaders(
      NextResponse.json({ message: "Template et image supprimés" }, { status: 200 })
    );
  } catch (error) {
    console.error("❌ Erreur DELETE template:", error);
    return addCORSHeaders(
      NextResponse.json({ message: (error as Error).message }, { status: 400 })
    );
  }
}

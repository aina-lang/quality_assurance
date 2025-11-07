import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/app/lib/db";
import { verifyToken } from "@/lib/utils";
import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

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
// 🟢 POST - Créer un template + fichiers
// ============================================================
export async function POST(req: NextRequest) {
  try {
    verifyToken(req);

    const formData = await req.formData();
    const name = formData.get("name")?.toString() || "";
    const domain_id = formData.get("domain_id")?.toString() || "";
    const content = formData.get("content")?.toString() || "{}";
    const previewBase64 = formData.get("preview_image_base64")?.toString() || "";
    const attachmentsMeta = JSON.parse(formData.get("attachments_meta")?.toString() || "[]");
    const attachments = formData.getAll("attachments[]") as File[];

    if (!name || !domain_id) throw new Error("Champs requis : name et domain_id");

    let previewImageUrl: string | null = null;

    // Upload preview image
    if (previewBase64) {
      const match = previewBase64.match(/^data:(.+);base64,(.+)$/);
      if (!match) throw new Error("Format image invalide");
      const [_, mime, b64] = match;
      const ext = mime.split("/")[1];
      const buffer = Buffer.from(b64, "base64");
      const key = `uploads/templates/${Date.now()}.${ext}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: mime,
          ACL: "public-read",
        })
      );

      previewImageUrl = `${process.env.DO_SPACES_ENDPOINT!.replace(
        "https://",
        `https://${process.env.DO_SPACES_BUCKET!}.`
      )}/${key}`;
    }

    // Sauvegarde template
    const [res] = await pool.execute<ResultSetHeader>(
      "INSERT INTO templates (domain_id, name, content, preview_image) VALUES (?, ?, ?, ?)",
      [domain_id, name, content, previewImageUrl]
    );
    const templateId = res.insertId;
    if (!templateId) throw new Error("Erreur lors de la création du template");

    // Upload et enregistrer les fichiers attachés
    for (const [i, file] of attachments.entries()) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const key = `uploads/templates/files/${Date.now()}_${file.name}`;
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: file.type || "application/octet-stream",
          ACL: "public-read",
        })
      );
      const fileUrl = `${process.env.DO_SPACES_ENDPOINT!.replace(
        "https://",
        `https://${process.env.DO_SPACES_BUCKET!}.`
      )}/${key}`;

      await pool.execute(
        "INSERT INTO template_files (template_id, name, url, file_type, size_bytes) VALUES (?, ?, ?, ?, ?)",
        [templateId, file.name, fileUrl, file.type, file.size]
      );
    }

    const [newTemplate] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM templates WHERE id = ?",
      [templateId]
    );

    return addCORSHeaders(
      NextResponse.json({ data: newTemplate[0], message: "Template créé avec succès" }, { status: 201 })
    );
  } catch (error) {
    console.error("❌ POST erreur:", error);
    return addCORSHeaders(NextResponse.json({ message: (error as Error).message }, { status: 400 }));
  }
}

// ============================================================
// 🟡 PUT - Mise à jour d’un template
// ============================================================
export async function PUT(req: NextRequest) {
  try {
    verifyToken(req);
    const formData = await req.formData();
    const id = formData.get("id")?.toString();
    if (!id) throw new Error("ID requis");

    const name = formData.get("name")?.toString() ?? null;
    const domain_id = formData.get("domain_id")?.toString() ?? null;
    const content = formData.get("content")?.toString() ?? null;
    const previewBase64 = formData.get("preview_image_base64")?.toString() ?? null;
    const attachments = formData.getAll("attachments[]") as File[];

    const updates: string[] = [];
    const params: any[] = [];

    if (name) {
      updates.push("name = ?");
      params.push(name);
    }
    if (domain_id) {
      updates.push("domain_id = ?");
      params.push(domain_id);
    }
    if (content) {
      updates.push("content = ?");
      params.push(content);
    }

    if (previewBase64) {
      const match = previewBase64.match(/^data:(.+);base64,(.+)$/);
      if (!match) throw new Error("Format image invalide");
      const [_, mime, b64] = match;
      const ext = mime.split("/")[1];
      const buffer = Buffer.from(b64, "base64");
      const key = `uploads/templates/${Date.now()}.${ext}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: mime,
          ACL: "public-read",
        })
      );

      const url = `${process.env.DO_SPACES_ENDPOINT!.replace(
        "https://",
        `https://${process.env.DO_SPACES_BUCKET!}.`
      )}/${key}`;
      updates.push("preview_image = ?");
      params.push(url);
    }

    params.push(id);

    if (updates.length > 0) {
      await pool.execute<ResultSetHeader>(
        `UPDATE templates SET ${updates.join(", ")} WHERE id = ?`,
        params
      );
    }

    // 🔄 Réupload fichiers
    for (const file of attachments) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const key = `uploads/templates/files/${Date.now()}_${file.name}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.DO_SPACES_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: file.type || "application/octet-stream",
          ACL: "public-read",
        })
      );

      const fileUrl = `${process.env.DO_SPACES_ENDPOINT!.replace(
        "https://",
        `https://${process.env.DO_SPACES_BUCKET!}.`
      )}/${key}`;

      await pool.execute(
        "INSERT INTO template_files (template_id, name, url, file_type, size_bytes) VALUES (?, ?, ?, ?, ?)",
        [id, file.name, fileUrl, file.type, file.size]
      );
    }

    const [updated] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM templates WHERE id = ?",
      [id]
    );

    return addCORSHeaders(NextResponse.json({ data: updated[0], message: "Template mis à jour" }));
  } catch (error) {
    console.error("❌ PUT erreur:", error);
    return addCORSHeaders(NextResponse.json({ message: (error as Error).message }, { status: 400 }));
  }
}

// ============================================================
// 🔴 DELETE - Supprimer template + fichiers
// ============================================================
export async function DELETE(req: NextRequest) {
  try {
    verifyToken(req);
    const { id } = (await req.json()) as { id: number };
    if (!id) throw new Error("ID requis");

    const [files] = await pool.execute<RowDataPacket[]>(
      "SELECT url FROM template_files WHERE template_id = ?",
      [id]
    );

    // Supprime fichiers S3
    for (const file of files) {
      const url = file.url as string;
      const key = url.replace(
        `${process.env.DO_SPACES_ENDPOINT!.replace(
          "https://",
          `https://${process.env.DO_SPACES_BUCKET!}.`
        )}/`,
        ""
      );
      await s3.send(new DeleteObjectCommand({ Bucket: process.env.DO_SPACES_BUCKET!, Key: key }));
    }

    await pool.execute("DELETE FROM templates WHERE id = ?", [id]);

    return addCORSHeaders(NextResponse.json({ message: "Template supprimé avec succès" }));
  } catch (error) {
    console.error("❌ DELETE erreur:", error);
    return addCORSHeaders(NextResponse.json({ message: (error as Error).message }, { status: 400 }));
  }
}
// ============================================================
// 🔵 GET - Liste ou un seul template
// ============================================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domain_id = searchParams.get("domain_id");
    const id = searchParams.get("id");

    if (id) {
      // ✅ GET by ID
      const [templates] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM templates WHERE id = ?",
        [id]
      );

      if (templates.length === 0)
        return addCORSHeaders(NextResponse.json({ message: "Template introuvable" }, { status: 404 }));

      const [files] = await pool.execute<RowDataPacket[]>(
        "SELECT id, name, url, file_type, size_bytes FROM template_files WHERE template_id = ?",
        [id]
      );

      const template = { ...templates[0], files };
      return addCORSHeaders(NextResponse.json({ data: template }));
    }

    // ✅ Sinon, liste complète ou filtrée
    let query = "SELECT * FROM templates";
    const params: any[] = [];

    if (domain_id) {
      query += " WHERE domain_id = ?";
      params.push(domain_id);
    }

    const [templates] = await pool.execute<RowDataPacket[]>(query, params);

    for (const t of templates) {
      const [files] = await pool.execute<RowDataPacket[]>(
        "SELECT id, name, url, file_type, size_bytes FROM template_files WHERE template_id = ?",
        [t.id]
      );
      t.files = files;
    }

    return addCORSHeaders(NextResponse.json({ data: templates }));
  } catch (error) {
    console.error("❌ GET erreur:", error);
    return addCORSHeaders(NextResponse.json({ message: (error as Error).message }, { status: 400 }));
  }
}
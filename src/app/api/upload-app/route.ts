import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 🧠 Configuration DigitalOcean Spaces
const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION || "sfo3",
  endpoint: process.env.DO_SPACES_ENDPOINT || "https://sfo3.digitaloceanspaces.com",
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || "DO00X98QVUBHQ9NY8FRX",
    secretAccessKey:
      process.env.DO_SPACES_SECRET || "frk9e06ywUB2+MOTVy/dia8Rvv3GljZqhS82nKCFC6g",
  },
});

export async function POST(req: Request) {
  try {
    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Nom de fichier ou type de contenu manquant" },
        { status: 400 }
      );
    }

    // 🗂️ Stockage dans le dossier "app-versions/"
    const key = `app-versions/${Date.now()}-${filename}`;

    // 🔐 Prépare la commande pour générer une URL signée
    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET || "smartfilepro",
      Key: key,
      ContentType: contentType,
      ACL: "public-read",
 
      // pour que le fichier soit accessible via URL publique
    });

    // ⏳ URL pré-signée (valable 5 minutes)
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

    // 🌐 Final public file URL
    const fileUrl = `${process.env.DO_SPACES_ENDPOINT!.replace(
      "https://",
      `https://${process.env.DO_SPACES_BUCKET!}.`
    )}/${key}`;

    return NextResponse.json({ uploadUrl, fileUrl });
  } catch (error) {
    console.error("❌ Erreur génération presigned URL:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'URL pré-signée" },
      { status: 500 }
    );
  }
}

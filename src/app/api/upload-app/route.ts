import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION || "sfo3",
  endpoint: process.env.DO_SPACES_ENDPOINT || "https://sfo3.digitaloceanspaces.com",
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || "DO00X98QVUBHQ9NY8FRX",
    secretAccessKey: process.env.DO_SPACES_SECRET || "frk9e06ywUB2+MOTVy/dia8Rvv3GljZqhS82nKCFC6g",
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

    // ➕ on stocke dans le dossier "app-versions"
    const key = `app-versions/${Date.now()}-${filename}`;

    // Commande pour upload
    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: key,
      ContentType: contentType,
      ACL: "public-read", // Rend le fichier accessible publiquement
    });

    // URL pré-signée valide 5 min
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

    // URL publique du fichier final
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

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
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

// 🧩 GET — Génère une URL signée de téléchargement
export async function GET(req: Request) {
    try {
        // Exemple : /api/download?file=app-versions/123456789-setup.exe
        const { searchParams } = new URL(req.url);
        const fileKey = searchParams.get("file");

        if (!fileKey) {
            return NextResponse.json({ error: "Paramètre 'file' manquant" }, { status: 400 });
        }

        const command = new GetObjectCommand({
            Bucket: process.env.DO_SPACES_BUCKET || "smartfilepro",
            Key: fileKey,
        });

        // ⏳ Download URL valid for 5 minutes
        const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });

        return NextResponse.json({ downloadUrl });
    } catch (error) {
        console.error("❌ Erreur génération presigned download URL:", error);
        return NextResponse.json(
            { error: "Erreur lors de la création du lien de téléchargement" },
            { status: 500 }
        );
    }
}

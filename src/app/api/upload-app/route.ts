import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createAppVersion } from "@/app/actions/backoffice";
import { v4 as uuidv4 } from "uuid";

export const config = {
  api: { bodyParser: false },
};

export const POST = async (req: Request) => {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json({ error: "Content-Type invalide" }, { status: 400 });
    }

    // Créer dossier uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(uploadDir, { recursive: true });

    // Lire le fichier en tant que stream (attention: simple, ne parse pas multipart)
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${uuidv4()}.bin`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // Ici tu peux récupérer fields si tu veux via un parser multipart léger
    const data = {
      os: "android",
      version: "1.0.0",
      size: buffer.length.toString(),
      cpu_requirement: "",
      ram_requirement: "",
      storage_requirement: "",
      download_link: `/uploads/${fileName}`,
    };

    const result = await createAppVersion(data);

    return NextResponse.json({
      success: true,
      id: result.id,
      file_url: data.download_link,
    });
  } catch (err) {
    console.error("Erreur Upload :", err);
    return NextResponse.json({ error: "Erreur lors de l'upload." }, { status: 500 });
  }
};

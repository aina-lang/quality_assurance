// src/app/api/upload-app/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { createAppVersion } from "@/app/actions/backoffice";

// ⚠️ Désactiver le bodyParser de Next.js pour supporter le streaming
export const config = {
  api: { bodyParser: false },
};

export const POST = async (req: Request) => {
  try {
    console.log("✅ Upload request received");

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data")) {
      console.warn("⚠️ Content-Type invalide:", contentType);
      return NextResponse.json(
        { error: "Content-Type invalide, utilisez multipart/form-data" },
        { status: 400 }
      );
    }

    // 📁 Créer le dossier uploads s'il n'existe pas
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    console.log(`📁 Upload directory: ${uploadDir}`);

    // 🔹 Récupérer les données du FormData
    const formData = await req.formData();

    // Fichier
    const file = formData.get("file") as File | null;
    if (!file) {
      console.warn("⚠️ Aucun fichier reçu");
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    // Générer un nom unique pour le fichier
    const originalName = file.name;
    const uniqueFileName = `${uuidv4()}-${originalName}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Sauvegarder le fichier
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
    console.log(`📦 Fichier enregistré: ${filePath}, taille: ${buffer.length} bytes`);

    // 🔹 Helper pour récupérer champs
    const getString = (value: FormDataEntryValue | null) => {
      if (!value) return "";
      return typeof value === "string" ? value : value.name;
    };

    // Préparer les données pour la DB
    const data = {
      os: getString(formData.get("os")),
      version: getString(formData.get("version")),
      size: buffer.length.toString(),
      cpu_requirement: getString(formData.get("cpu_requirement")),
      ram_requirement: getString(formData.get("ram_requirement")),
      storage_requirement: getString(formData.get("storage_requirement")),
      download_link: `/uploads/${uniqueFileName}`,
    };

    console.log("💾 Data to save in DB:", data);

    // 🧩 Sauvegarder dans la base
    const result = await createAppVersion(data);
    console.log(`✅ App version saved with ID: ${result.id}`);

    return NextResponse.json({
      success: true,
      id: result.id,
      file_url: data.download_link,
    });
  } catch (err) {
    console.error("❌ Unexpected API error:", err);
    return NextResponse.json(
      { error: "Erreur inattendue lors de l'upload." },
      { status: 500 }
    );
  }
};

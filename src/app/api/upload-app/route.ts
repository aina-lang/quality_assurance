import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createAppVersion } from "@/app/actions/backoffice";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
    }

    // 📁 Enregistrement du fichier sur le serveur
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadsDir, file.name);
    await fs.writeFile(filePath, buffer);

    // 📦 Préparer les données à insérer dans la base
    const data = {
      os: formData.get("os") as string,
      version: formData.get("version") as string,
      size: file.size.toString(),
      cpu_requirement: formData.get("cpu_requirement") as string || "",
      ram_requirement: formData.get("ram_requirement") as string || "",
      storage_requirement: formData.get("storage_requirement") as string || "",
      download_link: `/uploads/${file.name}`,
    };

    // 🧩 Appel à la fonction de création
    const result = await createAppVersion(data);

    return NextResponse.json({
      success: true,
      id: result.id,
      file_url: data.download_link,
    });
  } catch (err) {
    console.error("Erreur API Upload :", err);
    return NextResponse.json(
      { error: "Erreur lors de l'upload de l'application." },
      { status: 500 }
    );
  }
};

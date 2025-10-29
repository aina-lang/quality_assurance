import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import formidable, { File as FormidableFile } from "formidable";
import { v4 as uuidv4 } from "uuid";
import { createAppVersion } from "@/app/actions/backoffice";

// Désactiver le body parser
export const config = {
  api: { bodyParser: false },
};

export const POST = async (req: any) => {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(uploadDir, { recursive: true });

    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFileSize: 4 * 1024 * 1024 * 1024, // 4 Go
    });

    return new Promise((resolve) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("❌ Formidable error:", err);
          return resolve(
            NextResponse.json(
              { error: "Erreur lors de l'upload de l'application." },
              { status: 500 }
            )
          );
        }

        const uploadedFiles = files.file;
        if (!uploadedFiles) {
          return resolve(
            NextResponse.json({ error: "Fichier manquant" }, { status: 400 })
          );
        }

        let file: FormidableFile;
        if (Array.isArray(uploadedFiles)) {
          file = uploadedFiles[0];
        } else {
          file = uploadedFiles as FormidableFile;
        }

        const uniqueName = `${uuidv4()}-${file.originalFilename || file.newFilename}`;
        const finalPath = path.join(uploadDir, uniqueName);
        fs.renameSync(file.filepath, finalPath);

        const getString = (value: string | string[] | undefined) => {
          if (Array.isArray(value)) return value[0];
          return value ?? "";
        };

        const data = {
          os: getString(fields.os),
          version: getString(fields.version),
          size: file.size.toString(),
          cpu_requirement: getString(fields.cpu_requirement),
          ram_requirement: getString(fields.ram_requirement),
          storage_requirement: getString(fields.storage_requirement),
          download_link: `/uploads/${uniqueName}`,
        };

        const result = await createAppVersion(data);

        return resolve(
          NextResponse.json({
            success: true,
            id: result.id,
            file_url: data.download_link,
          })
        );
      });
    });
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return NextResponse.json(
      { error: "Erreur inattendue lors de l'upload." },
      { status: 500 }
    );
  }
};

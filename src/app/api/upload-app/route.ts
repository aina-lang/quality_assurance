import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import busboy from "busboy";
import { v4 as uuidv4 } from "uuid";
import { createAppVersion } from "@/app/actions/backoffice";

// Utiliser le runtime Node.js pour avoir accès au système de fichiers
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: Request) {
  return new Promise((resolve, reject) => {
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      fs.mkdirSync(uploadDir, { recursive: true });

      // Initialiser Busboy avec les headers du Fetch Request
      const bb = busboy({ headers: Object.fromEntries(request.headers) });

      let fileInfo: {
        filename?: string;
        filepath?: string;
        size?: number;
      } = {};

      let fields: Record<string, string> = {};

      // Gérer les fichiers
      bb.on("file", (_name, file, info) => {
        const { filename } = info;
        const uniqueName = `${uuidv4()}-${filename}`;
        const saveTo = path.join(uploadDir, uniqueName);

        fileInfo = {
          filename: uniqueName,
          filepath: saveTo,
          size: 0,
        };

        const writeStream = fs.createWriteStream(saveTo);
        file.pipe(writeStream);

        file.on("data", (data) => {
          fileInfo.size! += data.length;
        });

        file.on("end", () => {
          writeStream.end();
        });
      });

      // Gérer les champs du formulaire
      bb.on("field", (name, value) => {
        fields[name] = value;
      });

      // Quand tout est fini
      bb.on("close", async () => {
        if (!fileInfo.filepath) {
          return resolve(
            NextResponse.json({ error: "Fichier manquant" }, { status: 400 })
          );
        }

        const data = {
          os: fields.os || "",
          version: fields.version || "",
          size: fileInfo.size?.toString() || "0",
          cpu_requirement: fields.cpu_requirement || "",
          ram_requirement: fields.ram_requirement || "",
          storage_requirement: fields.storage_requirement || "",
          download_link: `/uploads/${fileInfo.filename}`,
        };

        try {
          const result = await createAppVersion(data);

          resolve(
            NextResponse.json({
              success: true,
              id: result.id,
              file_url: data.download_link,
            })
          );
        } catch (err) {
          console.error("❌ createAppVersion error:", err);
          resolve(
            NextResponse.json(
              { error: "Erreur lors de l'enregistrement." },
              { status: 500 }
            )
          );
        }
      });

      // Gérer les erreurs
      bb.on("error", (err) => {
        console.error("❌ Busboy error:", err);
        reject(
          NextResponse.json(
            { error: "Erreur lors du traitement du fichier." },
            { status: 500 }
          )
        );
      });

      // ✅ Convertir la requête en flux pour Busboy
      request.body?.pipeTo(
        new WritableStream({
          write(chunk) {
            bb.write(chunk);
          },
          close() {
            bb.end();
          },
        })
      );
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      reject(
        NextResponse.json(
          { error: "Erreur inattendue lors de l'upload." },
          { status: 500 }
        )
      );
    }
  });
}

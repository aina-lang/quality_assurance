import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import busboy from "busboy";
import { v4 as uuidv4 } from "uuid";
import { createAppVersion } from "@/app/actions/backoffice";

// 🔧 Important : exécution côté Node (pas Edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 🧩 Désactive le bodyParser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  return new Promise(async (resolve, reject) => {
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      fs.mkdirSync(uploadDir, { recursive: true });

      const headers = Object.fromEntries(request.headers);
      const contentType = headers["content-type"];

      if (!contentType?.startsWith("multipart/form-data")) {
        return resolve(
          NextResponse.json(
            { error: "Content-Type invalide. multipart/form-data attendu." },
            { status: 400 }
          )
        );
      }

      const bb = busboy({
        headers,
        limits: { fileSize: 4 * 1024 * 1024 * 1024 }, // 4 GB
      });

      const fields: Record<string, string> = {};
      let uploadedFilePath = "";
      let uploadedFileSize = 0;
      let uploadedFileName = "";

      bb.on("file", (_name, file, info) => {
        const { filename } = info;
        const uniqueName = `${uuidv4()}-${filename}`;
        const savePath = path.join(uploadDir, uniqueName);
        uploadedFileName = uniqueName;

        const writeStream = fs.createWriteStream(savePath);

        file.on("data", (chunk) => {
          uploadedFileSize += chunk.length;
        });

        file.pipe(writeStream);

        writeStream.on("close", () => {
          uploadedFilePath = `/uploads/${uniqueName}`;
        });

        file.on("error", (err) => {
          console.error("Erreur fichier:", err);
          reject(
            NextResponse.json(
              { error: "Erreur lors de la lecture du fichier." },
              { status: 500 }
            )
          );
        });
      });

      bb.on("field", (name, value) => {
        fields[name] = value;
      });

      bb.on("error", (err) => {
        console.error("❌ Busboy error:", err);
        reject(
          NextResponse.json(
            { error: "Erreur pendant le parsing du formulaire." },
            { status: 500 }
          )
        );
      });

      bb.on("finish", async () => {
        if (!uploadedFilePath) {
          return resolve(
            NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 })
          );
        }

        const data = {
          os: fields.os || "",
          version: fields.version || "",
          cpu_requirement: fields.cpu_requirement || "",
          ram_requirement: fields.ram_requirement || "",
          storage_requirement: fields.storage_requirement || "",
          size: uploadedFileSize.toString(),
          download_link: uploadedFilePath,
        };

        const result = await createAppVersion(data);

        resolve(
          NextResponse.json({
            success: true,
            id: result.id,
            file_url: uploadedFilePath,
          })
        );
      });

      // ✅ Correction ici : connexion fiable du flux
      const reader = request.body?.getReader();
      if (!reader) throw new Error("Flux de requête introuvable");

      async function read() {
        const { done, value } = await reader.read();
        if (done) {
          bb.end();
          return;
        }
        bb.write(value);
        await read();
      }

      await read();
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

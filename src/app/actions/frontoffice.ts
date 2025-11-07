"use server";

import bcrypt from "bcryptjs";
import { pool } from "../lib/db";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// 🧠 Configuration DigitalOcean Spaces
const s3 = new S3Client({
  region: process.env.DO_SPACES_REGION || "sfo3",
  endpoint: process.env.DO_SPACES_ENDPOINT || "https://sfo3.digitaloceanspaces.com",
  forcePathStyle: false,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

export async function createClient(
  formData: FormData
): Promise<{ success: boolean; message: string; id?: number }> {
  try {
    const company_name = formData.get("company_name") as string;
    const email = formData.get("email") as string;
    const account_type_id = formData.get("account_type") as string;
    const password = formData.get("password") as string;
    const file = formData.get("legal_info") as File | null;

    if (!company_name || !email || !password) {
      return { success: false, message: "Champs obligatoires manquants." };
    }

    // 🔍 Vérifier si l'utilisateur existe déjà
    const [rows] = await pool.query("SELECT id FROM clients WHERE email = ?", [email]);
    if (Array.isArray(rows) && rows.length > 0) {
      return { success: false, message: "Un compte existe déjà avec cet email." };
    }

    let fileUrl: string | null = null;

    // 📤 Upload du fichier vers DigitalOcean Spaces
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const key = `clients/legal/${fileName}`;

      // Envoi du fichier
      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: file.type || "application/octet-stream",
        ACL: "public-read", // optionnel : permet l’accès public direct
      });

      await s3.send(uploadCommand);

      // URL publique du fichier
      fileUrl = `${process.env.DO_SPACES_ENDPOINT!.replace(
        "https://",
        `https://${process.env.DO_SPACES_BUCKET!}.`
      )}/${key}`;
    }

    // 🔐 Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const currentDateTime = new Date();

    // 🧾 Insertion du client
    const [result] = await pool.query(
      `INSERT INTO clients 
        (company_name, email, password, legal_info, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [company_name, email, hashedPassword, fileUrl, currentDateTime, currentDateTime]
    );

    const clientId = (result as any).insertId;

    // 📚 Domaines prédéfinis
    const predefinedDomains = [
      { name: "Corp Mgmt Training Program", description: "Programme de formation en gestion corporative" },
      { name: "OSM – Operational Standards Manuals", description: "Manuels des standards opérationnels" },
      { name: "BUILDING – Planning Guidelines", description: "Directives de planification pour la construction" },
      { name: "Pre-Opening Standards Manual", description: "Manuel des standards pré-ouverture" },
      { name: "Hotel Take Over Manual", description: "Manuel de prise en charge d'hôtel" },
      { name: "Quality Assurance Program", description: "Programme d'assurance qualité" },
    ];

    await Promise.all(
      predefinedDomains.map(domain =>
        pool.query(
          "INSERT INTO domains (client_id, name, description, created_at, updated_at, is_predefined) VALUES (?, ?, ?, ?, ?, 1)",
          [clientId, domain.name, domain.description, currentDateTime, currentDateTime]
        )
      )
    );

    // 🧮 Limite de domaines et abonnement
    const [domainCount] = await pool.query("SELECT COUNT(*) as count FROM domains WHERE client_id = ?", [clientId]);
    const count = (domainCount as any)[0].count;

    const [accountTypeRows] = await pool.query(
      "SELECT duration_days FROM account_types WHERE id = ?",
      [account_type_id]
    );
    const limitDays = (accountTypeRows as any)[0]?.duration_days || 365;

    const maxDomains = { gratuit: 10, premium: 15, platinum: 20, vip: Infinity }[account_type_id] || 10;
    if (count > maxDomains) {
      throw new Error("Limite de domaines dépassée pour ce type de compte");
    }

    // 🔄 Créer abonnement par défaut
    if (account_type_id) {
      await pool.query(
        `INSERT INTO subscriptions (client_id, account_type_id, start_date, end_date, status)
         VALUES (?, ?, ?, DATE_ADD(?, INTERVAL ? DAY), 'active')`,
        [clientId, account_type_id, currentDateTime, currentDateTime, limitDays]
      );
    }

    return {
      success: true,
      message: "Inscription réussie avec domaines prédéfinis.",
      id: clientId,
    };
  } catch (error) {
    console.error("❌ Erreur lors de la création du client:", error);
    return { success: false, message: "Impossible de créer le client, veuillez réessayer plus tard." };
  }
}

// ===========================================================
// 🔹 Récupérer les types de compte
// ===========================================================
export async function getAccountTypes() {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, price, duration_days, features FROM account_types"
    );
    return rows as Array<{ id: number; name: string; price: number; duration_days: number; features: any }>;
  } catch (error) {
    console.error("Erreur lors de la récupération des types de compte:", error);
    return [];
  }
}

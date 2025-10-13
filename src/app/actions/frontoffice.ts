"use server";
import bcrypt from "bcryptjs";
import { promises as fs } from "fs";
import path from "path";
import { pool } from "../lib/db"; // adapte à ton projet

export async function createClient(
  formData: FormData
): Promise<{ success: boolean; message: string; id?: number }> {
  try {
    const company_name = formData.get("company_name") as string;
    const email = formData.get("email") as string;
    const account_type_id = formData.get("account_type") as string; // id du plan choisi
    const password = formData.get("password") as string;
    const file = formData.get("legal_info") as File | null;

    if (!company_name || !email || !password) {
      return { success: false, message: "Champs obligatoires manquants." };
    }

    // Vérifier si l'utilisateur existe déjà
    const [rows] = await pool.query("SELECT id FROM clients WHERE email = ?", [email]);
    if (Array.isArray(rows) && rows.length > 0) {
      return { success: false, message: "Un compte existe déjà avec cet email." };
    }

    let filePath: string | null = null;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${file.name}`;
      const absolutePath = path.join(uploadDir, fileName);

      await fs.writeFile(absolutePath, buffer);

      filePath = `/uploads/${fileName}`;
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion dans la table clients avec date actuelle
    const currentDateTime = new Date("2025-09-23T14:50:00+03:00"); // 02:50 PM EAT, 23/09/2025
    const [result] = await pool.query(
      "INSERT INTO clients (company_name, email, password, legal_info, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [company_name, email, hashedPassword, filePath, currentDateTime, currentDateTime]
    );

    const clientId = (result as any).insertId;

    // Domaines prédéfinis (du Master Menu)
    const predefinedDomains = [
      { name: "Corp Mgmt Training Program", description: "Programme de formation en gestion corporative" },
      { name: "OSM – Operational Standards Manuals", description: "Manuels des standards opérationnels" },
      { name: "BUILDING – Planning Guidelines", description: "Directives de planification pour la construction" },
      { name: "Pre-Opening Standards Manual", description: "Manuel des standards pré-ouverture" },
      { name: "Hotel Take Over Manual", description: "Manuel de prise en charge d'hôtel" },
      { name: "Quality Assurance Program", description: "Programme d'assurance qualité" },
    ];

    // Insérer les domaines prédéfinis pour ce client
    const domainInsertPromises = predefinedDomains.map(domain =>
      pool.query(
        "INSERT INTO domains (client_id, name, description, created_at, updated_at, is_predefined) VALUES (?, ?, ?, ?, ?, 1)",
        [clientId, domain.name, domain.description, currentDateTime, currentDateTime]
      )
    );
    await Promise.all(domainInsertPromises);

    // Vérifier la limite de domaines en fonction du type de compte
    const [domainCount] = await pool.query("SELECT COUNT(*) as count FROM domains WHERE client_id = ?", [clientId]);
    const count = (domainCount as any)[0].count;
    const accountTypeDetails = await pool.query("SELECT duration_days FROM account_types WHERE id = ?", [account_type_id]);
    const limit = accountTypeDetails[0][0]?.duration_days || 365; // Durée par défaut de 1 an si non défini
    const maxDomains = { gratuit: 10, premium: 15, platinum: 20, vip: Infinity }[account_type_id] || 10; // Limites du CDC
    if (count > maxDomains) {
      throw new Error("Limite de domaines dépassée pour ce type de compte");
    }

    // Si un account_type_id est fourni, créer un abonnement par défaut
    if (account_type_id) {
      await pool.query(
        `INSERT INTO subscriptions (client_id, account_type_id, start_date, end_date, status)
         VALUES (?, ?, ?, DATE_ADD(?, INTERVAL (SELECT duration_days FROM account_types WHERE id = ?) DAY), 'active')`,
        [clientId, account_type_id, currentDateTime, currentDateTime, account_type_id]
      );
    }

    return {
      success: true,
      message: "Inscription réussie avec domaines prédéfinis.",
      id: clientId,
    };
  } catch (error) {
    console.error("Erreur lors de la création du client:", error);
    return { success: false, message: "Impossible de créer le client, veuillez réessayer plus tard." };
  }
}

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
"use server";;
import { getServerSession } from "next-auth";
import { pool } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";
import {
  Admin,
  AppVersion,
  Client,
  ClientParticipant,
  Domaine,
  DomaineParticipant,
  Fichier,
  Paiement,
  formatSize,
  Participant,
  Template,
} from "@/app/lib/types";

import bcrypt from "bcryptjs";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
// Vérification de la session admin
async function checkAdminSession(): Promise<void> {
  const session = await getServerSession();
  if (!session || !session.user || session.user.email !== process.env.AUTH_SECRET) {
    throw new Error("Non autorisé");
  }
}

// CRUD pour ADMINS
export async function getAdmins(): Promise<Admin[]> {
  //  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT id, email FROM admins");
    return rows as Admin[];
  } catch (error) {
    console.error("Erreur lors de la récupération des administrateurs:", error);
    throw new Error("Impossible de récupérer les administrateurs.");
  }
}

export async function createAdmin(formData: FormData): Promise<{ id: number }> {
  //  await checkAdminSession();
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query("INSERT INTO admins (email, password) VALUES (?, ?)", [email, hashedPassword]);
    return { id: (result as any).insertId };
  } catch (error) {
    console.error("Erreur lors de la création de l'administrateur:", error);
    throw new Error("Impossible de créer l'administrateur.");
  }
}

export async function getAdmin(id: number): Promise<Admin | null> {
  //  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT id, email FROM admins WHERE id = ?", [id]);
    return rows[0] as Admin | null;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'administrateur:", error);
    throw new Error("Impossible de récupérer l'administrateur.");
  }
}

export async function updateAdmin(id: number, formData: FormData): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string | null;
    let query = "UPDATE admins SET email = ? WHERE id = ?";
    let values = [email, id];
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = "UPDATE admins SET email = ?, password = ? WHERE id = ?";
      values = [email, hashedPassword, id];
    }
    await pool.query(query, values);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'administrateur:", error);
    throw new Error("Impossible de mettre à jour l'administrateur.");
  }
}

export async function deleteAdmin(id: number): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    await pool.query("DELETE FROM admins WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'administrateur:", error);
    throw new Error("Impossible de supprimer l'administrateur.");
  }
}

// CRUD pour CLIENTS
export async function getClients(): Promise<Client[]> {
  //  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, company_name, email, account_type, legal_info FROM clients"
    );
    return rows as Client[];
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw new Error("Impossible de récupérer les clients.");
  }
}

export async function createClient(formData: FormData): Promise<{ id: number }> {
  //  await checkAdminSession();
  try {
    const company_name = formData.get("company_name") as string;
    const email = formData.get("email") as string;
    const account_type = formData.get("account_type") as string;
    const password = formData.get("password") as string;
    const legal_info = formData.get("legal_info") as string | null;
    // const moyen_paiement = formData.get("moyen_paiement") as string | null;
    // const montant = formData.get("montant") as string | null;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO clients (company_name, email, account_type, password, legal_info) VALUES (?, ?, ?, ?, ?)",
      [company_name, email, account_type, hashedPassword, legal_info]
    );
    return { id: (result as any).insertId };
  } catch (error) {
    console.error("Erreur lors de la création du client:", error);
    throw new Error("Impossible de créer le client.");
  }
}

export async function getClient(id: number): Promise<Client | null> {
  //  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM clients WHERE id = ?", [id]);
    return rows[0] as Client | null;
  } catch (error) {
    console.error("Erreur lors de la récupération du client:", error);
    throw new Error("Impossible de récupérer le client.");
  }
}

export async function updateClient(id: number, formData: FormData): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    const company_name = formData.get("company_name") as string;
    const email = formData.get("email") as string;
    const account_type = formData.get("account_type") as string;
    const password = formData.get("password") as string | null;
    const legal_info = formData.get("legal_info") as string | null;
    const moyen_paiement = formData.get("moyen_paiement") as string | null;
    const montant = formData.get("montant") as string | null;
    let query = "UPDATE clients SET company_name = ?, email = ?, account_type = ?, legal_info = ?, moyen_paiement = ?, montant = ? WHERE id = ?";
    let values = [company_name, email, account_type, legal_info, moyen_paiement, montant ? parseFloat(montant) : null, id];
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = "UPDATE clients SET company_name = ?, email = ?, account_type = ?, password = ?, legal_info = ?, moyen_paiement = ?, montant = ? WHERE id = ?";
      values = [company_name, email, account_type, hashedPassword, legal_info, moyen_paiement, montant ? parseFloat(montant) : null, id];
    }
    await pool.query(query, values);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client:", error);
    throw new Error("Impossible de mettre à jour le client.");
  }
}

export async function deleteClient(id: number): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    await pool.query("DELETE FROM clients WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du client:", error);
    throw new Error("Impossible de supprimer le client.");
  }
}

// CRUD pour DOMAINES
export async function getDomaines(): Promise<Domaine[]> {
  //  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM domaines");
    return rows as Domaine[];
  } catch (error) {
    console.error("Erreur lors de la récupération des domaines:", error);
    throw new Error("Impossible de récupérer les domaines.");
  }
}

export async function createDomaine(formData: FormData): Promise<{ id: number }> {
  //  await checkAdminSession();
  try {
    const nom = formData.get("nom") as string;
    const client_id = formData.get("client_id") as string;
    const [result] = await pool.query("INSERT INTO domaines (nom, client_id) VALUES (?, ?)", [nom, parseInt(client_id)]);
    return { id: (result as any).insertId };
  } catch (error) {
    console.error("Erreur lors de la création du domaine:", error);
    throw new Error("Impossible de créer le domaine.");
  }
}

export async function getDomaine(id: number): Promise<Domaine | null> {
  //  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM domaines WHERE id = ?", [id]);
    return rows[0] as Domaine | null;
  } catch (error) {
    console.error("Erreur lors de la récupération du domaine:", error);
    throw new Error("Impossible de récupérer le domaine.");
  }
}

export async function updateDomaine(id: number, formData: FormData): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    const nom = formData.get("nom") as string;
    const client_id = formData.get("client_id") as string;
    await pool.query("UPDATE domaines SET nom = ?, client_id = ? WHERE id = ?", [nom, parseInt(client_id), id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du domaine:", error);
    throw new Error("Impossible de mettre à jour le domaine.");
  }
}

export async function deleteDomaine(id: number): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    await pool.query("DELETE FROM domaines WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du domaine:", error);
    throw new Error("Impossible de supprimer le domaine.");
  }
}

// CRUD pour FICHIERS
export async function getFichiers(): Promise<Fichier[]> {
  //  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM fichiers");
    return rows as Fichier[];
  } catch (error) {
    console.error("Erreur lors de la récupération des fichiers:", error);
    throw new Error("Impossible de récupérer les fichiers.");
  }
}

export async function createFichier(formData: FormData): Promise<{ id: number }> {
  //  await checkAdminSession();
  try {
    const nom = formData.get("nom") as string;
    const chemin = formData.get("chemin") as string;
    const template_id = formData.get("template_id") as string;
    const [result] = await pool.query("INSERT INTO fichiers (nom, chemin, template_id) VALUES (?, ?, ?)", [nom, chemin, parseInt(template_id)]);
    return { id: (result as any).insertId };
  } catch (error) {
    console.error("Erreur lors de la création du fichier:", error);
    throw new Error("Impossible de créer le fichier.");
  }
}

export async function getFichier(id: number): Promise<Fichier | null> {
  //  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM fichiers WHERE id = ?", [id]);
    return rows[0] as Fichier | null;
  } catch (error) {
    console.error("Erreur lors de la récupération du fichier:", error);
    throw new Error("Impossible de récupérer le fichier.");
  }
}

export async function updateFichier(id: number, formData: FormData): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    const nom = formData.get("nom") as string;
    const chemin = formData.get("chemin") as string;
    const template_id = formData.get("template_id") as string;
    await pool.query("UPDATE fichiers SET nom = ?, chemin = ?, template_id = ? WHERE id = ?", [nom, chemin, parseInt(template_id), id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du fichier:", error);
    throw new Error("Impossible de mettre à jour le fichier.");
  }
}

export async function deleteFichier(id: number): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    await pool.query("DELETE FROM fichiers WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du fichier:", error);
    throw new Error("Impossible de supprimer le fichier.");
  }
}

// CRUD pour PAIEMENTS
export async function getPaiements(): Promise<Paiement[]> {
  //  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM paiements");
    return rows as Paiement[];
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements:", error);
    throw new Error("Impossible de récupérer les paiements.");
  }
}

export async function createPaiement(formData: FormData): Promise<{ id: number }> {
  //  await checkAdminSession();
  try {
    const client_id = formData.get("client_id") as string;
    const montant = formData.get("montant") as string;
    const methode = formData.get("methode") as string;
    const date = new Date(formData.get("date") as string);
    const statut = formData.get("statut") as string;
    const [result] = await pool.query(
      "INSERT INTO paiements (client_id, montant, methode, date, statut) VALUES (?, ?, ?, ?, ?)",
      [parseInt(client_id), parseFloat(montant), methode, date, statut]
    );
    return { id: (result as any).insertId };
  } catch (error) {
    console.error("Erreur lors de la création du paiement:", error);
    throw new Error("Impossible de créer le paiement.");
  }
}

export async function getPaiement(id: number): Promise<Paiement | null> {
  //  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM paiements WHERE id = ?", [id]);
    return rows[0] as Paiement | null;
  } catch (error) {
    console.error("Erreur lors de la récupération du paiement:", error);
    throw new Error("Impossible de récupérer le paiement.");
  }
}

export async function updatePaiement(id: number, formData: FormData): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    const client_id = formData.get("client_id") as string;
    const montant = formData.get("montant") as string;
    const methode = formData.get("methode") as string;
    const date = new Date(formData.get("date") as string);
    const statut = formData.get("statut") as string;
    await pool.query(
      "UPDATE paiements SET client_id = ?, montant = ?, methode = ?, date = ?, statut = ? WHERE id = ?",
      [parseInt(client_id), parseFloat(montant), methode, date, statut, id]
    );
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du paiement:", error);
    throw new Error("Impossible de mettre à jour le paiement.");
  }
}

export async function deletePaiement(id: number): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    await pool.query("DELETE FROM paiements WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du paiement:", error);
    throw new Error("Impossible de supprimer le paiement.");
  }
}

// CRUD pour PARTICIPANTS - Déplacé vers la section CRM ci-dessous

// CRUD pour TEMPLATES
export async function getTemplates(): Promise<Template[]> {
  //  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM templates");
    return rows as Template[];
  } catch (error) {
    console.error("Erreur lors de la récupération des templates:", error);
    throw new Error("Impossible de récupérer les templates.");
  }
}

export async function createTemplate(formData: FormData): Promise<{ id: number }> {
  //  await checkAdminSession();
  try {
    const nom = formData.get("nom") as string;
    const contenu = formData.get("contenu") as string;
    const domaine_id = formData.get("domaine_id") as string;
    const [result] = await pool.query("INSERT INTO templates (nom, contenu, domaine_id) VALUES (?, ?, ?)", [nom, contenu, parseInt(domaine_id)]);
    return { id: (result as any).insertId };
  } catch (error) {
    console.error("Erreur lors de la création du template:", error);
    throw new Error("Impossible de créer le template.");
  }
}

export async function getTemplate(id: number): Promise<Template | null> {
  //  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM templates WHERE id = ?", [id]);
    return rows[0] as Template | null;
  } catch (error) {
    console.error("Erreur lors de la récupération du template:", error);
    throw new Error("Impossible de récupérer le template.");
  }
}

export async function updateTemplate(id: number, formData: FormData): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    const nom = formData.get("nom") as string;
    const contenu = formData.get("contenu") as string;
    const domaine_id = formData.get("domaine_id") as string;
    await pool.query("UPDATE templates SET nom = ?, contenu = ?, domaine_id = ? WHERE id = ?", [nom, contenu, parseInt(domaine_id), id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du template:", error);
    throw new Error("Impossible de mettre à jour le template.");
  }
}

export async function deleteTemplate(id: number): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    await pool.query("DELETE FROM templates WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du template:", error);
    throw new Error("Impossible de supprimer le template.");
  }
}

// CRUD pour CLIENTS_PARTICIPANT
export async function getClientParticipants(): Promise<ClientParticipant[]> {
  //  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM clients_participant");
    return rows as ClientParticipant[];
  } catch (error) {
    console.error("Erreur lors de la récupération des associations clients-participants:", error);
    throw new Error("Impossible de récupérer les associations clients-participants.");
  }
}

export async function createClientParticipant(formData: FormData): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    const client_id = formData.get("client_id") as string;
    const participant_id = formData.get("participant_id") as string;
    await pool.query("INSERT INTO clients_participant (client_id, participant_id) VALUES (?, ?)", [parseInt(client_id), parseInt(participant_id)]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la création de l'association client-participant:", error);
    throw new Error("Impossible de créer l'association client-participant.");
  }
}

export async function deleteClientParticipant(client_id: number, participant_id: number): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    await pool.query("DELETE FROM clients_participant WHERE client_id = ? AND participant_id = ?", [client_id, participant_id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'association client-participant:", error);
    throw new Error("Impossible de supprimer l'association client-participant.");
  }
}

// CRUD pour DOMAINE_PARTICIPANT
export async function getDomaineParticipants(): Promise<DomaineParticipant[]> {
  //  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM domaine_participant");
    return rows as DomaineParticipant[];
  } catch (error) {
    console.error("Erreur lors de la récupération des associations domaines-participants:", error);
    throw new Error("Impossible de récupérer les associations domaines-participants.");
  }
}

export async function createDomaineParticipant(formData: FormData): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    const domaine_id = formData.get("domaine_id") as string;
    const participant_id = formData.get("participant_id") as string;
    await pool.query("INSERT INTO domaine_participant (domaine_id, participant_id) VALUES (?, ?)", [parseInt(domaine_id), parseInt(participant_id)]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la création de l'association domaine-participant:", error);
    throw new Error("Impossible de créer l'association domaine-participant.");
  }
}

export async function deleteDomaineParticipant(domaine_id: number, participant_id: number): Promise<{ success: boolean }> {
  //  await checkAdminSession();
  try {
    await pool.query("DELETE FROM domaine_participant WHERE domaine_id = ? AND participant_id = ?", [domaine_id, participant_id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de l'association domaine-participant:", error);
    throw new Error("Impossible de supprimer l'association domaine-participant.");
  }
}



// Conversion taille octets -> Mo/Go lisible

export async function getAppVersions(): Promise<AppVersion[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM app_versions ORDER BY id DESC");
    return rows as AppVersion[];
  } catch (error) {
    console.error("Erreur lors de la récupération des versions :", error);
    throw new Error("Impossible de récupérer les versions de l'application.");
  }
}

export async function createAppVersion(data: {
  os: string;
  version: string;
  size: string | number;
  cpu_requirement: string;
  ram_requirement: string;
  storage_requirement: string;
  download_link: string;
}): Promise<{ id: number }> {
  try {
    const { os, version, size, cpu_requirement, ram_requirement, storage_requirement, download_link } = data;
    const sizeStr = typeof size === "number" ? formatSize(size) : size;

    const [result] = await pool.query(
      `INSERT INTO app_versions 
       (os, version, size, cpu_requirement, ram_requirement, storage_requirement, download_link) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [os, version, sizeStr, cpu_requirement, ram_requirement, storage_requirement, download_link]
    );

    return { id: (result as any).insertId };
  } catch (error) {
    console.error("Erreur lors de la création d'une version :", error);
    throw new Error("Impossible de créer la version de l'application.");
  }
}

export async function getAppVersion(id: number): Promise<AppVersion | null> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM app_versions WHERE id = ?",
      [id]
    );
    return (rows[0] as AppVersion) || null;
  } catch (error) {
    console.error("Erreur lors de la récupération de la version :", error);
    throw new Error("Impossible de récupérer la version.");
  }
}

export async function updateAppVersion(id: number, formData: FormData): Promise<{ success: boolean }> {
  try {
    const os = formData.get("os") as string;
    const version = formData.get("version") as string;
    const sizeRaw = formData.get("size");
    const cpu_requirement = formData.get("cpu_requirement") as string;
    const ram_requirement = formData.get("ram_requirement") as string;
    const storage_requirement = formData.get("storage_requirement") as string;
    const download_link = formData.get("download_link") as string;

    if (!os || !version || !sizeRaw || !cpu_requirement || !ram_requirement || !storage_requirement || !download_link) {
      throw new Error("Champs manquants dans le formulaire.");
    }

    const size = typeof sizeRaw === "string" && !isNaN(Number(sizeRaw)) ? formatSize(Number(sizeRaw)) : sizeRaw;

    await pool.query(
      `UPDATE app_versions 
       SET os = ?, version = ?, size = ?, cpu_requirement = ?, ram_requirement = ?, storage_requirement = ?, download_link = ? 
       WHERE id = ?`,
      [os, version, size, cpu_requirement, ram_requirement, storage_requirement, download_link, id]
    );

    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    throw new Error("Impossible de mettre à jour la version de l'application.");
  }
}

export async function deleteAppVersion(id: number): Promise<{ success: boolean }> {
  try {
    // 1️⃣ Récupérer d'abord le lien de téléchargement
    const [rows] = await pool.query("SELECT download_link FROM app_versions WHERE id = ?", [id]);
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error("Version non trouvée en base de données.");
    }

    const fileUrl = (rows as any)[0].download_link as string;

    // 2️⃣ Supprimer la ligne SQL
    await pool.query("DELETE FROM app_versions WHERE id = ?", [id]);

    // 3️⃣ Extraire la clé (path du fichier) depuis l’URL publique
    // Exemple: https://smartfilepro.sfo3.digitaloceanspaces.com/app-versions/1730142523123-setup.exe
    const bucketName = process.env.DO_SPACES_BUCKET!;
    const endpoint = process.env.DO_SPACES_ENDPOINT!.replace("https://", "");
    const key = fileUrl.split(`${bucketName}.${endpoint}/`)[1]; // => app-versions/...

    if (!key) {
      console.warn("⚠️ Impossible d’extraire la clé du fichier à supprimer:", fileUrl);
      return { success: true };
    }

    // 4️⃣ Supprimer le fichier du bucket DigitalOcean
    const s3 = new S3Client({
      region: process.env.DO_SPACES_REGION || "sfo3",
      endpoint: process.env.DO_SPACES_ENDPOINT || "https://sfo3.digitaloceanspaces.com",
      forcePathStyle: false,
      credentials: {
        accessKeyId: process.env.DO_SPACES_KEY || "",
        secretAccessKey: process.env.DO_SPACES_SECRET || "",
      },
    });

    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3.send(deleteCommand);
    console.log(`🗑️ Fichier supprimé de DigitalOcean: ${key}`);

    return { success: true };
  } catch (error) {
    console.error("❌ Erreur lors de la suppression complète:", error);
    throw new Error("Échec de la suppression de la version ou du fichier associé.");
  }
}

// ============================================
// CRM ACTIONS - GESTION PARTICIPANTS
// ============================================

export async function getParticipants(filters?: { domain_id?: number; search?: string }): Promise<any[]> {
  try {
    let query = 'SELECT p.*, d.name as domain_name, d.client_id FROM participants p LEFT JOIN domains d ON p.domain_id = d.id WHERE 1=1';
    const params: (string | number)[] = [];

    if (filters?.domain_id) {
      query += ' AND p.domain_id = ?';
      params.push(filters.domain_id);
    }

    if (filters?.search) {
      query += ' AND (p.name LIKE ? OR p.email LIKE ? OR p.poste LIKE ?)';
      const searchPattern = `%${filters.search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des participants:", error);
    throw new Error("Impossible de récupérer les participants.");
  }
}

export async function createParticipant(data: { domain_id: number; name: string; email: string; poste?: string }): Promise<{ id: number }> {
  try {
    const [existing] = await pool.query<RowDataPacket[]>("SELECT id FROM participants WHERE email = ?", [data.email]);
    if (existing.length > 0) {
      throw new Error("Un participant avec cet email existe déjà");
    }

    const [result] = await pool.query(
      "INSERT INTO participants (domain_id, name, email, poste) VALUES (?, ?, ?, ?)",
      [data.domain_id, data.name, data.email, data.poste || '']
    );
    return { id: (result as any).insertId };
  } catch (error) {
    console.error("Erreur lors de la création du participant:", error);
    throw error;
  }
}

export async function updateParticipant(id: number, data: Partial<Participant>): Promise<{ success: boolean }> {
  try {
    const setClauses: string[] = [];
    const params: (string | number)[] = [];

    if (data.name !== undefined) { setClauses.push('name = ?'); params.push(data.name); }
    if (data.email !== undefined) { setClauses.push('email = ?'); params.push(data.email); }
    if (data.domain_id !== undefined) { setClauses.push('domain_id = ?'); params.push(data.domain_id); }
    if (data.poste !== undefined) { setClauses.push('poste = ?'); params.push(data.poste); }

    if (setClauses.length === 0) throw new Error("Aucun champ à mettre à jour");

    params.push(id);
    await pool.query(`UPDATE participants SET ${setClauses.join(', ')} WHERE id = ?`, params);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du participant:", error);
    throw error;
  }
}

export async function deleteParticipant(id: number): Promise<{ success: boolean }> {
  try {
    await pool.query("DELETE FROM participants WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du participant:", error);
    throw new Error("Impossible de supprimer le participant.");
  }
}

// ============================================
// CRM ACTIONS - GESTION CLIENTS
// ============================================

export async function getClientsWithDetails(): Promise<any[]> {
  try {
    const query = `
      SELECT 
        c.*,
        s.status as subscription_status,
        s.end_date as subscription_end_date,
        at.name as account_type_name,
        COUNT(DISTINCT d.id) as domains_count,
        COUNT(DISTINCT p.id) as participants_count
      FROM clients c
      LEFT JOIN subscriptions s ON c.id = s.client_id AND s.status = 'active'
      LEFT JOIN account_types at ON s.account_type_id = at.id
      LEFT JOIN domains d ON c.id = d.client_id
      LEFT JOIN participants p ON d.id = p.domain_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    throw new Error("Impossible de récupérer les clients.");
  }
}

export async function updateClientStatus(id: number, status: 'active' | 'inactive' | 'pending_payment'): Promise<{ success: boolean }> {
  try {
    await pool.query("UPDATE clients SET status = ? WHERE id = ?", [status, id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    throw new Error("Impossible de mettre à jour le statut.");
  }
}

// ============================================
// CRM ACTIONS - GESTION ABONNEMENTS
// ============================================

export async function getSubscriptions(): Promise<any[]> {
  try {
    const query = `
      SELECT 
        s.*,
        c.company_name,
        c.email as client_email,
        at.name as account_type_name,
        at.price,
        DATEDIFF(s.end_date, CURDATE()) as days_remaining
      FROM subscriptions s
      LEFT JOIN clients c ON s.client_id = c.id
      LEFT JOIN account_types at ON s.account_type_id = at.id
      ORDER BY s.created_at DESC
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des abonnements:", error);
    throw new Error("Impossible de récupérer les abonnements.");
  }
}

export async function updateSubscription(id: number, data: { status?: string; account_type_id?: number; end_date?: string }): Promise<{ success: boolean }> {
  try {
    const setClauses: string[] = [];
    const params: (string | number)[] = [];

    if (data.status !== undefined) { setClauses.push('status = ?'); params.push(data.status); }
    if (data.account_type_id !== undefined) { setClauses.push('account_type_id = ?'); params.push(data.account_type_id); }
    if (data.end_date !== undefined) { setClauses.push('end_date = ?'); params.push(data.end_date); }

    if (setClauses.length === 0) throw new Error("Aucun champ à mettre à jour");

    params.push(id);
    await pool.query(`UPDATE subscriptions SET ${setClauses.join(', ')} WHERE id = ?`, params);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'abonnement:", error);
    throw error;
  }
}

// ============================================
// CRM ACTIONS - GESTION VIDÉOS DÉMO
// ============================================

export async function getDemoVideos(): Promise<any[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM demo_videos ORDER BY display_order ASC, created_at DESC"
    );
    return rows;
  } catch (error) {
    console.error("Erreur lors de la récupération des vidéos:", error);
    return [];
  }
}

export async function createDemoVideo(data: {
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration?: number;
  category?: string;
  display_order?: number;
}): Promise<{ id: number }> {
  try {
    const [result] = await pool.query(
      "INSERT INTO demo_videos (title, description, video_url, thumbnail_url, duration, category, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [data.title, data.description, data.video_url, data.thumbnail_url, data.duration, data.category, data.display_order || 0]
    );
    return { id: (result as any).insertId };
  } catch (error) {
    console.error("Erreur lors de la création de la vidéo:", error);
    throw error;
  }
}

export async function updateDemoVideo(id: number, data: Partial<any>): Promise<{ success: boolean }> {
  try {
    const setClauses: string[] = [];
    const params: (string | number)[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        setClauses.push(`${key} = ?`);
        params.push(value);
      }
    });

    if (setClauses.length === 0) throw new Error("Aucun champ à mettre à jour");

    params.push(id);
    await pool.query(`UPDATE demo_videos SET ${setClauses.join(', ')} WHERE id = ?`, params);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la vidéo:", error);
    throw error;
  }
}

export async function deleteDemoVideo(id: number): Promise<{ success: boolean }> {
  try {
    await pool.query("DELETE FROM demo_videos WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la vidéo:", error);
    throw new Error("Impossible de supprimer la vidéo.");
  }
}

// ============================================
// CRM ACTIONS - STATISTIQUES
// ============================================

export async function getCRMStatistics(): Promise<any> {
  try {
    const [clientsCount] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM clients");
    const [participantsCount] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM participants");
    const [domainsCount] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM domains");
    const [subscriptionsCount] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as total FROM subscriptions WHERE status = 'active'");

    return {
      total_clients: clientsCount[0]?.total || 0,
      total_participants: participantsCount[0]?.total || 0,
      total_domains: domainsCount[0]?.total || 0,
      active_subscriptions: subscriptionsCount[0]?.total || 0,
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return { total_clients: 0, total_participants: 0, total_domains: 0, active_subscriptions: 0 };
  }
}

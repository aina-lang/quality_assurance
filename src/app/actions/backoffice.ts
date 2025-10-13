"use server";

// Imports nécessaires
import { getServerSession } from "next-auth";
import { pool } from "@/app/lib/db";
import { RowDataPacket } from "mysql2/promise";
import {
  Admin,
  Client,
  Domaine,
  Fichier,
  Paiement,
  Participant,
  Template,
  ClientParticipant,
  DomaineParticipant,
} from "@/app/lib/types";

import bcrypt from "bcryptjs";
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

// CRUD pour PARTICIPANTS
export async function getParticipants(): Promise<Participant[]> {
//  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM participants");
    return rows as Participant[];
  } catch (error) {
    console.error("Erreur lors de la récupération des participants:", error);
    throw new Error("Impossible de récupérer les participants.");
  }
}

export async function createParticipant(formData: FormData): Promise<{ id: number }> {
//  await checkAdminSession();
  try {
    const email = formData.get("email") as string;
    const nom = formData.get("nom") as string | null;
    const [result] = await pool.query("INSERT INTO participants (email, nom) VALUES (?, ?)", [email, nom]);
    return { id: (result as any).insertId };
  } catch (error) {
    console.error("Erreur lors de la création du participant:", error);
    throw new Error("Impossible de créer le participant.");
  }
}

export async function getParticipant(id: number): Promise<Participant | null> {
//  await checkAdminSession();
  try {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM participants WHERE id = ?", [id]);
    return rows[0] as Participant | null;
  } catch (error) {
    console.error("Erreur lors de la récupération du participant:", error);
    throw new Error("Impossible de récupérer le participant.");
  }
}

export async function updateParticipant(id: number, formData: FormData): Promise<{ success: boolean }> {
//  await checkAdminSession();
  try {
    const email = formData.get("email") as string;
    const nom = formData.get("nom") as string | null;
    await pool.query("UPDATE participants SET email = ?, nom = ? WHERE id = ?", [email, nom, id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du participant:", error);
    throw new Error("Impossible de mettre à jour le participant.");
  }
}

export async function deleteParticipant(id: number): Promise<{ success: boolean }> {
//  await checkAdminSession();
  try {
    await pool.query("DELETE FROM participants WHERE id = ?", [id]);
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du participant:", error);
    throw new Error("Impossible de supprimer le participant.");
  }
}

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
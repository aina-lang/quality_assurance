// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import bcrypt from 'bcryptjs';
import { verifyToken } from '@/lib/utils';

// Types
interface Client {
  id: number;
  company_name: string;
  email: string;
  password?: string;
  status?: string;
}

interface Subscription {
  client_id: number;
  account_type_id: number;
  start_date: string;
  end_date: string;
  status: string;
}

interface ProfileData {
  company_name: string;
  email: string;
  accountType_id: number;
  licenseStart: string;
  licenseEnd: string;
}

// Ajout des headers CORS
const addCORSHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
};

// OPTIONS pour preflight
export async function OPTIONS(req: NextRequest) {
  return addCORSHeaders(new NextResponse(null, { status: 204 }));
}

// Fonction réutilisable pour récupérer profil
async function getProfileData(clientId: number): Promise<ProfileData> {
  const [clientsRows] = await pool.execute('SELECT id, company_name, email FROM clients WHERE id = ?', [clientId]);
  const clients = clientsRows as Client[]
  if (!clients.length) throw new Error('Utilisateur non trouvé');

  const [subscriptionsRows] = await pool.execute(
    'SELECT account_type_id, start_date, end_date FROM subscriptions WHERE client_id = ? AND status = ?',
    [clientId, 'active']
  );
  const subscriptions = subscriptionsRows as Subscription[];
  if (!subscriptions.length) throw new Error('Abonnement actif non trouvé');

  const client = clients[0];
  const subscription = subscriptions[0];

  return {
    company_name: client.company_name,
    email: client.email,
    accountType_id: subscription.account_type_id,
    licenseStart: subscription.start_date,
    licenseEnd: subscription.end_date,
  };
}

// GET: récupérer profil
export async function GET(req: NextRequest) {
  try {
    verifyToken(req);
    const clientId = Number(req.nextUrl.searchParams.get('client_id'));
    if (!clientId) throw new Error('client_id manquant ou invalide');

    const profileData = await getProfileData(clientId);
    return addCORSHeaders(NextResponse.json({ data: profileData }, { status: 200 }));
  } catch (error: any) {
    console.error('GET profile error:', error);
    return addCORSHeaders(NextResponse.json({ message: error.message }, { status: 400 }));
  }
}

// PUT: mettre à jour profil
export async function PUT(req: NextRequest) {
  try {
    verifyToken(req);
    const body = (await req.json()) as Partial<ProfileData & { password?: string; confirmPassword?: string; client_id: number }>;
    if (!body.client_id) throw new Error('client_id manquant ou invalide');
    if (!body.company_name?.trim()) throw new Error('Le nom ne peut pas être vide');
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) throw new Error('Email invalide');
    if (body.password && body.password !== body.confirmPassword) throw new Error('Les mots de passe ne correspondent pas');

    const updateFields: string[] = ['company_name = ?', 'email = ?', 'updated_at = NOW()'];
    const updateParams: any[] = [body.company_name, body.email];

    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      updateFields.push('password = ?');
      updateParams.push(hashedPassword);
    }

    updateParams.push(body.client_id);

    const [updateResult]: any = await pool.execute(
      `UPDATE clients SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );

    if (updateResult.affectedRows === 0) throw new Error('Utilisateur non trouvé');

    const profileData = await getProfileData(body.client_id);
    return addCORSHeaders(NextResponse.json({ data: profileData }, { status: 200 }));
  } catch (error: any) {
    console.error('PUT profile error:', error);
    return addCORSHeaders(NextResponse.json({ message: error.message }, { status: 400 }));
  }
}

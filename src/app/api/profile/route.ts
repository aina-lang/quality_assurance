// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import bcrypt from 'bcryptjs';

// Types
interface Client {
  id: number;
  company_name: string;
  email: string;
  password: string;
  status: string;
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

// Add CORS headers
const addCORSHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Adjust for production if needed
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
};

// Map account_type_id to AccountType
const mapAccountTypeIdToType = (accountTypeId: number): 'Gratuit' | 'Premium' | 'Platinium' | 'VIP' => {
  switch (accountTypeId) {
    case 1:
      return 'Premium';
    case 2:
      return 'Platinium';
    case 3:
      return 'VIP';
    default:
      return 'Gratuit';
  }
};

// Handler for OPTIONS (CORS preflight)
export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return addCORSHeaders(response);
}

// GET: Fetch user profile data
export async function GET(req: NextRequest) {
  try {
    // Extract client_id from query parameters (e.g., /api/profile?client_id=3)
    const clientId = req.nextUrl.searchParams.get('client_id');
    if (!clientId || isNaN(parseInt(clientId))) throw new Error('client_id manquant ou invalide');

    // Fetch client data
    const [clients]: [Client[]] = await pool.execute('SELECT id, company_name, email, status FROM clients WHERE id = ?', [
      clientId,
    ]);
    if (clients.length === 0) throw new Error('Utilisateur non trouvé');

    // Fetch subscription data
    const [subscriptions]: [Subscription[]] = await pool.execute(
      'SELECT account_type_id, start_date, end_date, status FROM subscriptions WHERE client_id = ? AND status = ?',
      [clientId, 'active']
    );
    if (subscriptions.length === 0) throw new Error('Abonnement actif non trouvé');

    const client = clients[0];
    const subscription = subscriptions[0];

    const profileData: ProfileData = {
      company_name: client.company_name,
      email: client.email,
      accountType_id: subscription.account_type_id,
      licenseStart: subscription.start_date,
      licenseEnd: subscription.end_date,
    };

    const response = NextResponse.json({ data: profileData }, { status: 200 });
    return addCORSHeaders(response);
  } catch (error: any) {
    console.error('Error fetching profile data:', error);
    const response = NextResponse.json({ message: error.message }, { status: 400 });
    return addCORSHeaders(response);
  }
}

// PUT: Update user profile data
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json() as Partial<ProfileData & { password?: string; confirmPassword?: string; client_id: number }>;

    // Validate client_id
    if (!body.client_id || isNaN(body.client_id)) throw new Error('client_id manquant ou invalide');

    // Validate input
    if (!body.company_name || body.company_name.trim().length === 0) {
      throw new Error('Le nom ne peut pas être vide');
    }
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      throw new Error('Veuillez entrer un email valide');
    }
    if (body.password && (body.password.length < 8 || !/[a-zA-Z]/.test(body.password) || !/\d/.test(body.password))) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères, dont des lettres et des chiffres');
    }
    if (body.password && body.password !== body.confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas');
    }

    // Check if email is already in use by another user
    const [existingClients]: [Client[]] = await pool.execute('SELECT id FROM clients WHERE email = ? AND id != ?', [
      body.email,
      body.client_id,
    ]);
    if (existingClients.length > 0) {
      throw new Error('Cet email est déjà utilisé par un autre utilisateur');
    }

    // Update client data
    const updateFields: string[] = ['company_name = ?', 'email = ?', 'updated_at = NOW()'];
    const updateParams: any[] = [body.company_name, body.email];

    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      updateFields.push('password = ?');
      updateParams.push(hashedPassword);
    }

    updateParams.push(body.client_id);

    const [updateResult] = await pool.execute(
      `UPDATE clients SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );

    if ((updateResult as any).affectedRows === 0) throw new Error('Utilisateur non trouvé');

    // Fetch updated client data
    const [updatedClients]: [Client[]] = await pool.execute('SELECT company_name, email FROM clients WHERE id = ?', [
      body.client_id,
    ]);
    if (updatedClients.length === 0) throw new Error('Utilisateur non trouvé après mise à jour');

    const response = NextResponse.json({ data: updatedClients[0] }, { status: 200 });
    return addCORSHeaders(response);
  } catch (error: any) {
    console.error('Error updating profile data:', error);
    const response = NextResponse.json({ message: error.message }, { status: 400 });
    return addCORSHeaders(response);
  }
}
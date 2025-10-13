import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/app/lib/db';
import { Participant } from '@/app/lib/types';

// Middleware JWT
const verifyToken = (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  console.log('Full Auth Header:', authHeader); // Debug header
  const token = authHeader?.split(' ')[1];
  console.log('Extracted Token:', token ? 'Present' : 'Missing'); // Évite de logger le token entier en prod
  if (!token) throw new Error('Token manquant');
  try {
    const secret = process.env.AUTH_SECRET || 'your-secret-key';
    if (!secret) throw new Error('Clé secrète manquante dans les variables d\'environnement');
    console.log('Using Secret Length:', secret.length); // Debug sans révéler la clé
    jwt.verify(token, secret);
    return true;
  } catch (err: any) {
    console.error('JWT Verify Error:', err.message); // Log l'erreur exacte
    throw new Error('Token invalide');
  }
};

// Fonction utilitaire pour ajouter les headers CORS à une réponse
const addCORSHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Ou 'http://localhost:5173' pour prod
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400'); // Cache 24h
  return response;
};

// Handler OPTIONS pour preflight CORS
export async function OPTIONS(req: NextRequest) {
  const response = new NextResponse(null, { status: 204 });
  return addCORSHeaders(response);
}

// GET : Lister tous les participants
export async function GET(req: NextRequest) {
  try {
    // verifyToken(req); // Décommentez pour activer l'auth
    const [participants] = await pool.execute('SELECT * FROM participants ORDER BY created_at DESC');
    const response = NextResponse.json({ data: participants }, { status: 200 });
    return addCORSHeaders(response);
  } catch (error: any) {
    console.error('Erreur GET participants:', error);
    const response = NextResponse.json({ message: error.message }, { status: 401 });
    return addCORSHeaders(response);
  }
}

// POST : Créer un participant
// POST : Créer un participant
export async function POST(req: NextRequest) {
  try {
    // verifyToken(req); // Décommentez pour activer l'auth
    const body = await req.json() as Omit<Participant, 'id' | 'created_at' | 'updated_at'>;
    console.log(body);

    if (!body.name || !body.email || !body.domain_id) {
      throw new Error('Champs requis : name, email, domain_id');
    }

    // ✅ Vérifier si email existe déjà
    const [existing] = await pool.execute(
      'SELECT id FROM participants WHERE email = ?',
      [body.email]
    );
    if ((existing as any[]).length > 0) {
      throw new Error('Un participant avec cet email existe déjà');
    }

    const [result] = await pool.execute(
      'INSERT INTO participants (domain_id, name, email, poste) VALUES (?, ?, ?, ?)',
      [body.domain_id, body.name, body.email, body.poste]
    );

    const insertId = (result as any).insertId;
    const [newParticipant] = await pool.execute('SELECT * FROM participants WHERE id = ?', [insertId]);

    const response = NextResponse.json({ data: (newParticipant as any)[0] }, { status: 201 });
    return addCORSHeaders(response);

  } catch (error: any) {
    console.error('Erreur POST participant:', error);
    const response = NextResponse.json({ message: error.message }, { status: 400 });
    return addCORSHeaders(response);
  }
}


// PUT : Mettre à jour un participant
export async function PUT(req: NextRequest) {
  try {
    // verifyToken(req); // Décommentez pour activer l'auth
    const body = await req.json() as Participant;
    if (!body.id || Object.keys(body).filter(k => ['name', 'email', 'domain_id', 'poste'].includes(k)).length === 0) {
      throw new Error('ID et au moins un champ à mettre à jour requis');
    }
    const setClauses: string[] = [];
    const params: any[] = [];
    if (body.name !== undefined) { setClauses.push('name = ?'); params.push(body.name); }
    if (body.email !== undefined) { setClauses.push('email = ?'); params.push(body.email); }
    if (body.domain_id !== undefined) { setClauses.push('domain_id = ?'); params.push(body.domain_id); }
    if (body.poste !== undefined) { setClauses.push('poste = ?'); params.push(body.poste); }
    params.push(body.id);

    const [updateResult] = await pool.execute(
      `UPDATE participants SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );
    if ((updateResult as any).affectedRows === 0) throw new Error('Participant non trouvé');
    const [updated] = await pool.execute('SELECT * FROM participants WHERE id = ?', [body.id]);
    const response = NextResponse.json({ data: updated[0] }, { status: 200 });
    return addCORSHeaders(response);
  } catch (error: any) {
    console.error('Erreur PUT participant:', error);
    const response = NextResponse.json({ message: error.message }, { status: 400 });
    return addCORSHeaders(response);
  }
}

// DELETE : Supprimer un participant
export async function DELETE(req: NextRequest) {
  try {
    // verifyToken(req); // Décommentez pour activer l'auth
    const { id } = await req.json() as { id: number };
    if (!id) throw new Error('ID requis');
    const [result] = await pool.execute('DELETE FROM participants WHERE id = ?', [id]);
    if ((result as any).affectedRows === 0) throw new Error('Participant non trouvé');
    const response = NextResponse.json({ message: 'Participant supprimé' }, { status: 200 });
    return addCORSHeaders(response);
  } catch (error: any) {
    console.error('Erreur DELETE participant:', error);
    const response = NextResponse.json({ message: error.message }, { status: 400 });
    return addCORSHeaders(response);
  }
}
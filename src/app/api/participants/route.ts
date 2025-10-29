import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import { Participant } from '@/app/lib/types';
import { verifyToken } from '@/lib/utils';
import { RowDataPacket } from 'mysql2/promise';


// Fonction utilitaire pour ajouter les headers CORS à une réponse
const addCORSHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Ou 'http://localhost:5173' pour prod
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400'); // Cache 24h
  return response;
};

// Handler OPTIONS pour preflight CORS
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return addCORSHeaders(response);
}

// GET : Lister tous les participants
export async function GET(req: NextRequest) {
  try {
    const decoded = verifyToken(req);
    console.log(decoded);

    if (!decoded) {
      const res = NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
      return addCORSHeaders(res);
    }
    const [participants] = await pool.execute<RowDataPacket[]>('SELECT * FROM participants ORDER BY created_at DESC');
    const response = NextResponse.json({ data: participants }, { status: 200 });
    return addCORSHeaders(response);
  } catch (error) {
    const err = error as Error;
    console.error('Erreur GET participants:', err);
    const response = NextResponse.json({ message: err.message }, { status: 401 });
    return addCORSHeaders(response);
  }
}

// POST : Créer un participant
export async function POST(req: NextRequest) {
  try {
    const decoded = verifyToken(req);
    console.log(decoded);

    if (!decoded) {
      const res = NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
      return addCORSHeaders(res);
    }
    const body = await req.json() as Omit<Participant, 'id' | 'created_at' | 'updated_at'>;
    console.log(body);

    if (!body.name || !body.email || !body.domain_id) {
      throw new Error('Champs requis : name, email, domain_id');
    }

    // ✅ Vérifier si email existe déjà
    const [existing] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM participants WHERE email = ?',
      [body.email]
    );
    if (existing.length > 0) {
      throw new Error('Un participant avec cet email existe déjà');
    }

    const [result] = await pool.execute(
      'INSERT INTO participants (domain_id, name, email, poste) VALUES (?, ?, ?, ?)',
      [body.domain_id, body.name, body.email, body.poste]
    );

    const insertId = (result as RowDataPacket[] & { insertId?: number })[0]?.insertId;
    if (!insertId) {
      throw new Error('Erreur lors de la création du participant');
    }
    
    const [newParticipant] = await pool.execute<RowDataPacket[]>('SELECT * FROM participants WHERE id = ?', [insertId]);

    const response = NextResponse.json({ data: newParticipant[0] as Participant }, { status: 201 });
    return addCORSHeaders(response);

  } catch (error) {
    const err = error as Error;
    console.error('Erreur POST participant:', err);
    const response = NextResponse.json({ message: err.message }, { status: 400 });
    return addCORSHeaders(response);
  }
}


// PUT : Mettre à jour un participant
export async function PUT(req: NextRequest) {
  try {
    const decoded = verifyToken(req);
    console.log(decoded);

    if (!decoded) {
      const res = NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
      return addCORSHeaders(res);
    }
    const body = await req.json() as Participant;
    if (!body.id || Object.keys(body).filter(k => ['name', 'email', 'domain_id', 'poste'].includes(k)).length === 0) {
      throw new Error('ID et au moins un champ à mettre à jour requis');
    }
    const setClauses: string[] = [];
    const params: (string | number)[] = [];
    if (body.name !== undefined) { setClauses.push('name = ?'); params.push(body.name); }
    if (body.email !== undefined) { setClauses.push('email = ?'); params.push(body.email); }
    if (body.domain_id !== undefined) { setClauses.push('domain_id = ?'); params.push(body.domain_id); }
    if (body.poste !== undefined) { setClauses.push('poste = ?'); params.push(body.poste); }
    params.push(body.id);

    const [updateResult] = await pool.execute(
      `UPDATE participants SET ${setClauses.join(', ')} WHERE id = ?`,
      params
    );
    if ((updateResult as unknown as { affectedRows: number }).affectedRows === 0) throw new Error('Participant non trouvé');
    const [updated] = await pool.execute<RowDataPacket[]>('SELECT * FROM participants WHERE id = ?', [body.id]);
    const response = NextResponse.json({ data: updated[0] as Participant }, { status: 200 });
    return addCORSHeaders(response);
  } catch (error) {
    const err = error as Error;
    console.error('Erreur PUT participant:', err);
    const response = NextResponse.json({ message: err.message }, { status: 400 });
    return addCORSHeaders(response);
  }
}

// DELETE : Supprimer un participant
export async function DELETE(req: NextRequest) {
  try {
    const decoded = verifyToken(req);
    console.log(decoded);

    if (!decoded) {
      const res = NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
      return addCORSHeaders(res);
    }
    const { id } = await req.json() as { id: number };
    if (!id) throw new Error('ID requis');
    const [result] = await pool.execute('DELETE FROM participants WHERE id = ?', [id]);
    if ((result as unknown as { affectedRows: number }).affectedRows === 0) throw new Error('Participant non trouvé');
    const response = NextResponse.json({ message: 'Participant supprimé' }, { status: 200 });
    return addCORSHeaders(response);
  } catch (error) {
    const err = error as Error;
    console.error('Erreur DELETE participant:', err);
    const response = NextResponse.json({ message: err.message }, { status: 400 });
    return addCORSHeaders(response);
  }
}
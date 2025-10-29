import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/app/lib/db';
import { Domain } from '@/app/lib/types';
import { RowDataPacket } from 'mysql2/promise';
import { verifyToken } from '@/lib/utils';



// Utilitaire pour ajouter les headers CORS
const addCORSHeaders = (response: NextResponse): NextResponse => {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Ou 'http://localhost:5173'
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
};

// Handler OPTIONS pour preflight CORS
export async function OPTIONS(req: NextRequest): Promise<NextResponse> {
  const response = new NextResponse(null, { status: 204 });
  return addCORSHeaders(response);
}

// GET : Lister tous les domaines avec leurs participants et templates
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const decoded = verifyToken(req);
    console.log(decoded);

    if (!decoded) {
      const res = NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
      return addCORSHeaders(res);
    }
    const [domains] = await pool.execute<RowDataPacket[]>('SELECT * FROM domains ORDER BY created_at DESC');

    if (!domains.length) {
      return addCORSHeaders(NextResponse.json({ data: [] }, { status: 200 }));
    }

    const domainIds = domains.map((d: any) => d.id);

    const [participants] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM participants WHERE domain_id IN (${domainIds.map(() => '?').join(',')})`,
      domainIds
    );

    const [templates] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM templates WHERE domain_id IN (${domainIds.map(() => '?').join(',')})`,
      domainIds
    );

    const domainsWithDetails = domains.map((domain: any) => {
      const domainId = domain.id;
      return {
        ...domain,
        participants: (participants as any[]).filter((p: any) => p.domain_id === domainId),
        templates: (templates as any[]).filter((t: any) => t.domain_id === domainId),
      };
    });

    return addCORSHeaders(NextResponse.json({ data: domainsWithDetails }, { status: 200 }));
  } catch (error: any) {
    console.error('Erreur GET domaines:', error);
    return addCORSHeaders(NextResponse.json({ message: error.message }, { status: 500 }));
  }
}

// POST : Créer un domaine
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const decoded = verifyToken(req);
    console.log(decoded);

    if (!decoded) {
      const res = NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
      return addCORSHeaders(res);
    }
    const body = await req.json() as Omit<Domain, 'id' | 'created_at' | 'updated_at'>;
    if (!body.name || !body.client_id || !body.description) {
      throw new Error('Champs requis : nom, description, client_id');
    }
    const [result] = await pool.execute(
      'INSERT INTO domains (client_id, name, description) VALUES (?, ?, ?)',
      [body.client_id, body.name, body.description]
    );
    const insertId = (result as any).insertId;
    const [newDomain] = await pool.execute<RowDataPacket[]>('SELECT * FROM domains WHERE id = ?', [insertId]);
    return addCORSHeaders(NextResponse.json({ data: newDomain[0] }, { status: 201 }));
  } catch (error: any) {
    console.error('Erreur POST domaine:', error);
    return addCORSHeaders(NextResponse.json({ message: error.message }, { status: 400 }));
  }
}

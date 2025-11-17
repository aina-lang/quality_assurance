import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import { RowDataPacket } from 'mysql2/promise';
import { Participant } from '@/app/lib/types';

const addCORSHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
};

// GET: List all participants with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const domainId = searchParams.get('domain_id');
    const search = searchParams.get('search');

    let query = 'SELECT p.*, d.name as domain_name, d.client_id FROM participants p LEFT JOIN domains d ON p.domain_id = d.id WHERE 1=1';
    const params: (string | number)[] = [];

    if (domainId) {
      query += ' AND p.domain_id = ?';
      params.push(Number(domainId));
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.email LIKE ? OR p.poste LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY p.created_at DESC';

    const [participants] = await pool.execute<RowDataPacket[]>(query, params);
    
    const response = NextResponse.json({ 
      success: true, 
      data: participants,
      total: participants.length 
    }, { status: 200 });
    return addCORSHeaders(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error GET participants CRM:', err);
    const response = NextResponse.json({ 
      success: false, 
      message: err.message 
    }, { status: 500 });
    return addCORSHeaders(response);
  }
}

// POST: Create a participant
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Omit<Participant, 'id' | 'created_at' | 'updated_at'>;
    
    if (!body.name || !body.email || !body.domain_id) {
      throw new Error('Required fields: name, email, domain_id');
    }

    // Check if email already exists
    const [existing] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM participants WHERE email = ?',
      [body.email]
    );
    if (existing.length > 0) {
      throw new Error('A participant with this email already exists');
    }

    const [result] = await pool.execute(
      'INSERT INTO participants (domain_id, name, email, poste) VALUES (?, ?, ?, ?)',
      [body.domain_id, body.name, body.email, body.poste || '']
    );

    const insertId = (result as unknown as { insertId: number }).insertId;
    const [newParticipant] = await pool.execute<RowDataPacket[]>(
      'SELECT p.*, d.name as domain_name FROM participants p LEFT JOIN domains d ON p.domain_id = d.id WHERE p.id = ?',
      [insertId]
    );

    const response = NextResponse.json({ 
      success: true, 
      data: newParticipant[0] as Participant 
    }, { status: 201 });
    return addCORSHeaders(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error POST participant CRM:', err);
    const response = NextResponse.json({ 
      success: false, 
      message: err.message 
    }, { status: 400 });
    return addCORSHeaders(response);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

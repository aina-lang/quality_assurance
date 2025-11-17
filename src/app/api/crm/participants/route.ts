import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import { RowDataPacket } from 'mysql2/promise';
import { Participant } from '@/app/lib/types';
import {
  buildSearchClause,
  getFilterValues,
  getPaginationParams,
  getSortParams,
  parseFilters,
} from '@/app/lib/api-helpers';

const addCORSHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
};

// GET: List all participants with filters
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const { page, pageSize, offset, search } = getPaginationParams(searchParams);
    const filters = getFilterValues(searchParams, ['domain_id', 'client_id']);
    const { clauses: advancedFilterClauses, params: advancedFilterParams } = parseFilters(
      searchParams,
      {
        domain_id: { column: 'p.domain_id', operator: 'eq' },
        client_id: { column: 'd.client_id', operator: 'eq' },
        name: { column: 'p.name', operator: 'like' },
        email: { column: 'p.email', operator: 'like' },
        poste: { column: 'p.poste', operator: 'like' },
      }
    );

    const whereClauses: string[] = [];
    const params: (string | number)[] = [];

    if (filters.domain_id) {
      whereClauses.push('p.domain_id = ?');
      params.push(Number(filters.domain_id));
    }

    if (filters.client_id) {
      whereClauses.push('d.client_id = ?');
      params.push(Number(filters.client_id));
    }

    if (search) {
      const { clause, params: searchParamsArray } = buildSearchClause(
        ['p.name', 'p.email', 'p.poste'],
        search
      );
      if (clause) {
        whereClauses.push(clause);
        params.push(...searchParamsArray);
      }
    }

    if (advancedFilterClauses.length) {
      whereClauses.push(...advancedFilterClauses);
      params.push(...advancedFilterParams);
    }

    const where = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const baseQuery = 'FROM participants p LEFT JOIN domains d ON p.domain_id = d.id';

    const { orderBy } = getSortParams(searchParams, {
      allowedFields: {
        name: 'p.name',
        email: 'p.email',
        domain_id: 'p.domain_id',
        client_id: 'd.client_id',
        domain_name: 'd.name',
        created_at: 'p.created_at',
      },
      defaultField: 'p.created_at',
      defaultOrder: 'desc',
    });

    const dataQuery = `SELECT p.*, d.name as domain_name, d.client_id ${baseQuery} ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) as total ${baseQuery} ${where}`;

    const [participants] = await pool.execute<RowDataPacket[]>(dataQuery, [
      ...params,
      pageSize,
      offset,
    ]);
    const [countRows] = await pool.execute<RowDataPacket[]>(countQuery, params);
    const total =
      Number((countRows[0] as RowDataPacket & { total?: number })?.total ?? 0);

    const response = NextResponse.json({
      success: true,
      data: participants,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNextPage: page * pageSize < total,
      },
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

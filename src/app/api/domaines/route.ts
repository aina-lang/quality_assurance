import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/app/lib/db';
import { Domain } from '@/app/lib/types';
import { RowDataPacket } from 'mysql2/promise';
import { verifyToken } from '@/lib/utils';
import {
  buildSearchClause,
  getFilterValues,
  getPaginationParams,
  getSortParams,
  parseFilters,
} from '@/app/lib/api-helpers';


// Utility to add CORS headers
const addCORSHeaders = (response: NextResponse): NextResponse => {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Ou 'http://localhost:5173'
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
};

// Handler OPTIONS for CORS preflight
export async function OPTIONS(req: NextRequest): Promise<NextResponse> {
  const response = new NextResponse(null, { status: 204 });
  return addCORSHeaders(response);
}

// GET: List all domains with their participants and templates
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const decoded = verifyToken(req);
    console.log(decoded);

    if (!decoded) {
      const res = NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      return addCORSHeaders(res);
    }
    const searchParams = req.nextUrl.searchParams;
    const { page, pageSize, offset, search } = getPaginationParams(searchParams);
    const filters = getFilterValues(searchParams, ['client_id']);
    const { clauses: advancedFilterClauses, params: advancedFilterParams } = parseFilters(
      searchParams,
      {
        client_id: { column: 'client_id', operator: 'eq' },
        name: { column: 'name', operator: 'like' },
        description: { column: 'description', operator: 'like' },
      }
    );

    const whereClauses: string[] = [];
    const params: (string | number)[] = [];

    if (filters.client_id) {
      whereClauses.push('client_id = ?');
      params.push(Number(filters.client_id));
    }

    if (search) {
      const { clause, params: searchParamsArray } = buildSearchClause(
        ['name', 'description'],
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
    const { orderBy } = getSortParams(searchParams, {
      allowedFields: {
        name: 'name',
        created_at: 'created_at',
        client_id: 'client_id',
      },
      defaultField: 'created_at',
      defaultOrder: 'desc',
    });

    const dataQuery = `SELECT * FROM domains ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) as total FROM domains ${where}`;

    const [domains] = await pool.execute<RowDataPacket[]>(dataQuery, [
      ...params,
      pageSize,
      offset,
    ]);
    const [countRows] = await pool.execute<RowDataPacket[]>(countQuery, params);
    const total =
      Number((countRows[0] as RowDataPacket & { total?: number })?.total ?? 0);

    if (!domains.length) {
      return addCORSHeaders(
        NextResponse.json(
          {
            success: true,
            data: [],
            meta: {
              page,
              pageSize,
              total,
              totalPages: 0,
              hasNextPage: false,
            },
          },
          { status: 200 }
        )
      );
    }

    const domainIds = domains.map((d: any) => d.id);

    let participants: RowDataPacket[] = [];
    let templates: RowDataPacket[] = [];

    if (domainIds.length) {
      const placeholders = domainIds.map(() => '?').join(',');
      [participants] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM participants WHERE domain_id IN (${placeholders})`,
        domainIds
      );

      [templates] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM templates WHERE domain_id IN (${placeholders})`,
        domainIds
      );
    }

    const domainsWithDetails = domains.map((domain: any) => {
      const domainId = domain.id;
      return {
        ...domain,
        participants: (participants as any[]).filter((p: any) => p.domain_id === domainId),
        templates: (templates as any[]).filter((t: any) => t.domain_id === domainId),
      };
    });

    return addCORSHeaders(
      NextResponse.json(
        {
          success: true,
          data: domainsWithDetails,
          meta: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
            hasNextPage: page * pageSize < total,
          },
        },
        { status: 200 }
      )
    );
  } catch (error: any) {
    console.error('Error GET domains:', error);
    return addCORSHeaders(NextResponse.json({ message: error.message }, { status: 500 }));
  }
}

// POST: Create a domain
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const decoded = verifyToken(req);
    console.log(decoded);

    if (!decoded) {
      const res = NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      return addCORSHeaders(res);
    }
    const body = await req.json() as Omit<Domain, 'id' | 'created_at' | 'updated_at'>;
    if (!body.name || !body.client_id || !body.description) {
      throw new Error('Required fields: name, description, client_id');
    }
    const [result] = await pool.execute(
      'INSERT INTO domains (client_id, name, description) VALUES (?, ?, ?)',
      [body.client_id, body.name, body.description]
    );
    const insertId = (result as any).insertId;
    const [newDomain] = await pool.execute<RowDataPacket[]>('SELECT * FROM domains WHERE id = ?', [insertId]);
    return addCORSHeaders(NextResponse.json({ data: newDomain[0] }, { status: 201 }));
  } catch (error: any) {
    console.error('Error POST domain:', error);
    return addCORSHeaders(NextResponse.json({ message: error.message }, { status: 400 }));
  }
}

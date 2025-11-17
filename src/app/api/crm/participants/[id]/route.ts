import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import { RowDataPacket } from 'mysql2/promise';
import { Participant } from '@/app/lib/types';

const addCORSHeaders = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
};

// PUT: Update a participant
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await req.json() as Partial<Participant>;
    
    const setClauses: string[] = [];
    const params_list: (string | number)[] = [];
    
    if (body.name !== undefined) { 
      setClauses.push('name = ?'); 
      params_list.push(body.name); 
    }
    if (body.email !== undefined) { 
      setClauses.push('email = ?'); 
      params_list.push(body.email); 
    }
    if (body.domain_id !== undefined) { 
      setClauses.push('domain_id = ?'); 
      params_list.push(body.domain_id); 
    }
    if (body.poste !== undefined) { 
      setClauses.push('poste = ?'); 
      params_list.push(body.poste); 
    }
    
    if (setClauses.length === 0) {
      throw new Error('No fields to update');
    }
    
    params_list.push(id);
    
    const [result] = await pool.execute(
      `UPDATE participants SET ${setClauses.join(', ')} WHERE id = ?`,
      params_list
    );
    
    if ((result as unknown as { affectedRows: number }).affectedRows === 0) {
      throw new Error('Participant not found');
    }
    
    const [updated] = await pool.execute<RowDataPacket[]>(
      'SELECT p.*, d.name as domain_name FROM participants p LEFT JOIN domains d ON p.domain_id = d.id WHERE p.id = ?',
      [id]
    );
    
    const response = NextResponse.json({ 
      success: true, 
      data: updated[0] as Participant 
    }, { status: 200 });
    return addCORSHeaders(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error PUT participant CRM:', err);
    const response = NextResponse.json({ 
      success: false, 
      message: err.message 
    }, { status: 400 });
    return addCORSHeaders(response);
  }
}

// DELETE: Delete a participant
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    const [result] = await pool.execute(
      'DELETE FROM participants WHERE id = ?',
      [id]
    );
    
    if ((result as unknown as { affectedRows: number }).affectedRows === 0) {
      throw new Error('Participant not found');
    }
    
    const response = NextResponse.json({ 
      success: true, 
      message: 'Participant deleted successfully' 
    }, { status: 200 });
    return addCORSHeaders(response);
  } catch (error) {
    const err = error as Error;
    console.error('Error DELETE participant CRM:', err);
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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

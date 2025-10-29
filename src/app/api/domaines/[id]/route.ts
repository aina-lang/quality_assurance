import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import { RowDataPacket } from 'mysql2/promise';
import { verifyToken } from '@/lib/utils';
import { Domain } from '@/app/lib/types';


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

// GET : Récupérer un domaine spécifique avec ses participants et templates
export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
        const decoded = verifyToken(req);
        console.log(decoded);

        if (!decoded) {
            const res = NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
            return addCORSHeaders(res);
        }

        verifyToken(req); // Décommentez pour activer l'auth
        const id = params.id;
        if (!id || isNaN(Number(id))) throw new Error('ID de domaine invalide');

        const [domains] = await pool.execute<RowDataPacket[]>('SELECT * FROM domains WHERE id = ?', [id]);
        if (!domains.length) throw new Error('Domaine non trouvé');

        const [participants] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM participants WHERE domain_id = ?',
            [id]
        );

        const [templates] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM templates WHERE domain_id = ?',
            [id]
        );

        const domain = domains[0];
        const domainWithDetails = {
            ...domain,
            participants: participants as any[],
            templates: templates as any[],
        };

        return addCORSHeaders(NextResponse.json({ data: domainWithDetails }, { status: 200 }));
    } catch (error: any) {
        console.error('Erreur GET domaine spécifique:', error);
        return addCORSHeaders(NextResponse.json({ message: error.message }, { status: 500 }));
    }
}



// DELETE : Supprimer un domaine
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
        verifyToken(req);
        const id = params.id;
        if (!id) throw new Error('ID requis');
        const [result] = await pool.execute('DELETE FROM domains WHERE id = ?', [id]);
        if ((result as any).affectedRows === 0) throw new Error('Domaine non trouvé');
        return addCORSHeaders(NextResponse.json({ message: 'Domaine supprimé' }, { status: 200 }));
    } catch (error: any) {
        console.error('Erreur DELETE domaine:', error);
        return addCORSHeaders(NextResponse.json({ message: error.message }, { status: 400 }));
    }
}



// PUT : Mettre à jour un domaine
export async function PUT(req: NextRequest): Promise<NextResponse> {
    try {
        verifyToken(req);
    console.log(req.json);
    
        const body = await req.json() as Domain;
        if (!body.id || Object.keys(body).filter(k => ['name', 'description', 'client_id'].includes(k)).length === 0) {
            throw new Error('ID et au moins un champ à mettre à jour requis');
        }
        const setClauses: string[] = [];
        const params: any[] = [];
        if (body.name !== undefined) { setClauses.push('name = ?'); params.push(body.name); }
        if (body.description !== undefined) { setClauses.push('description = ?'); params.push(body.description); }
        if (body.client_id !== undefined) { setClauses.push('client_id = ?'); params.push(body.client_id); }
        params.push(body.id);

        const [updateResult] = await pool.execute(
            `UPDATE domains SET ${setClauses.join(', ')} WHERE id = ?`,
            params
        );
        if ((updateResult as any).affectedRows === 0) throw new Error('Domaine non trouvé');
        const [updated] = await pool.execute<RowDataPacket[]>('SELECT * FROM domains WHERE id = ?', [body.id]);
        return addCORSHeaders(NextResponse.json({ data: updated[0] }, { status: 200 }));
    } catch (error: any) {
        console.error('Erreur PUT domaine:', error);
        return addCORSHeaders(NextResponse.json({ message: error.message }, { status: 400 }));
    }
}


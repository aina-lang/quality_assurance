import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { pool } from '@/app/lib/db';
import { Domain } from '@/app/lib/types';
import { RowDataPacket } from 'mysql2/promise';

// Middleware JWT
const verifyToken = (req: NextRequest): boolean => {
    const authHeader = req.headers.get('authorization');
    console.log('Full Auth Header:', authHeader); // Debug
    const token = authHeader?.split(' ')[1];
    console.log('Extracted Token:', token ? 'Present' : 'Missing');
    if (!token) throw new Error('Token manquant');
    try {
        const secret = process.env.AUTH_SECRET || 'your-secret-key';
        if (!secret) throw new Error('Clé secrète manquante dans les variables d\'environnement');
        console.log('Using Secret Length:', secret.length); // Debug
        jwt.verify(token, secret);
        return true;
    } catch (err: any) {
        console.error('JWT Verify Error:', err.message);
        throw new Error('Token invalide');
    }
};

// Utilitaire pour ajouter les headers CORS
const addCORSHeaders = (response: NextResponse): NextResponse => {
    response.headers.set('Access-Control-Allow-Origin', '*'); // Ou 'http://localhost:5173'
    response.headers.set('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
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
        console.log(params);

        // verifyToken(req); // Décommentez pour activer l'auth
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
        // verifyToken(req); // Décommentez pour activer l'auth
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
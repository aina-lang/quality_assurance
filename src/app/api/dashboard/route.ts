// src/app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';
import { verifyToken } from '@/lib/utils';

const addCORSHeaders = (response: NextResponse) => {
    response.headers.set('Access-Control-Allow-Origin', '*'); // Or limit to your Electron app URL
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    return response;
};

// --- Preflight handling (OPTIONS)
export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });
    return addCORSHeaders(response);
}



// --- Secure GET ---
export async function GET(req: NextRequest) {
    try {
    
        const decoded = verifyToken(req);
        console.log(decoded);
        
        if (!decoded) {
            const res = NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
            return addCORSHeaders(res);
        }

        const userId = decoded.id;

        // --- SQL data retrieval ---
        const [participants]: any = await pool.execute('SELECT * FROM participants');

        let templatesCount = 14;
        try {
            const [templates]: any = await pool.execute('SELECT * FROM templates');
            templatesCount = templates.length;
        } catch (err) {
            console.warn('Templates table not found, using hardcoded value');
        }

        let domainsCount = 0;
        try {
            const [domains]: any = await pool.execute('SELECT * FROM domains');
            domainsCount = domains.length;
        } catch {
            const uniqueDomains = Array.from(new Set(participants.map((p: any) => p.domain_id)));
            domainsCount = uniqueDomains.length;
        }

        let subscription: any = {
            client_id: userId,
            account_type_id: 1,
            start_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            status: 'active',
        };
        try {
            const [subscriptions]: any = await pool.execute(
                'SELECT * FROM subscriptions WHERE client_id = ? AND status = ?',
                [userId, 'active']
            );
            if (subscriptions.length > 0) subscription = subscriptions[0];
        } catch { }

        const mapAccountTypeIdToType = (id: number) => {
            switch (id) {
                case 1:
                    return 'Premium';
                case 2:
                    return 'Platinium';
                case 3:
                    return 'VIP';
                default:
                    return 'Free';
            }
        };

        const dashboardData = {
            participants: { count: participants.length, description: 'Active participants.' },
            templates: { count: templatesCount, description: 'Custom templates.' },
            domains: { count: domainsCount, description: 'Registered domains.' },
            userAccount: {
                type: mapAccountTypeIdToType(subscription.account_type_id),
                subscriptionStart: subscription.start_date,
                subscriptionEnd: subscription.end_date,
            },
        };

        const res = NextResponse.json({ data: dashboardData }, { status: 200 });
        return addCORSHeaders(res);
    } catch (error: any) {
        console.error('API Error:', error);
        const res = NextResponse.json({ message: error.message }, { status: 500 });
        return addCORSHeaders(res);
    }
}

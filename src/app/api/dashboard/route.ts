// src/app/api/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/lib/db';


const addCORSHeaders = (response: NextResponse) => {
    response.headers.set('Access-Control-Allow-Origin', '*'); // Ou 'http://localhost:5173' pour prod
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400'); // Cache 24h
    return response;
};
// Types
interface Participant {
    id: number;
    domain_id: number;
    name: string;
    email: string;
    poste: string | null;
    created_at: string;
    updated_at: string | null;
}

interface Template {
    id: number;
    name: string;
    created_at: string;
}

interface Domain {
    id: number;
    name: string;
}

interface Subscription {
    client_id: number;
    account_type_id: number;
    start_date: string;
    end_date: string;
    status: string;
}

interface DashboardData {
    participants: {
        count: number;
        description: string;
    };
    templates: {
        count: number;
        description: string;
    };
    domains: {
        count: number;
        description: string;
    };
    userAccount: {
        type: 'Gratuit' | 'Premium' | 'Platinium' | 'VIP';
        subscriptionStart: string;
        subscriptionEnd: string;
    };
}

// Map account_type_id to AccountType
const mapAccountTypeIdToType = (accountTypeId: number): 'Gratuit' | 'Premium' | 'Platinium' | 'VIP' => {
    switch (accountTypeId) {
        case 1:
            return 'Premium';
        case 2:
            return 'Platinium';
        case 3:
            return 'VIP';
        default:
            return 'Gratuit';
    }
};

// Handler for OPTIONS (CORS preflight)
export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });
    return addCORSHeaders(response);
}

// GET: Fetch all dashboard data
export async function GET() {
    try {
        // Fetch participants
        const [participants]: [Participant[]] = await pool.execute('SELECT * FROM participants');

        // Fetch templates (assuming a templates table; adjust or hardcode if needed)
        let templatesCount = 14;
        try {
            const [templates]: [Template[]] = await pool.execute('SELECT * FROM templates');
            templatesCount = templates.length;
        } catch (err) {
            console.warn('Templates table not found, using hardcoded value:', templatesCount);
        }

        // Fetch unique domains from participants or domains table
        let domainsCount = 0;
        try {
            const [domains]: [Domain[]] = await pool.execute('SELECT * FROM domains');
            domainsCount = domains.length;
        } catch (err) {
            const uniqueDomains = Array.from(new Set(participants.map((p) => p.domain_id)));
            domainsCount = uniqueDomains.length;
            console.warn('Domains table not found, using unique domain_id from participants:', domainsCount);
        }

        // Fetch subscription data (assuming client_id = 3 for the current user)
        let subscription: Subscription = {
            client_id: 3,
            account_type_id: 1,
            start_date: new Date().toISOString(),
            end_date: new Date().toISOString(),
            status: 'active',
        };
        try {
            const [subscriptions]: [Subscription[]] = await pool.execute(
                'SELECT * FROM subscriptions WHERE client_id = ? AND status = ?',
                [3, 'active']
            );
            if (subscriptions.length > 0) {
                subscription = subscriptions[0];
            }
        } catch (err) {
            console.warn('Subscriptions table not found or no active subscription, using default:', subscription);
        }

        // Aggregate dashboard data
        const dashboardData: DashboardData = {
            participants: {
                count: participants.length,
                description: 'Participants actifs répartis sur plusieurs domaines.',
            },
            templates: {
                count: templatesCount,
                description: 'Modèles personnalisés utilisés dans vos projets.',
            },
            domains: {
                count: domainsCount,
                description: 'Domaines enregistrés pour votre compte.',
            },
            userAccount: {
                type: mapAccountTypeIdToType(subscription.account_type_id),
                subscriptionStart: subscription.start_date,
                subscriptionEnd: subscription.end_date,
            },
        };

        const response = NextResponse.json({ data: dashboardData }, { status: 200 });
        return addCORSHeaders(response);
    } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        const response = NextResponse.json({ message: error.message }, { status: 500 });
        return addCORSHeaders(response);
    }
}
"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';

export default function Offres() {
    const plans = [
        {
            name: "Gratuit",
            price: "0",
            period: "Ar",
            description: "Parfait pour découvrir Quality Assurance",
            badge: null,
            features: [
                "10 domaines inclus",
                "Templates de base",
                "Support communautaire",
                "Exportation PDF",
                "1 utilisateur",
                "Stockage 1 GB"
            ],
            limitations: [
                "Fonctionnalités limitées",
                "Pas de support prioritaire"
            ],
            cta: "Commencer gratuitement",
            popular: false
        },
        {
            name: "Premium",
            price: "50,000",
            period: "Ar/an",
            description: "Idéal pour les petites équipes",
            badge: "Populaire",
            features: [
                "15 domaines inclus",
                "Tous les templates",
                "Support email prioritaire",
                "Exportation multiple formats",
                "Jusqu'à 5 utilisateurs",
                "Stockage 10 GB",
                "Collaboration en temps réel",
                "Historique des versions"
            ],
            limitations: [],
            cta: "Choisir Premium",
            popular: true
        },
        {
            name: "Platinum",
            price: "100,000",
            period: "Ar/an",
            description: "Pour les équipes en croissance",
            badge: "Recommandé",
            features: [
                "20 domaines inclus",
                "Templates personnalisés",
                "Support téléphonique",
                "API d'intégration",
                "Jusqu'à 15 utilisateurs",
                "Stockage 50 GB",
                "Rapports avancés",
                "Formation en ligne",
                "Sauvegarde automatique"
            ],
            limitations: [],
            cta: "Choisir Platinum",
            popular: false
        },
        {
            name: "VIP",
            price: "200,000",
            period: "Ar/an",
            description: "Solution entreprise complète",
            badge: "Entreprise",
            features: [
                "Domaines illimités (+20)",
                "Templates sur mesure",
                "Support dédié 24/7",
                "Intégrations personnalisées",
                "Utilisateurs illimités",
                "Stockage illimité",
                "Tableau de bord exécutif",
                "Formation sur site",
                "Consultant dédié",
                "SLA garanti"
            ],
            limitations: [],
            cta: "Contacter l'équipe",
            popular: false
        }
    ];

    const paymentMethods = [
        "PayPal",
        "Carte bancaire",
        "Virement bancaire",
        "Mobile Money",
        "Orange Money",
        "MVola"
    ];

    const faqs = [
        {
            question: "Puis-je changer d'abonnement à tout moment ?",
            answer: "Oui, vous pouvez upgrader ou downgrader votre abonnement à tout moment. Les changements prennent effet immédiatement."
        },
        {
            question: "Y a-t-il une période d'essai ?",
            answer: "L'abonnement Gratuit vous permet de tester les fonctionnalités de base. Pour les abonnements payants, nous offrons une garantie de remboursement de 30 jours."
        },
        {
            question: "Comment fonctionne la facturation ?",
            answer: "La facturation est annuelle. Vous recevrez une facture au début de chaque période d'abonnement."
        },
        {
            question: "Que se passe-t-il si je dépasse mes limites ?",
            answer: "Nous vous notifierons avant d'atteindre vos limites. Vous pourrez alors upgrader votre abonnement ou supprimer du contenu."
        }
    ];

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-brand-500/5 via-background to-secondary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-wider text-muted-foreground">
                            Choisissez votre <span className="text-brand-500">abonnement</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Des plans flexibles adaptés à tous les besoins, de l'entrepreneur individuel
                            aux grandes entreprises. Commencez gratuitement et évoluez selon vos besoins.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Plans */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`relative h-full ${plan.popular
                                ? 'border-brand-500 shadow-lg scale-105'
                                : 'hover:shadow-md transition-shadow'
                                }`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Badge
                                        variant={plan.popular ? "default" : "secondary"}
                                        className={`px-3 py-1 text-sm flex items-center ${plan.popular ? 'bg-brand-500 text-white' : ''}`}
                                    >
                                        {plan.badge === "Populaire" && <Star className="w-3 h-3 mr-1" />}
                                        {plan.badge === "Entreprise" && <Crown className="w-3 h-3 mr-1" />}
                                        {plan.badge}
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-6">
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                <CardDescription className="text-base">{plan.description}</CardDescription>
                                <div className="pt-4">
                                    <div className="text-4xl font-bold">
                                        {plan.price === "0" ? "Gratuit" : `${plan.price.toLocaleString()}`}
                                        {plan.price !== "0" && (
                                            <span className="text-lg font-normal text-muted-foreground ml-1">
                                                {plan.period}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    {plan.features.map((feature, featureIndex) => (
                                        <div key={featureIndex} className="flex items-start space-x-3">
                                            <Check className="h-5 w-5 text-brand flex-shrink-0 mt-0.5" />
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}

                                    {plan.limitations.map((limitation, limitIndex) => (
                                        <div key={limitIndex} className="flex items-start space-x-3 opacity-60">
                                            <div className="h-5 w-5 flex-shrink-0 mt-0.5 flex items-center justify-center">
                                                <div className="h-1 w-3 bg-muted-foreground rounded"></div>
                                            </div>
                                            <span className="text-sm text-muted-foreground">{limitation}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button

                                    className="w-full"
                                    variant={plan.popular ? "primary" : "outline"}

                                >
                                    <Link href="subscription">
                                        {plan.cta}
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Payment Methods */}
            <section className="bg-muted/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center space-y-8">
                        <h2 className="text-3xl font-bold">Moyens de paiement acceptés</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Nous acceptons plusieurs moyens de paiement pour votre convenance
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
                            {paymentMethods.map((method, index) => (
                                <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow">
                                    <CardContent className="p-0">
                                        <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                                            <Shield className="h-6 w-6 text-brand" />
                                        </div>
                                        <span className="text-sm font-medium">{method}</span>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                            <Shield className="h-4 w-4" />
                            <span>Paiements sécurisés avec chiffrement SSL</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Comparison */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl font-bold">Comparaison détaillée</h2>
                    <p className="text-lg text-muted-foreground">
                        Trouvez l'abonnement qui correspond parfaitement à vos besoins
                    </p>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 font-semibold">Fonctionnalités</th>
                                        <th className="text-center p-4 font-semibold">Gratuit</th>
                                        <th className="text-center p-4 font-semibold">Premium</th>
                                        <th className="text-center p-4 font-semibold">Platinum</th>
                                        <th className="text-center p-4 font-semibold">VIP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="p-4 font-medium">Nombre de domaines</td>
                                        <td className="text-center p-4">10</td>
                                        <td className="text-center p-4">15</td>
                                        <td className="text-center p-4">20</td>
                                        <td className="text-center p-4">Illimité</td>
                                    </tr>
                                    <tr className="bg-muted/25">
                                        <td className="p-4 font-medium">Utilisateurs</td>
                                        <td className="text-center p-4">1</td>
                                        <td className="text-center p-4">5</td>
                                        <td className="text-center p-4">15</td>
                                        <td className="text-center p-4">Illimité</td>
                                    </tr>
                                    {/* <tr>
                                        <td className="p-4 font-medium">Stockage</td>
                                        <td className="text-center p-4">1 GB</td>
                                        <td className="text-center p-4">10 GB</td>
                                        <td className="text-center p-4">50 GB</td>
                                        <td className="text-center p-4">Illimité</td>
                                    </tr> */}
                                    <tr className="bg-muted/25">
                                        <td className="p-4 font-medium">Support</td>
                                        <td className="text-center p-4">Communauté</td>
                                        <td className="text-center p-4">Email</td>
                                        <td className="text-center p-4">Téléphone</td>
                                        <td className="text-center p-4">24/7 Dédié</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* FAQ */}
            <section className="bg-muted/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl font-bold">Questions fréquentes</h2>
                        <p className="text-lg text-muted-foreground">
                            Trouvez rapidement les réponses à vos questions
                        </p>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{faq.answer}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="bg-gradient-to-r from-brand-200 to-brand-500/80 text-white">
                    <CardContent className="p-12 text-center space-y-6">
                        <h2 className="text-3xl font-bold">
                            Prêt à commencer ?
                        </h2>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Rejoignez des milliers d'entreprises qui optimisent leur gestion qualité avec Quality Assurance
                        </p>
                        <Button variant="outline" className="text-lg px-8 py-6">
                            <Link href="subscription" className='flex'>
                                <Zap className="mr-2 h-5 w-5" />
                                Commencer maintenant
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
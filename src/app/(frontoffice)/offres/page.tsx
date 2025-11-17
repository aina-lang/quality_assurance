"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';

export default function Offres() {
    const plans = [
        {
            name: "Free",
            price: "0",
            period: "Ar",
            description: "Perfect for discovering Quality Assurance",
            badge: null,
            features: [
                "10 domains included",
                "Starter template library",
                "Community support",
                "PDF export",
                "1 user",
                "1 GB storage"
            ],
            limitations: [
                "Limited functionality",
                "No priority support"
            ],
            cta: "Start for free",
            popular: false
        },
        {
            name: "Premium",
            price: "50,000",
            period: "Ar/an",
            description: "Ideal for small teams",
            badge: "Popular",
            features: [
                "15 domains included",
                "Full template catalog",
                "Priority email support",
                "Multi-format export",
                "Up to 5 users",
                "10 GB storage",
                "Real-time collaboration",
                "Version history"
            ],
            limitations: [],
            cta: "Choose Premium",
            popular: true
        },
        {
            name: "Platinum",
            price: "100,000",
            period: "Ar/an",
            description: "Built for scaling teams",
            badge: "Recommended",
            features: [
                "20 domains included",
                "Custom templates",
                "Phone support",
                "Integration API",
                "Up to 15 users",
                "50 GB storage",
                "Advanced reporting",
                "Live training",
                "Automatic backups"
            ],
            limitations: [],
            cta: "Choose Platinum",
            popular: false
        },
        {
            name: "VIP",
            price: "200,000",
            period: "Ar/an",
            description: "Complete enterprise solution",
            badge: "Enterprise",
            features: [
                "Unlimited domains (+20)",
                "Bespoke templates",
                "Dedicated 24/7 support",
                "Custom integrations",
                "Unlimited users",
                "Unlimited storage",
                "Executive dashboard",
                "On-site training",
                "Dedicated consultant",
                "Guaranteed SLA"
            ],
            limitations: [],
            cta: "Contact our team",
            popular: false
        }
    ];

    const paymentMethods = [
        "PayPal",
        "Credit card",
        "Bank transfer",
        "Mobile Money",
        "Orange Money",
        "MVola"
    ];

    const faqs = [
        {
            question: "Can I change plans at any time?",
            answer: "Yes. You can upgrade or downgrade whenever you want, and the change takes effect immediately."
        },
        {
            question: "Is there a trial period?",
            answer: "The Free plan lets you test core features. Paid plans include a 30-day money-back guarantee."
        },
        {
            question: "How does billing work?",
            answer: "Billing is annual. You’ll receive an invoice at the start of each subscription period."
        },
        {
            question: "What if I exceed my limits?",
            answer: "We notify you before you hit any limits so you can upgrade or clean up content in advance."
        }
    ];

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-brand-500/5 via-background to-secondary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-wider text-muted-foreground">
                            Choose your <span className="text-brand-500">plan</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Flexible plans for every need, from solo builders to enterprise teams. Start for free and scale as you grow.
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
                                        {plan.badge === "Popular" && <Star className="w-3 h-3 mr-1" />}
                                        {plan.badge === "Enterprise" && <Crown className="w-3 h-3 mr-1" />}
                                        {plan.badge}
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center pb-6">
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                <CardDescription className="text-base">{plan.description}</CardDescription>
                                <div className="pt-4">
                                    <div className="text-4xl font-bold">
                                        {plan.price === "0" ? "Free" : `${plan.price.toLocaleString()}`}
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
                        <h2 className="text-3xl font-bold">Accepted payment methods</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Choose the payment option that works best for your team.
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
                            <span>Secure payments protected by SSL encryption</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Comparison */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-3xl font-bold">Detailed comparison</h2>
                    <p className="text-lg text-muted-foreground">
                        Find the plan that fits your workflow perfectly.
                    </p>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 font-semibold">Features</th>
                                        <th className="text-center p-4 font-semibold">Free</th>
                                        <th className="text-center p-4 font-semibold">Premium</th>
                                        <th className="text-center p-4 font-semibold">Platinum</th>
                                        <th className="text-center p-4 font-semibold">VIP</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    <tr>
                                        <td className="p-4 font-medium">Number of domains</td>
                                        <td className="text-center p-4">10</td>
                                        <td className="text-center p-4">15</td>
                                        <td className="text-center p-4">20</td>
                                        <td className="text-center p-4">Unlimited</td>
                                    </tr>
                                    <tr className="bg-muted/25">
                                        <td className="p-4 font-medium">Users</td>
                                        <td className="text-center p-4">1</td>
                                        <td className="text-center p-4">5</td>
                                        <td className="text-center p-4">15</td>
                                        <td className="text-center p-4">Unlimited</td>
                                    </tr>
                                    {/* <tr>
                                        <td className="p-4 font-medium">Storage</td>
                                        <td className="text-center p-4">1 GB</td>
                                        <td className="text-center p-4">10 GB</td>
                                        <td className="text-center p-4">50 GB</td>
                                        <td className="text-center p-4">Unlimited</td>
                                    </tr> */}
                                    <tr className="bg-muted/25">
                                        <td className="p-4 font-medium">Support</td>
                                        <td className="text-center p-4">Community</td>
                                        <td className="text-center p-4">Email</td>
                                        <td className="text-center p-4">Phone</td>
                                        <td className="text-center p-4">24/7 Dedicated</td>
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
                        <h2 className="text-3xl font-bold">Frequently asked questions</h2>
                        <p className="text-lg text-muted-foreground">
                            Get quick answers to the most common questions.
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
                            Ready to get started?
                        </h2>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Join the teams that trust Quality Assurance to elevate their quality operations.
                        </p>
                        <Button variant="outline" className="text-lg px-8 py-6">
                            <Link href="subscription" className='flex'>
                                <Zap className="mr-2 h-5 w-5" />
                                Get started now
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
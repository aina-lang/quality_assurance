"use client"
import { SetStateAction, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import {
    Search,
    Book,
    Download,
    Monitor,
    Smartphone,
    Tablet,
    User,
    Settings,
    FileText,
    Users,
    CreditCard,
    Shield,
    HelpCircle,
    ExternalLink,
    Copy,
    CheckCircle
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Button from '@/components/ui/button/Button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import Input from '@/components/form/input/InputField';

export default function Documentation() {
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedCode, setCopiedCode] = useState('');

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(''), 2000);
    };

    const installationSteps = {
        windows: [
            {
                step: 1,
                title: 'Téléchargement',
                content: 'Téléchargez le fichier d\'installation QAPro-Setup.exe depuis la page de téléchargement.',
                code: null
            },
            {
                step: 2,
                title: 'Exécution en tant qu\'administrateur',
                content: 'Clic droit sur le fichier téléchargé et sélectionnez "Exécuter en tant qu\'administrateur".',
                code: null
            },
            {
                step: 3,
                title: 'Assistant d\'installation',
                content: 'Suivez les étapes de l\'assistant d\'installation. Acceptez les termes et choisissez le répertoire d\'installation.',
                code: null
            },
            {
                step: 4,
                title: 'Configuration initiale',
                content: 'Au premier lancement, configurez votre compte et vos préférences.',
                code: null
            }
        ],
        macos: [
            {
                step: 1,
                title: 'Téléchargement',
                content: 'Téléchargez le fichier QAPro.dmg depuis la page de téléchargement.',
                code: null
            },
            {
                step: 2,
                title: 'Montage du disque',
                content: 'Double-cliquez sur le fichier .dmg pour monter l\'image disque.',
                code: null
            },
            {
                step: 3,
                title: 'Installation',
                content: 'Glissez l\'application Quality Assurance vers le dossier Applications.',
                code: null
            },
            {
                step: 4,
                title: 'Autorisation de sécurité',
                content: 'Si macOS bloque l\'application, allez dans Préférences Système > Sécurité et confidentialité pour l\'autoriser.',
                code: null
            }
        ],
        linux: [
            {
                step: 1,
                title: 'Téléchargement',
                content: 'Téléchargez le package approprié (.deb pour Ubuntu/Debian, .rpm pour Fedora/CentOS).',
                code: null
            },
            {
                step: 2,
                title: 'Installation via gestionnaire de paquets',
                content: 'Pour Ubuntu/Debian :',
                code: 'sudo dpkg -i qapro_2.0.1_amd64.deb\nsudo apt-get install -f'
            },
            {
                step: 3,
                title: 'Installation Fedora/CentOS',
                content: 'Pour Fedora/CentOS :',
                code: 'sudo rpm -i qapro-2.0.1.x86_64.rpm'
            },
            {
                step: 4,
                title: 'Lancement',
                content: 'Lancez l\'application depuis le menu Applications ou via le terminal :',
                code: 'qapro'
            }
        ]
    };

    const userGuide = [
        {
            id: 'connexion',
            title: 'Connexion et authentification',
            content: [
                {
                    subtitle: 'Première connexion',
                    text: 'Lors de votre première connexion, utilisez les identifiants fournis lors de l\'inscription. Vous serez invité à changer votre mot de passe.'
                },
                {
                    subtitle: 'Mot de passe oublié',
                    text: 'Utilisez le lien "Mot de passe oublié" sur la page de connexion. Un email de réinitialisation vous sera envoyé.'
                },
                {
                    subtitle: 'Authentification à deux facteurs',
                    text: 'Pour plus de sécurité, activez l\'authentification à deux facteurs dans les paramètres de votre compte.'
                }
            ]
        },
        {
            id: 'domaines',
            title: 'Gestion des domaines',
            content: [
                {
                    subtitle: 'Création d\'un domaine',
                    text: 'Cliquez sur "Nouveau domaine" dans le tableau de bord principal. Donnez un nom descriptif et définissez les permissions d\'accès.'
                },
                {
                    subtitle: 'Limitation par abonnement',
                    text: 'Le nombre de domaines disponibles dépend de votre abonnement : Gratuit (10), Premium (15), Platinum (20), VIP (illimité).'
                },
                {
                    subtitle: 'Attribution de responsables',
                    text: 'Chaque domaine peut avoir un ou plusieurs responsables qui gèrent les accès et le contenu.'
                }
            ]
        },
        {
            id: 'templates',
            title: 'Création et modification de templates',
            content: [
                {
                    subtitle: 'Éditeur visuel',
                    text: 'L\'éditeur de templates utilise une interface drag & drop similaire à Canva. Glissez les éléments depuis la bibliothèque vers votre canvas.'
                },
                {
                    subtitle: 'Bibliothèque de composants',
                    text: 'Accédez à une vaste bibliothèque de composants prédéfinis : textes, images, graphiques, tableaux, etc.'
                },
                {
                    subtitle: 'Sauvegarde automatique',
                    text: 'Vos modifications sont sauvegardées automatiquement toutes les 30 secondes. Vous pouvez aussi sauvegarder manuellement avec Ctrl+S.'
                },
                {
                    subtitle: 'Versioning',
                    text: 'Chaque modification crée une nouvelle version. Vous pouvez revenir à une version antérieure à tout moment.'
                }
            ]
        },
        {
            id: 'fichiers',
            title: 'Ajout et gestion de fichiers',
            content: [
                {
                    subtitle: 'Formats supportés',
                    text: 'Quality Assurance supporte de nombreux formats : PDF, DOC/DOCX, images (JPG, PNG, SVG), vidéos (MP4, AVI), audio (MP3, WAV).'
                },
                {
                    subtitle: 'Taille maximale',
                    text: 'La taille maximale par fichier varie selon votre abonnement : Gratuit (10MB), Premium (50MB), Platinum (100MB), VIP (illimité).'
                },
                {
                    subtitle: 'Organisation',
                    text: 'Organisez vos fichiers en dossiers et sous-dossiers. Utilisez les tags pour faciliter la recherche.'
                },
                {
                    subtitle: 'Partage',
                    text: 'Partagez vos fichiers avec des permissions granulaires : lecture seule, modification, ou administration complète.'
                }
            ]
        },
        {
            id: 'roles',
            title: 'Rôles et permissions',
            content: [
                {
                    subtitle: 'Rôle Client',
                    text: 'Les Clients ont accès complet à leur domaine : création, modification, suppression de contenu et gestion des utilisateurs.'
                },
                {
                    subtitle: 'Rôle Participant',
                    text: 'Les Participants ont un accès en lecture seule ou limité selon les permissions accordées par le Client.'
                },
                {
                    subtitle: 'Invitations',
                    text: 'Invitez des utilisateurs par email en spécifiant leur rôle et leurs permissions spécifiques.'
                },
                {
                    subtitle: 'Gestion des accès',
                    text: 'Modifiez les permissions à tout moment depuis le panneau de gestion des utilisateurs.'
                }
            ]
        }
    ];

    const licenseInfo = [
        {
            id: 'abonnements',
            title: 'Types d\'abonnements',
            content: [
                {
                    subtitle: 'Gratuit',
                    text: 'Accès limité avec 10 domaines, 1 utilisateur, stockage 1GB. Idéal pour découvrir Quality Assurance.'
                },
                {
                    subtitle: 'Premium',
                    text: '50,000 Ar/an - 15 domaines, 5 utilisateurs, stockage 10GB, support email prioritaire.'
                },
                {
                    subtitle: 'Platinum',
                    text: '100,000 Ar/an - 20 domaines, 15 utilisateurs, stockage 50GB, support téléphonique.'
                },
                {
                    subtitle: 'VIP',
                    text: '200,000 Ar/an - Domaines illimités, utilisateurs illimités, stockage illimité, support 24/7.'
                }
            ]
        },
        {
            id: 'paiements',
            title: 'Gestion des paiements',
            content: [
                {
                    subtitle: 'Facturation annuelle',
                    text: 'Tous les abonnements sont facturés annuellement. Le renouvellement est automatique sauf résiliation.'
                },
                {
                    subtitle: 'Moyens de paiement',
                    text: 'Nous acceptons PayPal, cartes bancaires, virements, Mobile Money, Orange Money, et MVola.'
                },
                {
                    subtitle: 'Compte à rebours',
                    text: 'Votre tableau de bord affiche le temps restant avant le renouvellement de votre abonnement.'
                },
                {
                    subtitle: 'Résiliation',
                    text: 'Vous pouvez résilier votre abonnement à tout moment. L\'accès reste actif jusqu\'à la fin de la période payée.'
                }
            ]
        },
        {
            id: 'support',
            title: 'Support et assistance',
            content: [
                {
                    subtitle: 'Niveaux de support',
                    text: 'Le niveau de support varie selon votre abonnement : communauté (Gratuit), email (Premium), téléphone (Platinum), 24/7 (VIP).'
                },
                {
                    subtitle: 'Documentation',
                    text: 'Cette documentation complète est accessible à tous les utilisateurs, quel que soit leur abonnement.'
                },
                {
                    subtitle: 'Formation',
                    text: 'Les abonnements Platinum et VIP incluent des sessions de formation personnalisées.'
                },
                {
                    subtitle: 'SLA',
                    text: 'Les abonnements VIP bénéficient d\'un SLA garanti avec temps de réponse maximum de 2 heures.'
                }
            ]
        }
    ];

    const faq = [
        {
            question: 'Comment migrer mes données depuis un autre système ?',
            answer: 'Quality Assurance propose des outils d\'import pour les formats courants (CSV, Excel, PDF). Contactez notre support pour une migration assistée.'
        },
        {
            question: 'Puis-je utiliser Quality Assurance hors ligne ?',
            answer: 'Quality Assurance nécessite une connexion internet pour la synchronisation. Cependant, vous pouvez consulter vos documents récents en mode hors ligne.'
        },
        {
            question: 'Comment sauvegarder mes données ?',
            answer: 'Vos données sont automatiquement sauvegardées dans le cloud. Vous pouvez aussi exporter vos domaines en local via les paramètres.'
        },
        {
            question: 'Quelle est la politique de confidentialité ?',
            answer: 'Vos données sont chiffrées et stockées en Europe. Nous respectons le RGPD et ne partageons jamais vos informations avec des tiers.'
        },
        {
            question: 'Comment contacter le support technique ?',
            answer: 'Utilisez le chat intégré, envoyez un email à support@qapro.com, ou appelez notre hotline selon votre niveau d\'abonnement.'
        }
    ];

    const filteredContent = searchQuery ?
        userGuide.filter(section =>
            section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.content.some(item =>
                item.text.toLowerCase().includes(searchQuery.toLowerCase())
            )
        ) : userGuide;

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            <span className="text-primary">Documentation</span> Quality Assurance
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Guide complet d'installation, d'utilisation et de gestion de votre solution
                            Quality Assurance Pro. Trouvez rapidement les réponses à vos questions.
                        </p>

                        {/* Search */}
                        <div className="max-w-md mx-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher dans la documentation..."
                                    className="pl-10"

                                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Tabs defaultValue="installation" className="space-y-8">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                        <TabsTrigger value="installation">Installation</TabsTrigger>
                        <TabsTrigger value="guide">Guide d'utilisation</TabsTrigger>
                        <TabsTrigger value="licence">Licence & Paiements</TabsTrigger>
                        <TabsTrigger value="faq">FAQ</TabsTrigger>
                    </TabsList>

                    {/* Installation Tab */}
                    <TabsContent value="installation" className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Download className="h-5 w-5" />
                                    <span>Installation de Quality Assurance</span>
                                </CardTitle>
                                <CardDescription>
                                    Instructions détaillées pour installer Quality Assurance sur Windows, macOS et Linux
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Tabs defaultValue="windows" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="windows" className="flex items-center space-x-2">
                                    <Monitor className="h-4 w-4" />
                                    <span>Windows</span>
                                </TabsTrigger>
                                <TabsTrigger value="macos" className="flex items-center space-x-2">
                                    <Smartphone className="h-4 w-4" />
                                    <span>macOS</span>
                                </TabsTrigger>
                                <TabsTrigger value="linux" className="flex items-center space-x-2">
                                    <Tablet className="h-4 w-4" />
                                    <span>Linux</span>
                                </TabsTrigger>
                            </TabsList>

                            {Object.entries(installationSteps).map(([platform, steps]) => (
                                <TabsContent key={platform} value={platform}>
                                    <div className="space-y-6">
                                        {steps.map((step, index) => (
                                            <Card key={index}>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                                                            {step.step}
                                                        </div>
                                                        <span>{step.title}</span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <p>{step.content}</p>
                                                    {step.code && (
                                                        <div className="relative">
                                                            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                                                <code>{step.code}</code>
                                                            </pre>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="absolute top-2 right-2"
                                                                onClick={() => copyToClipboard(step.code, `${platform}-${index}`)}
                                                            >
                                                                {copiedCode === `${platform}-${index}` ? (
                                                                    <CheckCircle className="h-4 w-4" />
                                                                ) : (
                                                                    <Copy className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </TabsContent>

                    {/* User Guide Tab */}
                    <TabsContent value="guide" className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Book className="h-5 w-5" />
                                    <span>Guide d'utilisation</span>
                                </CardTitle>
                                <CardDescription>
                                    Apprenez à utiliser toutes les fonctionnalités de Quality Assurance
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Accordion type="single" collapsible className="space-y-4">
                            {filteredContent.map((section) => (
                                <AccordionItem key={section.id} value={section.id}>
                                    <Card>
                                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    {section.id === 'connexion' && <User className="h-4 w-4 text-primary" />}
                                                    {section.id === 'domaines' && <Settings className="h-4 w-4 text-primary" />}
                                                    {section.id === 'templates' && <FileText className="h-4 w-4 text-primary" />}
                                                    {section.id === 'fichiers' && <Download className="h-4 w-4 text-primary" />}
                                                    {section.id === 'roles' && <Users className="h-4 w-4 text-primary" />}
                                                </div>
                                                <span className="font-semibold text-left">{section.title}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <CardContent className="pt-0">
                                                <div className="space-y-6">
                                                    {section.content.map((item, index) => (
                                                        <div key={index} className="space-y-2">
                                                            <h4 className="font-medium text-primary">{item.subtitle}</h4>
                                                            <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </AccordionContent>
                                    </Card>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </TabsContent>

                    {/* License Tab */}
                    <TabsContent value="licence" className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <CreditCard className="h-5 w-5" />
                                    <span>Licence et Paiements</span>
                                </CardTitle>
                                <CardDescription>
                                    Informations sur les abonnements, paiements et support
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Accordion type="single" collapsible className="space-y-4">
                            {licenseInfo.map((section) => (
                                <AccordionItem key={section.id} value={section.id}>
                                    <Card>
                                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    {section.id === 'abonnements' && <Badge className="h-4 w-4 text-primary" />}
                                                    {section.id === 'paiements' && <CreditCard className="h-4 w-4 text-primary" />}
                                                    {section.id === 'support' && <Shield className="h-4 w-4 text-primary" />}
                                                </div>
                                                <span className="font-semibold text-left">{section.title}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <CardContent className="pt-0">
                                                <div className="space-y-6">
                                                    {section.content.map((item, index) => (
                                                        <div key={index} className="space-y-2">
                                                            <h4 className="font-medium text-primary">{item.subtitle}</h4>
                                                            <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </AccordionContent>
                                    </Card>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </TabsContent>

                    {/* FAQ Tab */}
                    <TabsContent value="faq" className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <HelpCircle className="h-5 w-5" />
                                    <span>Questions fréquentes</span>
                                </CardTitle>
                                <CardDescription>
                                    Réponses aux questions les plus courantes sur Quality Assurance
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Accordion type="single" collapsible className="space-y-4">
                            {faq.map((item, index) => (
                                <AccordionItem key={index} value={`faq-${index}`}>
                                    <Card>
                                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                                            <span className="font-semibold text-left">{item.question}</span>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <CardContent className="pt-0">
                                                <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                                            </CardContent>
                                        </AccordionContent>
                                    </Card>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </TabsContent>
                </Tabs>

                {/* Help Section */}
                <Card className="bg-muted/50">
                    <CardContent className="p-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                            <HelpCircle className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Besoin d'aide supplémentaire ?</h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Notre équipe support est là pour vous accompagner. Contactez-nous pour
                                une assistance personnalisée ou une formation sur mesure.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button >
                                Contacter le support
                            </Button>
                            <Button variant="outline">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Centre d'aide en ligne
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
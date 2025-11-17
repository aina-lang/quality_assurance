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
                title: 'Download',
                content: 'Download the QAPro-Setup.exe installer from the download page.',
                code: null
            },
            {
                step: 2,
                title: 'Run as administrator',
                content: 'Right-click the downloaded file and choose "Run as administrator."',
                code: null
            },
            {
                step: 3,
                title: 'Setup wizard',
                content: 'Follow the installer wizard, accept the terms, and choose the install directory.',
                code: null
            },
            {
                step: 4,
                title: 'Initial configuration',
                content: 'On first launch, configure your account and preferences.',
                code: null
            }
        ],
        macos: [
            {
                step: 1,
                title: 'Download',
                content: 'Download the QAPro.dmg file from the download page.',
                code: null
            },
            {
                step: 2,
                title: 'Mount the disk image',
                content: 'Double-click the .dmg file to mount the disk image.',
                code: null
            },
            {
                step: 3,
                title: 'Install',
                content: 'Drag the Quality Assurance app into the Applications folder.',
                code: null
            },
            {
                step: 4,
                title: 'Security approval',
                content: 'If macOS blocks the app, open System Settings > Security & Privacy to allow it.',
                code: null
            }
        ],
        linux: [
            {
                step: 1,
                title: 'Download',
                content: 'Download the proper package (.deb for Ubuntu/Debian, .rpm for Fedora/CentOS).',
                code: null
            },
            {
                step: 2,
                title: 'Install via package manager (Ubuntu/Debian)',
                content: 'Run the following commands:',
                code: 'sudo dpkg -i qapro_2.0.1_amd64.deb\nsudo apt-get install -f'
            },
            {
                step: 3,
                title: 'Install on Fedora/CentOS',
                content: 'Use the RPM installer:',
                code: 'sudo rpm -i qapro-2.0.1.x86_64.rpm'
            },
            {
                step: 4,
                title: 'Launch',
                content: 'Start the application from the Applications menu or via terminal:',
                code: 'qapro'
            }
        ]
    };

    const userGuide = [
        {
            id: 'connexion',
            title: 'Sign-in and authentication',
            content: [
                {
                    subtitle: 'First login',
                    text: 'Use the credentials provided at signup. You will be prompted to change your password on first login.'
                },
                {
                    subtitle: 'Forgot password',
                    text: 'Click the “Forgot password” link on the login page to receive a reset email.'
                },
                {
                    subtitle: 'Two-factor authentication',
                    text: 'Enable two-factor authentication in your account settings for additional security.'
                }
            ]
        },
        {
            id: 'domaines',
            title: 'Domain management',
            content: [
                {
                    subtitle: 'Create a domain',
                    text: 'Click “New domain” on the main dashboard, provide a descriptive name, and set access permissions.'
                },
                {
                    subtitle: 'Plan limits',
                    text: 'Available domains depend on your plan: Free (10), Premium (15), Platinum (20), VIP (unlimited).'
                },
                {
                    subtitle: 'Assign owners',
                    text: 'Each domain can have one or more owners responsible for access and content.'
                }
            ]
        },
        {
            id: 'templates',
            title: 'Creating and editing templates',
            content: [
                {
                    subtitle: 'Visual editor',
                    text: 'The drag-and-drop editor feels like Canva—drag components from the library onto your canvas.'
                },
                {
                    subtitle: 'Component library',
                    text: 'Use the extensive library of prebuilt elements: text, images, charts, tables, and more.'
                },
                {
                    subtitle: 'Auto-save',
                    text: 'Changes auto-save every 30 seconds. You can also save manually with Ctrl+S / Cmd+S.'
                },
                {
                    subtitle: 'Versioning',
                    text: 'Every change creates a new version so you can roll back at any time.'
                }
            ]
        },
        {
            id: 'fichiers',
            title: 'File upload & management',
            content: [
                {
                    subtitle: 'Supported formats',
                    text: 'Quality Assurance supports PDF, DOC/DOCX, images (JPG, PNG, SVG), video (MP4, AVI), and audio (MP3, WAV).'
                },
                {
                    subtitle: 'Maximum size',
                    text: 'Per-file limits: Free (10MB), Premium (50MB), Platinum (100MB), VIP (unlimited).'
                },
                {
                    subtitle: 'Organization',
                    text: 'Organize files into folders/subfolders and tag them to simplify search.'
                },
                {
                    subtitle: 'Sharing',
                    text: 'Share files with granular permissions: read-only, edit, or full admin rights.'
                }
            ]
        },
        {
            id: 'roles',
            title: 'Roles & permissions',
            content: [
                {
                    subtitle: 'Client role',
                    text: 'Clients have full access to their domain: create, edit, delete content, and manage users.'
                },
                {
                    subtitle: 'Participant role',
                    text: 'Participants get read-only or limited access based on the permissions granted by the Client.'
                },
                {
                    subtitle: 'Invitations',
                    text: 'Invite users by email and define their role plus specific permissions.'
                },
                {
                    subtitle: 'Access management',
                    text: 'Update permissions anytime from the user management panel.'
                }
            ]
        }
    ];

    const licenseInfo = [
        {
            id: 'abonnements',
            title: 'Subscription types',
            content: [
                {
                    subtitle: 'Free',
                    text: 'Limited access with 10 domains, 1 user, 1GB storage. Perfect for discovering Quality Assurance.'
                },
                {
                    subtitle: 'Premium',
                    text: '50,000 Ar / year – 15 domains, 5 users, 10GB storage, priority email support.'
                },
                {
                    subtitle: 'Platinum',
                    text: '100,000 Ar / year – 20 domains, 15 users, 50GB storage, phone support.'
                },
                {
                    subtitle: 'VIP',
                    text: '200,000 Ar / year – Unlimited domains, unlimited users, unlimited storage, 24/7 support.'
                }
            ]
        },
        {
            id: 'paiements',
            title: 'Payment management',
            content: [
                {
                    subtitle: 'Annual billing',
                    text: 'All plans are billed annually with automatic renewal unless cancelled.'
                },
                {
                    subtitle: 'Payment methods',
                    text: 'We accept PayPal, credit cards, wire transfers, Mobile Money, Orange Money, and MVola.'
                },
                {
                    subtitle: 'Renewal countdown',
                    text: 'Your dashboard displays the time remaining before renewal.'
                },
                {
                    subtitle: 'Cancellation',
                    text: 'Cancel anytime; access remains active until the end of the paid period.'
                }
            ]
        },
        {
            id: 'support',
            title: 'Support & assistance',
            content: [
                {
                    subtitle: 'Support levels',
                    text: 'Support tiers follow your plan: community (Free), email (Premium), phone (Platinum), 24/7 (VIP).'
                },
                {
                    subtitle: 'Documentation',
                    text: 'This full documentation is available to every user regardless of plan.'
                },
                {
                    subtitle: 'Training',
                    text: 'Platinum and VIP plans include personalized training sessions.'
                },
                {
                    subtitle: 'SLA',
                    text: 'VIP subscriptions include an SLA with a guaranteed 2-hour maximum response time.'
                }
            ]
        }
    ];

    const faq = [
        {
            question: 'How do I migrate data from another system?',
            answer: 'Quality Assurance provides import tools for common formats (CSV, Excel, PDF). Contact support for assisted migration.'
        },
        {
            question: 'Can I use Quality Assurance offline?',
            answer: 'An internet connection is required for sync, but you can view recently opened documents offline.'
        },
        {
            question: 'How are my backups handled?',
            answer: 'Your data is automatically backed up in the cloud, and you can export domains locally from settings.'
        },
        {
            question: 'What is your privacy policy?',
            answer: 'Data is encrypted, stored in the EU, GDPR-compliant, and never shared with third parties.'
        },
        {
            question: 'How can I contact technical support?',
            answer: 'Use the in-app chat, email support@qapro.com, or call the hotline available with your plan.'
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
                            <span className="text-primary">Quality Assurance</span> Documentation
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            The complete guide for installing, using, and managing your Quality Assurance Pro workspace. Find answers in seconds.
                        </p>

                        {/* Search */}
                        <div className="max-w-md mx-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search the documentation..."
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
                        <TabsTrigger value="guide">User guide</TabsTrigger>
                        <TabsTrigger value="licence">License & Billing</TabsTrigger>
                        <TabsTrigger value="faq">FAQ</TabsTrigger>
                    </TabsList>

                    {/* Installation Tab */}
                    <TabsContent value="installation" className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Download className="h-5 w-5" />
                                    <span>Installing Quality Assurance</span>
                                </CardTitle>
                                <CardDescription>
                                    Step-by-step instructions for Windows, macOS, and Linux
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
                                    <span>User guide</span>
                                </CardTitle>
                                <CardDescription>
                                    Learn how to use every feature inside Quality Assurance
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
                                    <span>License & billing</span>
                                </CardTitle>
                                <CardDescription>
                                    Plan details, payment options, and support coverage
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
                                    <span>Frequently asked questions</span>
                                </CardTitle>
                                <CardDescription>
                                    Answers to the questions we hear most often
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
                            <h3 className="text-2xl font-bold mb-2">Need extra help?</h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Our support team is here for you. Reach out for personalized assistance or tailored training sessions.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button >
                                Contact support
                            </Button>
                            <Button variant="outline">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Help center
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
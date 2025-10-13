"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Moon, Sun, Menu, X, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/ui/button/Button';
import Link from 'next/link';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { usePathname } from 'next/navigation';
import Providers from '@/components/providers';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [isDark, setIsDark] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [contactForm, setContactForm] = useState({
        nom: '',
        email: '',
        message: ''
    });

    const pathname = usePathname();

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    const navigation = [
        { name: 'Accueil', href: '/' },
        { name: 'Offres', href: '/offres' },
        { name: 'Téléchargement', href: '/download' },
        { name: 'Inscription', href: '/subscription' },
        { name: 'Démo', href: '/demo' },
        { name: 'Documentation', href: '/documentation' }
    ];

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!contactForm.nom || !contactForm.email || !contactForm.message) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            toast.success('Message envoyé avec succès !');
            setContactForm({ nom: '', email: '', message: '' });
        }, 1000);
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">QA</span>
                            </div>
                            <span className="font-bold text-xl text-brand-500"></span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-sm font-medium transition-colors hover:text-brand-500 ${pathname === item.href
                                        ? 'text-brand-500'
                                        : 'text-muted-foreground'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Theme Toggle & Mobile Menu */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className="w-9 h-9"
                            >
                                {isDark ? (
                                    <Sun className="h-4 w-4" />
                                ) : (
                                    <Moon className="h-4 w-4" />
                                )}
                            </button>

                            {/* Mobile Menu Button */}
                            <Button

                                className="md:hidden bg-brand-500 text-white hover:bg-brand-600 w-9 h-9"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-4 w-4" />
                                ) : (
                                    <Menu className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`block px-3 py-2 text-base font-medium transition-colors hover:text-brand-500 ${pathname === item.href
                                            ? 'text-brand-500'
                                            : 'text-muted-foreground'
                                            }`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Providers>{children}</Providers>

            </main>

            {/* Footer */}
            <footer className="bg-muted/50 border-t">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Link href="/" className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">QA</span>
                                    </div>
                                    <span className="font-bold text-xl text-brand-500"></span>
                                </Link>

                                <span className="font-bold text-xl">Quality Assurance</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Logiciel de gestion de qualité pour entreprises. Compatible Windows, macOS et Linux.
                            </p>
                            <div className="flex space-x-4">
                                <button className="w-8 h-8">
                                    <Facebook className="h-4 w-4" />
                                </button>
                                <button className="w-8 h-8">
                                    <Twitter className="h-4 w-4" />
                                </button>
                                <button className="w-8 h-8">
                                    <Linkedin className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Liens rapides</h3>
                            <ul className="space-y-2">
                                {navigation.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-muted-foreground hover:text-brand-500 transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Contact</h3>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span>contact@qapro.com</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Phone className="h-4 w-4" />
                                    <span>+33 1 23 45 67 89</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>Paris, France</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="space-y-4">
                            <h3 className="font-semibold">Nous contacter</h3>
                            <Card>
                                <CardContent className="p-4">
                                    <form onSubmit={handleContactSubmit} className="space-y-3">
                                        <Input
                                            placeholder="Votre nom"
                                            //   value={contactForm.nom}
                                            onChange={(e) => setContactForm({ ...contactForm, nom: e.target.value })}
                                        />
                                        <Input
                                            type="email"
                                            placeholder="Votre email"

                                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                        />
                                        <TextArea
                                            placeholder="Votre message"
                                            rows={3}
                                            value={contactForm.message}
                                        //   onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                        />
                                        <Button className="w-full">
                                            Envoyer
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="mt-8 pt-8 border-t text-center">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Quality Assurance Pro. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
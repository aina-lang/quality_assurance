"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Download,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle,
  FileText,
  Shield,
  Zap,
  HardDrive,
  Cpu,
  MemoryStick,
  User,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

export default function Telechargement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userPlan, setUserPlan] = useState('premium'); // Simulate user plan

  // Simulate authentication check
  const handleAuthCheck = () => {
    // In real app, check actual auth status
    setIsAuthenticated(true);
    toast.success('Accès autorisé ! Vous pouvez maintenant télécharger.');
  };

  const handleDownload = (platform: string) => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour télécharger');
      return;
    }

    toast.success(`Téléchargement de Quality Assurance pour ${platform} commencé !`);
    // In real app, trigger actual download
  };

  const platforms = [
    {
      name: 'Windows',
      icon: <Monitor className="h-12 w-12" />,
      version: '2.0.1',
      size: '156 MB',
      compatibility: 'Windows 10/11 (64-bit)',
      requirements: {
        os: 'Windows 10 version 1903 ou plus récent',
        processor: 'Intel Core i3 ou AMD équivalent',
        memory: '4 GB RAM minimum, 8 GB recommandé',
        storage: '500 MB d\'espace libre',
        graphics: 'DirectX 11 compatible'
      },
      downloadUrl: '#windows-download',
      popular: true
    },
    {
      name: 'macOS',
      icon: <Smartphone className="h-12 w-12" />,
      version: '2.0.1',
      size: '142 MB',
      compatibility: 'macOS 12.0+ (Intel & Apple Silicon)',
      requirements: {
        os: 'macOS Monterey 12.0 ou plus récent',
        processor: 'Intel Core i5 ou Apple M1/M2',
        memory: '4 GB RAM minimum, 8 GB recommandé',
        storage: '500 MB d\'espace libre',
        graphics: 'Metal compatible'
      },
      downloadUrl: '#macos-download',
      popular: false
    },
    {
      name: 'Linux',
      icon: <Tablet className="h-12 w-12" />,
      version: '2.0.1',
      size: '134 MB',
      compatibility: 'Ubuntu 20.04+, Debian 11+, Fedora 35+',
      requirements: {
        os: 'Ubuntu 20.04, Debian 11, Fedora 35 ou distributions compatibles',
        processor: 'x86_64 architecture',
        memory: '4 GB RAM minimum, 8 GB recommandé',
        storage: '500 MB d\'espace libre',
        graphics: 'OpenGL 3.3 compatible'
      },
      downloadUrl: '#linux-download',
      popular: false
    }
  ];

  const releaseNotes = [
    {
      version: '2.0.1',
      date: '15 Décembre 2024',
      type: 'Mise à jour',
      changes: [
        'Amélioration des performances de synchronisation',
        'Correction de bugs mineurs dans l\'éditeur de templates',
        'Nouvelle interface pour la gestion des domaines',
        'Support amélioré pour les fichiers volumineux'
      ]
    },
    {
      version: '2.0.0',
      date: '1 Décembre 2024',
      type: 'Version majeure',
      changes: [
        'Nouvelle interface utilisateur moderne',
        'Éditeur de templates repensé (style Canva)',
        'Collaboration en temps réel',
        'Système de notifications avancé',
        'API REST complète',
        'Mode sombre natif'
      ]
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-wider">
              <span className="text-brand-500"> Télécharger </span>
              <br />
              <span className="text-muted-foreground">Quality Assurance</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Installez Quality Assurance Pro sur votre plateforme préférée.
              Compatible Windows, macOS et Linux avec la même expérience utilisateur.
            </p>

            {/* {!isAuthenticated && (
              <Alert className="max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Vous devez être connecté pour télécharger Quality Assurance.{' '}
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-medium"
                    onClick={handleAuthCheck}
                  >
                    Se connecter maintenant
                  </Button>
                </AlertDescription>
              </Alert>
            )} */}
          </div>
        </div>
      </section>

      {/* Download Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <Card
              key={index}
              className={`relative h-full ${platform.popular
                  ? 'border-primary shadow-lg'
                  : 'hover:shadow-md transition-shadow'
                }`}
            >
              {platform.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="px-3 py-1">
                    Le plus populaire
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary">
                  {platform.icon}
                </div>
                <CardTitle className="text-2xl">{platform.name}</CardTitle>
                <CardDescription className="text-base">
                  {platform.compatibility}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Version :</span>
                    <Badge variant="secondary">{platform.version}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Taille :</span>
                    <span className="text-sm">{platform.size}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Configuration requise :</h4>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Cpu className="h-3 w-3" />
                      <span>{platform.requirements.processor}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MemoryStick className="h-3 w-3" />
                      <span>{platform.requirements.memory}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HardDrive className="h-3 w-3" />
                      <span>{platform.requirements.storage}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => handleDownload(platform.name)}
                // disabled={!isAuthenticated}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger pour {platform.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Installation Instructions */}
      <section className="bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Instructions d'installation</h2>
            <p className="text-lg text-muted-foreground">
              Suivez ces étapes simples pour installer Quality Assurance sur votre système
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5" />
                  <span>Windows</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Téléchargez le fichier .exe</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Exécutez le fichier en tant qu'administrateur</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Suivez l'assistant d'installation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <span>Lancez Quality Assurance depuis le menu Démarrer</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>macOS</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Téléchargez le fichier .dmg</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Ouvrez le fichier .dmg</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Glissez Quality Assurance vers Applications</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <span>Lancez depuis le Launchpad</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tablet className="h-5 w-5" />
                  <span>Linux</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                    <span>Téléchargez le package .deb/.rpm</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                    <span>Installez via le gestionnaire de paquets</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                    <span>Ou utilisez: sudo dpkg -i qapro.deb</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                    <span>Lancez depuis le menu Applications</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Release Notes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Notes de version</h2>
          <p className="text-lg text-muted-foreground">
            Découvrez les dernières améliorations et corrections
          </p>
        </div>

        <div className="space-y-6">
          {releaseNotes.map((release, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Version {release.version}</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant={release.type === 'Version majeure' ? 'default' : 'secondary'}>
                      {release.type}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{release.date}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {release.changes.map((change, changeIndex) => (
                    <li key={changeIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{change}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Security & Support */}
      <section className="bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Sécurité et vérification</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Tous les téléchargements sont signés numériquement</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Vérification automatique de l'intégrité des fichiers</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Aucun logiciel malveillant ou publicitaire</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Mises à jour automatiques sécurisées</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Support et assistance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Besoin d'aide pour l'installation ou l'utilisation ?
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href="/documentation">
                      <FileText className="mr-2 h-4 w-4" />
                      Guide d'installation
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    Contacter le support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl font-bold">
                Pas encore de compte ?
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Créez votre compte gratuit  et commencer
                à optimiser votre gestion qualité dès aujourd'hui.
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="subscription">
                  <Lock className="mr-2 h-5 w-5" />
                  Créer un compte gratuit
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
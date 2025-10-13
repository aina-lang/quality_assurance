"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  FileText,
  Users,
  Settings,
  Share2,
  Download,
  Eye,
  BarChart3,
  Layers,
  Palette,
  MousePointer,
} from 'lucide-react';
import Link from 'next/link';

export default function Demo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFeature, setCurrentFeature] = useState('master-menu');

  const features = [
    {
      id: 'master-menu',
      title: 'Master Menu - Gestion Corporate',
      description: 'Interface principale pour la gestion des formations et manuels d\'entreprise',
      screenshot: '/api/placeholder/800/500',
      highlights: [
        'Corp Mgmt Training - Gestion des formations corporate',
        'OSM (Operational Standards Manual) - Manuels standards',
        'Navigation intuitive par domaines',
        'Tableau de bord exécutif'
      ]
    },
    {
      id: 'domain-creation',
      title: 'Création et Gestion de Domaines',
      description: 'Organisez votre travail par domaines métier selon votre abonnement',
      screenshot: '/api/placeholder/800/500',
      highlights: [
        'Création rapide de nouveaux domaines',
        'Limitation selon l\'abonnement (10-20+ domaines)',
        'Attribution de responsables par domaine',
        'Paramètres de confidentialité avancés'
      ]
    },
    {
      id: 'template-editor',
      title: 'Éditeur de Templates (Style Canva)',
      description: 'Créez et modifiez vos templates avec une interface moderne et intuitive',
      screenshot: '/api/placeholder/800/500',
      highlights: [
        'Interface drag & drop similaire à Canva',
        'Bibliothèque de composants prédéfinis',
        'Personnalisation complète des designs',
        'Prévisualisation en temps réel'
      ]
    },
    {
      id: 'file-management',
      title: 'Gestion de Fichiers et Médias',
      description: 'Ajoutez et organisez tous vos fichiers de formation et documentation',
      screenshot: '/api/placeholder/800/500',
      highlights: [
        'Support multi-formats (PDF, images, vidéos)',
        'Stockage cloud sécurisé',
        'Versioning automatique',
        'Partage contrôlé avec permissions'
      ]
    },
    {
      id: 'collaboration',
      title: 'Collaboration et Rôles',
      description: 'Gérez les accès et collaborez efficacement avec votre équipe',
      screenshot: '/api/placeholder/800/500',
      highlights: [
        'Rôles Client et Participant',
        'Invitations par email',
        'Permissions granulaires',
        'Suivi des activités en temps réel'
      ]
    }
  ];

  const videoDemo = {
    title: 'Démonstration complète de Quality Assurance',
    duration: '8:32',
    thumbnail: '/api/placeholder/800/450',
    description: 'Découvrez toutes les fonctionnalités de Quality Assurance en action avec cette démonstration complète.'
  };

  const useCases = [
    {
      title: 'Formation Corporate',
      description: 'Créez des programmes de formation standardisés pour vos équipes',
      icon: <Users className="h-6 w-6" />,
      benefits: [
        'Templates de formation prêts à l\'emploi',
        'Suivi des progrès individuels',
        'Certification automatique',
        'Rapports de performance'
      ]
    },
    {
      title: 'Manuels Opérationnels',
      description: 'Développez et maintenez vos manuels de procédures',
      icon: <FileText className="h-6 w-6" />,
      benefits: [
        'Versioning automatique des documents',
        'Validation par les experts métier',
        'Distribution contrôlée',
        'Mise à jour en temps réel'
      ]
    },
    {
      title: 'Gestion Qualité',
      description: 'Optimisez vos processus qualité avec des outils dédiés',
      icon: <BarChart3 className="h-6 w-6" />,
      benefits: [
        'Tableaux de bord qualité',
        'Indicateurs de performance',
        'Audits automatisés',
        'Plans d\'amélioration continue'
      ]
    }
  ];

  const toggleVideo = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              Démonstration interactive
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Découvrez <span className="text-primary">Quality Assurance</span> en action
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explorez toutes les fonctionnalités de notre solution de gestion qualité 
              à travers des démonstrations interactives et des captures d'écran détaillées.
            </p>
          </div>
        </div>
      </section>

      {/* Video Demo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-muted">
              {/* Video Placeholder */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${videoDemo.thumbnail})` }}
              >
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="w-20 h-20 rounded-full"
                    onClick={toggleVideo}
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/80 rounded-lg p-3 flex items-center justify-between text-white">
                  <div className="flex items-center space-x-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={toggleVideo}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <span className="text-sm">{videoDemo.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle>{videoDemo.title}</CardTitle>
            <CardDescription>{videoDemo.description}</CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Interactive Features Demo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Fonctionnalités en détail</h2>
          <p className="text-lg text-muted-foreground">
            Explorez chaque aspect de Quality Assurance avec nos captures d'écran interactives
          </p>
        </div>

        <Tabs value={currentFeature} onValueChange={setCurrentFeature} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            {features.map((feature) => (
              <TabsTrigger 
                key={feature.id} 
                value={feature.id}
                className="text-xs lg:text-sm"
              >
                {feature.title.split(' - ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg">{feature.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold">Points clés :</h4>
                    <ul className="space-y-2">
                      {feature.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button asChild>
                      <Link href="subscription">
                        <MousePointer className="mr-2 h-4 w-4" />
                        Essayer maintenant
                      </Link>
                    </Button>
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Vue détaillée
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-muted flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto">
                            <Layers className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Capture d'écran interactive</h4>
                            <p className="text-sm text-muted-foreground">
                              {feature.title}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Feature badges */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <Badge className="bg-primary/90">Nouveau</Badge>
                    {feature.id === 'template-editor' && (
                      <Badge variant="secondary">Style Canva</Badge>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Use Cases */}
      <section className="bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Cas d'usage concrets</h2>
            <p className="text-lg text-muted-foreground">
              Découvrez comment Quality Assurance s'adapte à vos besoins métier
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {useCase.icon}
                  </div>
                  <CardTitle>{useCase.title}</CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interface Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Interface moderne et intuitive</h2>
          <p className="text-lg text-muted-foreground">
            Une expérience utilisateur pensée pour la productivité
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Design moderne</h3>
              <p className="text-sm text-muted-foreground">
                Interface épurée et professionnelle
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MousePointer className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Drag & Drop</h3>
              <p className="text-sm text-muted-foreground">
                Manipulation intuitive des éléments
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Collaboration</h3>
              <p className="text-sm text-muted-foreground">
                Travail en équipe en temps réel
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Personnalisation</h3>
              <p className="text-sm text-muted-foreground">
                Adaptable à vos processus
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">
              Convaincu par la démonstration ?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Commencez dès maintenant avec notre version gratuite ou planifiez 
              une démonstration personnalisée avec notre équipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="subscription">
                  <Download className="mr-2 h-5 w-5" />
                  Commencer gratuitement
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="/contact">
                  <Users className="mr-2 h-5 w-5" />
                  Démo personnalisée
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
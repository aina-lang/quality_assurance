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
      title: 'Master Menu – Corporate Management',
      description: 'Primary interface for managing corporate training programs and manuals',
      screenshot: '/api/placeholder/800/500',
      highlights: [
        'Corp Mgmt Training – corporate training management',
        'OSM (Operational Standards Manual) – standard manuals',
        'Intuitive navigation by domain',
        'Executive dashboard view'
      ]
    },
    {
      id: 'domain-creation',
      title: 'Domain Creation & Management',
      description: 'Organize your work by business domain based on your subscription',
      screenshot: '/api/placeholder/800/500',
      highlights: [
        'Create new domains in seconds',
        'Limits that match your plan (10-20+ domains)',
        'Assign owners to each domain',
        'Advanced privacy and sharing settings'
      ]
    },
    {
      id: 'template-editor',
      title: 'Template Editor (Canva-style)',
      description: 'Design templates with a modern, intuitive editor',
      screenshot: '/api/placeholder/800/500',
      highlights: [
        'Canva-like drag & drop interface',
        'Library of ready-to-use components',
        'Full design customization',
        'Live preview while editing'
      ]
    },
    {
      id: 'file-management',
      title: 'File & Media Management',
      description: 'Add and organize all training and documentation assets',
      screenshot: '/api/placeholder/800/500',
      highlights: [
        'Multi-format support (PDF, images, video)',
        'Secure cloud storage',
        'Automatic versioning',
        'Permission-based sharing'
      ]
    },
    {
      id: 'collaboration',
      title: 'Collaboration & Roles',
      description: 'Control access and collaborate seamlessly with your team',
      screenshot: '/api/placeholder/800/500',
      highlights: [
        'Client and Participant roles',
        'Email invitations',
        'Granular permissions',
        'Real-time activity tracking'
      ]
    }
  ];

  const videoDemo = {
    title: 'Quality Assurance full walkthrough',
    duration: '8:32',
    thumbnail: '/api/placeholder/800/450',
    description: 'See every feature of Quality Assurance in action with this guided walkthrough.'
  };

  const useCases = [
    {
      title: 'Corporate Training',
      description: 'Create standardized training programs for every team',
      icon: <Users className="h-6 w-6" />,
      benefits: [
        'Ready-to-use training templates',
        'Individual progress tracking',
        'Automatic certification',
        'Performance reporting'
      ]
    },
    {
      title: 'Operational Manuals',
      description: 'Develop and maintain every procedure manual',
      icon: <FileText className="h-6 w-6" />,
      benefits: [
        'Automatic document versioning',
        'Business expert validation',
        'Controlled distribution',
        'Real-time updates'
      ]
    },
    {
      title: 'Quality Management',
      description: 'Optimize QA processes with dedicated tooling',
      icon: <BarChart3 className="h-6 w-6" />,
      benefits: [
        'Quality dashboards',
        'Key performance indicators',
        'Automated audits',
        'Continuous improvement plans'
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
              Interactive demo
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Experience <span className="text-primary">Quality Assurance</span> in action
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore every capability of our quality platform through interactive demos and detailed screenshots.
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
          <h2 className="text-3xl font-bold">Features in detail</h2>
          <p className="text-lg text-muted-foreground">
            Dive into each area of Quality Assurance with interactive screenshots.
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
                    <h4 className="font-semibold">Key takeaways:</h4>
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
                        Try it now
                      </Link>
                    </Button>
                    <Button variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      Detailed view
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
                            <h4 className="font-semibold">Interactive screenshot</h4>
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
                    <Badge className="bg-primary/90">New</Badge>
                    {feature.id === 'template-editor' && (
                      <Badge variant="secondary">Canva-style</Badge>
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
            <h2 className="text-3xl font-bold">Real-world use cases</h2>
            <p className="text-lg text-muted-foreground">
              See how Quality Assurance adapts to every business workflow.
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
          <h2 className="text-3xl font-bold">Modern, intuitive interface</h2>
          <p className="text-lg text-muted-foreground">
            A user experience engineered for productivity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Modern design</h3>
              <p className="text-sm text-muted-foreground">
                Clean, professional interface
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MousePointer className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Drag & drop</h3>
              <p className="text-sm text-muted-foreground">
                Intuitive element handling
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
                Real-time teamwork
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Customization</h3>
              <p className="text-sm text-muted-foreground">
                Adaptable to your processes
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
              Impressed by the demo?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Start with the free version or schedule a personalized walkthrough with our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="subscription">
                  <Download className="mr-2 h-5 w-5" />
                  Get started for free
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="/contact">
                  <Users className="mr-2 h-5 w-5" />
                  Personalized demo
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
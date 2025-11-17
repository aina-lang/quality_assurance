import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Users,
  FileText,
  Settings,
  Download,
  Shield,
  Zap,
  Globe,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Home() {
  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Template Management",
      description: "Create and manage templates for training programs and standard manuals with ease."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Participant Invitations",
      description: "Invite and manage training participants in just a few clicks."
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: "Domain Management",
      description: "Organize work by domain according to your plan (10 to 20+ domains)."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Advanced Security",
      description: "Enterprise-grade protection keeps all of your quality data secure."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "High Performance",
      description: "Lightning-fast interface to keep teams productive."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multi-platform",
      description: "Works on Windows, macOS, and Linux so every team can plug in."
    }
  ];

  const benefits = [
    "Reduce document creation time by 70%",
    "Improve training consistency across the company",
    "Centralize manuals, procedures, and templates",
    "Collaborate with your team in real time",
    "Track progress and performance in detail",
    "Intuitive, Canva-like design experience"
  ];

  const platforms = [
    { name: "Windows", icon: <Monitor className="h-8 w-8" />, version: "10/11" },
    { name: "macOS", icon: <Smartphone className="h-8 w-8" />, version: "12+" },
    { name: "Linux", icon: <Tablet className="h-8 w-8" />, version: "Ubuntu 20+" }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-500/20 via-background to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="mb-4">
              New: Version 2.0 available
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-wider">
              <span className="text-brand-500">Quality Assurance </span>
              <br />
              <span className="text-muted-foreground">for Enterprises</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Quality management software for enterprises with templates for training programs,
              standard manuals, and more. Compatible with Windows, macOS, and Linux.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="text-lg px-8 py-6">
                <Link href="subscription">
                  Get started for free
                </Link>
              </Button>
              <Button variant="outline" className="text-lg px-8 py-6">
                <Link href="/demo">
                  Watch the demo
                </Link>
              </Button>
            </div>

            <div className="flex justify-center items-center space-x-8 pt-8">
              {platforms.map((platform) => (
                <div key={platform.name} className="flex flex-col items-center space-y-2">
                  <div className="text-muted-foreground">
                    {platform.icon}
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{platform.name}</div>
                    <div className="text-xs text-muted-foreground">{platform.version}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Key Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the powerful tools that transform your quality operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-brand/10 rounded-lg flex items-center justify-center text-brand-500 mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Why choose Quality Assurance?
              </h2>
              <p className="text-lg text-muted-foreground">
                Our platform reshapes how teams manage quality processes and training programs.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-brand-500 flex-shrink-0 mt-0.5" />
                    <span className="text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <Card className="p-8 bg-gradient-to-br from-brand/5 to-secondary/5">
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">Intuitive Interface</h3>
                    <p className="text-muted-foreground">
                      A Canva-like experience that makes designing templates and training documents simple.
                    </p>
                  </div>

                  <div className="bg-background rounded-lg p-6 shadow-sm">
                    <Image
                      src="/images/home.png"
                      alt="404"
                      className="dark:hidden"
                      width={472}
                      height={152}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Card className="bg-gradient-to-r from-brand-200 to-brand-500/80 text-white">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to transform your quality management?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join the teams that trust Quality Assurance to streamline their processes and training.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="text-lg px-8 py-6 ">
                <Link href="/subscription" className='flex items-center'>
                  <Download className="mr-2 h-5 w-5" />
                  Get started for free
                </Link>
              </Button>
              <Button variant="outline" className="text-lg px-8 py-6 border-brand-foreground text-brand-500 hover:bg-brand-foreground hover:text-brand-500">
                <Link href="/offres">
                  View pricing
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
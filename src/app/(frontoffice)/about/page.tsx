'use client';;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, Users, Target, TrendingUp, Heart, Lightbulb, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  const teamMembers = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Former QA Director at Google with 15+ years in software testing'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Ex-Microsoft engineer specializing in test automation and AI'
    },
    {
      name: 'Emily Watson',
      role: 'Head of Product',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Product strategist with expertise in enterprise software solutions'
    },
    {
      name: 'David Kim',
      role: 'Lead Engineer',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Full-stack developer focused on scalable testing infrastructure'
    }
  ];

  const milestones = [
    { year: '2019', title: 'Company Founded', description: 'Started with a vision to revolutionize QA testing' },
    { year: '2020', title: 'First Product Launch', description: 'Released QualityPro v1.0 to early adopters' },
    { year: '2021', title: 'Series A Funding', description: 'Raised $15M to accelerate product development' },
    { year: '2022', title: 'Enterprise Expansion', description: 'Launched enterprise features and global infrastructure' },
    { year: '2023', title: 'AI Integration', description: 'Introduced AI-powered testing capabilities' },
    { year: '2024', title: 'Market Leadership', description: 'Became the #1 QA platform with 50K+ users' },
    { year: '2025', title: 'Global Expansion', description: 'Opening offices in Europe and Asia-Pacific' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
              <Shield className="h-8 w-8 text-brand-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
                QualityPro
              </span>
            </Link>
            <div className="text-sm text-slate-600">
              About Our Company
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-brand-100 text-brand-700">
            <Heart className="w-4 h-4 mr-2" />
            Our Story
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 mb-6">
            Building the Future of
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent block">
              Quality Assurance
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Founded in 2019, QualityPro has grown from a small startup to the leading quality assurance platform,
            trusted by over 50,000 developers and 500+ companies worldwide.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                <Target className="mr-3 h-6 w-6" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-lg text-slate-700 leading-relaxed">
                To democratize quality assurance by providing powerful, accessible testing tools that enable
                every development team to deliver exceptional software with confidence.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl flex items-center">
                <Lightbulb className="mr-3 h-6 w-6" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-lg text-slate-700 leading-relaxed">
                A world where software bugs are caught before they reach users, where quality is built into
                every line of code, and where testing is as natural as breathing for developers.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Quality First</h3>
              <p className="text-slate-600">
                We believe quality should never be compromised. Every feature we build undergoes rigorous testing.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Customer Success</h3>
              <p className="text-slate-600">
                Our customers' success is our success. We're committed to providing exceptional support and value.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Innovation</h3>
              <p className="text-slate-600">
                We continuously push the boundaries of what's possible in quality assurance technology.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Passionate experts dedicated to revolutionizing software quality assurance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">{member.name}</h3>
                  <p className="text-brand-600 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-slate-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <Card className="shadow-xl border-0 mb-16">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center">
              <TrendingUp className="mr-3 h-6 w-6" />
              Our Journey
            </CardTitle>
            <CardDescription className="text-purple-100 text-base">
              Key milestones in our company's growth
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-600 font-bold">{milestone.year}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{milestone.title}</h3>
                    <p className="text-slate-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="shadow-xl border-0 bg-gradient-to-r from-brand-600 to-indigo-600 text-white">
          <CardContent className="p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">QualityPro by the Numbers</h2>
              <p className="text-brand-100 text-lg">
                Our impact on the software development community
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">50K+</div>
                <div className="text-brand-100">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-brand-100">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">10M+</div>
                <div className="text-brand-100">Tests Executed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-brand-100">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
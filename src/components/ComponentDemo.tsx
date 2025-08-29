import React, { useState } from 'react';
import { StyleGuideDemo } from './StyleGuideDemo';
import { Carousel, CarouselItem } from './common/Carousel';
import { EnhancedCard } from './common/EnhancedCard';
import { Navbar, NavItem, UserMenuData } from './common/Navbar';
import { Footer, FooterSection, SocialLink } from './common/Footer';
import { Hero, HeroAction } from './common/Hero';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home, 
  Search, 
  Settings, 
  User, 
  Bell, 
  ShoppingBag,
  Star,
  Heart,
  Share2,
  Download,
  Play,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github
} from 'lucide-react';

export function ComponentDemo() {
  const [currentDemo, setCurrentDemo] = useState<'overview' | 'styleguide' | 'components'>('overview');

  // Sample data for components
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', href: '#', isActive: true },
    { id: 'products', label: 'Products', href: '#' },
    { 
      id: 'services', 
      label: 'Services', 
      children: [
        { id: 'design', label: 'Design', href: '#' },
        { id: 'development', label: 'Development', href: '#' },
        { id: 'consulting', label: 'Consulting', href: '#' }
      ]
    },
    { 
      id: 'about', 
      label: 'About', 
      badge: { label: 'New', variant: 'secondary' }
    }
  ];

  const userMenuData: UserMenuData = {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      role: 'Product Designer'
    },
    menuItems: [
      { id: 'profile', label: 'Profile', onClick: () => console.log('Profile') },
      { id: 'settings', label: 'Settings', onClick: () => console.log('Settings') },
      { id: 'billing', label: 'Billing', onClick: () => console.log('Billing') },
      { id: 'logout', label: 'Sign Out', onClick: () => console.log('Logout'), variant: 'destructive' }
    ]
  };

  const carouselItems: CarouselItem[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
      title: 'AI-Powered Design',
      description: 'Create stunning visuals with artificial intelligence'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop',
      title: 'Smart Automation',
      description: 'Automate your workflow with intelligent tools'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team'
    }
  ];

  const heroActions: HeroAction[] = [
    {
      id: 'cta',
      label: 'Get Started',
      onClick: () => console.log('Get Started'),
      variant: 'default',
      icon: ArrowRight,
      iconPosition: 'right'
    },
    {
      id: 'demo',
      label: 'Watch Demo',
      onClick: () => console.log('Watch Demo'),
      variant: 'outline',
      icon: Play
    }
  ];

  const footerSections: FooterSection[] = [
    {
      id: 'product',
      title: 'Product',
      links: [
        { id: 'features', label: 'Features', href: '#' },
        { id: 'pricing', label: 'Pricing', href: '#' },
        { id: 'api', label: 'API', href: '#' },
        { id: 'changelog', label: 'Changelog', href: '#' }
      ]
    },
    {
      id: 'company',
      title: 'Company',
      links: [
        { id: 'about', label: 'About Us', href: '#' },
        { id: 'careers', label: 'Careers', href: '#' },
        { id: 'press', label: 'Press', href: '#' },
        { id: 'contact', label: 'Contact', href: '#' }
      ]
    },
    {
      id: 'resources',
      title: 'Resources',
      links: [
        { id: 'blog', label: 'Blog', href: '#' },
        { id: 'documentation', label: 'Documentation', href: '#' },
        { id: 'help', label: 'Help Center', href: '#' },
        { id: 'community', label: 'Community', href: '#' }
      ]
    }
  ];

  const socialLinks: SocialLink[] = [
    { id: 'facebook', platform: 'Facebook', href: '#', icon: Facebook },
    { id: 'twitter', platform: 'Twitter', href: '#', icon: Twitter },
    { id: 'instagram', platform: 'Instagram', href: '#', icon: Instagram },
    { id: 'linkedin', platform: 'LinkedIn', href: '#', icon: Linkedin },
    { id: 'youtube', platform: 'YouTube', href: '#', icon: Youtube },
    { id: 'github', platform: 'GitHub', href: '#', icon: Github }
  ];

  const renderOverview = () => (
    <div className="space-y-16">
      {/* Navigation Demo */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Navbar Component</h2>
          <p className="text-muted-foreground">Responsive navigation with dropdowns, user menu, and search</p>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Navbar
            logo={{ text: 'NoModel AI', onClick: () => console.log('Logo clicked') }}
            navItems={navItems}
            showSearch
            searchPlaceholder="Search components..."
            onSearch={(query) => console.log('Search:', query)}
            notifications={{ count: 3, onClick: () => console.log('Notifications') }}
            userMenu={userMenuData}
            ctaButton={{ label: 'Get Started', onClick: () => console.log('CTA') }}
            variant="blur"
          />
        </div>
      </section>

      {/* Hero Demo */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Hero Component</h2>
          <p className="text-muted-foreground">Flexible hero sections with multiple layouts and variants</p>
        </div>
        <div className="space-y-8">
          {/* Default Hero */}
          <div className="border rounded-lg overflow-hidden">
            <Hero
              variant="centered"
              badge={{ label: "New Feature", variant: "secondary" }}
              title="Build Amazing Products with AI"
              subtitle="The future of design is here"
              description="Create stunning product images and marketing materials with our AI-powered platform. No design skills required."
              actions={heroActions}
              stats={[
                { value: "10K+", label: "Happy Users" },
                { value: "50K+", label: "Images Generated" },
                { value: "99.9%", label: "Uptime" }
              ]}
              backgroundGradient
            />
          </div>
          
          {/* Split Hero with Image */}
          <div className="border rounded-lg overflow-hidden">
            <Hero
              variant="split"
              eyebrow="Product Demo"
              title="See Our Platform in Action"
              description="Watch how easy it is to create professional product images in just a few clicks."
              actions={[
                {
                  id: 'demo',
                  label: 'Start Free Trial',
                  onClick: () => console.log('Trial'),
                  variant: 'default'
                }
              ]}
              image={{
                src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
                alt: 'Platform Demo',
                position: 'right'
              }}
            />
          </div>
        </div>
      </section>

      {/* Carousel Demo */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Carousel Component</h2>
          <p className="text-muted-foreground">Interactive carousel with auto-play and multiple layouts</p>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Standard Carousel</CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel
                items={carouselItems}
                autoPlay
                autoPlayInterval={4000}
                aspectRatio="video"
                variant="default"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Multi-slide Carousel</CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel
                items={[...carouselItems, ...carouselItems]}
                slidesToShow={2}
                aspectRatio="square"
                variant="card"
                gap={20}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Card Demo */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Enhanced Card Component</h2>
          <p className="text-muted-foreground">Versatile cards with multiple variants and features</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <EnhancedCard
            variant="default"
            image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
            imageAlt="AI Model"
            title="Premium AI Model"
            subtitle="Fashion & Beauty"
            description="High-quality AI model perfect for fashion and beauty product photography"
            badges={[{ label: "Popular", variant: "secondary" }]}
            rating={4.8}
            ratingCount={124}
            price="2,500"
            originalPrice="3,500"
            actions={[
              { 
                label: "Add to Cart", 
                onClick: () => console.log('Add to cart'),
                variant: "default"
              },
              { 
                label: "Preview", 
                onClick: () => console.log('Preview'),
                variant: "outline"
              }
            ]}
          />
          
          <EnhancedCard
            variant="featured"
            image="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop"
            imageAlt="Technology"
            title="Enterprise Solution"
            subtitle="Advanced AI Platform"
            description="Complete AI-powered solution for large-scale product image generation"
            badges={[
              { label: "Enterprise", variant: "destructive" },
              { label: "Best Value", variant: "default" }
            ]}
            rating={5.0}
            ratingCount={45}
            price="Custom"
            actions={[
              { 
                label: "Contact Sales", 
                onClick: () => console.log('Contact'),
                variant: "default"
              }
            ]}
          />
          
          <EnhancedCard
            variant="horizontal"
            image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
            imageAlt="Team"
            imagePlacement="left"
            title="Team Collaboration"
            description="Work together with your team to create amazing content"
            actions={[
              { 
                label: "Learn More", 
                onClick: () => console.log('Learn more'),
                variant: "outline",
                size: "sm"
              }
            ]}
          />
        </div>
      </section>

      {/* Footer Demo */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Footer Component</h2>
          <p className="text-muted-foreground">Comprehensive footer with multiple sections and newsletter</p>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Footer
            logo={{ text: 'NoModel AI' }}
            description="AI-powered platform for creating stunning product images and marketing materials without design skills."
            sections={footerSections}
            socialLinks={socialLinks}
            newsletter={{
              title: 'Stay Updated',
              description: 'Get the latest updates and features delivered to your inbox.',
              placeholder: 'Enter your email',
              buttonText: 'Subscribe',
              onSubmit: (email) => console.log('Newsletter:', email)
            }}
            bottomLinks={[
              { id: 'privacy', label: 'Privacy Policy', href: '#' },
              { id: 'terms', label: 'Terms of Service', href: '#' },
              { id: 'cookies', label: 'Cookie Settings', href: '#' }
            ]}
            copyright="© 2024 NoModel AI. All rights reserved."
          />
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Navigation */}
      <div 
        className="sticky top-0 z-50 border-b"
        style={{ 
          backgroundColor: 'var(--color-background-primary)',
          borderColor: 'var(--color-border-primary)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Component Demo</h1>
              <Badge variant="secondary">Design System</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={currentDemo === 'overview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentDemo('overview')}
              >
                Components
              </Button>
              <Button
                variant={currentDemo === 'styleguide' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentDemo('styleguide')}
              >
                Style Guide
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentDemo === 'overview' && renderOverview()}
        {currentDemo === 'styleguide' && <StyleGuideDemo />}
      </main>
    </div>
  );
}
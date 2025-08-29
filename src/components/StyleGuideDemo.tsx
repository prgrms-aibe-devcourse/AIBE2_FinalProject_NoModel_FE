import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export function StyleGuideDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Typography Section */}
        <Card>
          <CardHeader>
            <CardTitle>Typography Scale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h1 style={{ fontSize: 'var(--font-size-title1)', fontWeight: 'var(--font-weight-bold)' }}>
              Title 1 - 36px Bold
            </h1>
            <h2 style={{ fontSize: 'var(--font-size-title2)', fontWeight: 'var(--font-weight-semibold)' }}>
              Title 2 - 24px Semibold
            </h2>
            <h3 style={{ fontSize: 'var(--font-size-title3)', fontWeight: 'var(--font-weight-semibold)' }}>
              Title 3 - 20px Semibold
            </h3>
            <p style={{ fontSize: 'var(--font-size-large)', fontWeight: 'var(--font-weight-medium)' }}>
              Large Text - 18px Medium
            </p>
            <p style={{ fontSize: 'var(--font-size-regular)', fontWeight: 'var(--font-weight-normal)' }}>
              Regular Text - 15px Normal
            </p>
            <p style={{ fontSize: 'var(--font-size-small)', fontWeight: 'var(--font-weight-normal)' }}>
              Small Text - 13px Normal
            </p>
            <p style={{ fontSize: 'var(--font-size-mini)', fontWeight: 'var(--font-weight-normal)' }}>
              Mini Text - 12px Normal
            </p>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Brand Colors */}
            <div>
              <h4 className="font-semibold mb-3">Brand Colors</h4>
              <div className="grid grid-cols-4 gap-4">
                <ColorSwatch color="var(--color-brand-primary)" label="Primary" value="#7170ff" />
                <ColorSwatch color="var(--color-brand-secondary)" label="Secondary" value="#8989f0" />
                <ColorSwatch color="var(--color-brand-accent)" label="Accent" value="#7170ff" />
                <ColorSwatch color="var(--color-brand-accent-tint)" label="Accent Tint" value="#f1f1ff" />
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h4 className="font-semibold mb-3">Semantic Colors</h4>
              <div className="grid grid-cols-6 gap-4">
                <ColorSwatch color="var(--color-semantic-blue)" label="Blue" value="#4ea7fc" />
                <ColorSwatch color="var(--color-semantic-red)" label="Red" value="#eb5757" />
                <ColorSwatch color="var(--color-semantic-green)" label="Green" value="#4cb782" />
                <ColorSwatch color="var(--color-semantic-orange)" label="Orange" value="#fc7840" />
                <ColorSwatch color="var(--color-semantic-yellow)" label="Yellow" value="#f2c94c" />
                <ColorSwatch color="var(--color-semantic-indigo)" label="Indigo" value="#5e6ad2" />
              </div>
            </div>

            {/* Text Colors */}
            <div>
              <h4 className="font-semibold mb-3">Text Colors</h4>
              <div className="grid grid-cols-4 gap-4">
                <ColorSwatch color="var(--color-text-primary)" label="Primary" value="#282a30" />
                <ColorSwatch color="var(--color-text-secondary)" label="Secondary" value="#3c4149" />
                <ColorSwatch color="var(--color-text-tertiary)" label="Tertiary" value="#6f6e77" />
                <ColorSwatch color="var(--color-text-quaternary)" label="Quaternary" value="#86848d" />
              </div>
            </div>

            {/* Background Colors */}
            <div>
              <h4 className="font-semibold mb-3">Background Colors</h4>
              <div className="grid grid-cols-5 gap-4">
                <ColorSwatch color="var(--color-background-primary)" label="Primary" value="#ffffff" />
                <ColorSwatch color="var(--color-background-secondary)" label="Secondary" value="#f9f8f9" />
                <ColorSwatch color="var(--color-background-tertiary)" label="Tertiary" value="#f4f2f4" />
                <ColorSwatch color="var(--color-background-quaternary)" label="Quaternary" value="#eeedef" />
                <ColorSwatch color="var(--color-background-quinary)" label="Quinary" value="#e9e8ea" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spacing System */}
        <Card>
          <CardHeader>
            <CardTitle>Spacing System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SpacingExample size="8px" label="Small" />
            <SpacingExample size="16px" label="Medium" />
            <SpacingExample size="24px" label="Large" />
            <SpacingExample size="32px" label="X-Large" />
            <SpacingExample size="64px" label="XX-Large" />
          </CardContent>
        </Card>

        {/* Border Radius */}
        <Card>
          <CardHeader>
            <CardTitle>Border Radius</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <RadiusExample radius="var(--radius-4)" label="4px" />
              <RadiusExample radius="var(--radius-8)" label="8px" />
              <RadiusExample radius="var(--radius-12)" label="12px" />
              <RadiusExample radius="var(--radius-16)" label="16px" />
              <RadiusExample radius="var(--radius-24)" label="24px" />
              <RadiusExample radius="var(--radius-32)" label="32px" />
              <RadiusExample radius="var(--radius-rounded)" label="Rounded" />
              <RadiusExample radius="var(--radius-circle)" label="Circle" />
            </div>
          </CardContent>
        </Card>

        {/* Shadows */}
        <Card>
          <CardHeader>
            <CardTitle>Shadow System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              <ShadowExample shadow="var(--shadow-tiny)" label="Tiny" />
              <ShadowExample shadow="var(--shadow-low)" label="Low" />
              <ShadowExample shadow="var(--shadow-medium)" label="Medium" />
              <ShadowExample shadow="var(--shadow-high)" label="High" />
            </div>
          </CardContent>
        </Card>

        {/* Button Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Button System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 flex-wrap">
              <Button variant="default">Default Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="destructive">Destructive Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="link">Link Button</Button>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Components
function ColorSwatch({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="space-y-2">
      <div 
        className="h-16 rounded-lg border"
        style={{ backgroundColor: color }}
      />
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

function SpacingExample({ size, label }: { size: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm w-20">{label}</span>
      <div 
        className="bg-primary opacity-30"
        style={{ width: size, height: '24px' }}
      />
      <span className="text-xs text-muted-foreground">{size}</span>
    </div>
  );
}

function RadiusExample({ radius, label }: { radius: string; label: string }) {
  return (
    <div className="text-center space-y-2">
      <div 
        className="w-full h-20 bg-primary/10 border border-primary/20"
        style={{ borderRadius: radius }}
      />
      <p className="text-xs">{label}</p>
    </div>
  );
}

function ShadowExample({ shadow, label }: { shadow: string; label: string }) {
  return (
    <div className="text-center space-y-4">
      <div 
        className="w-full h-24 bg-white rounded-lg flex items-center justify-center"
        style={{ boxShadow: shadow }}
      >
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
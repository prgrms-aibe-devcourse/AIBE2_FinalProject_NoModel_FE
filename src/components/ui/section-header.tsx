import * as React from 'react';
import { Badge } from './badge';
import { SectionHeading } from './section-heading';

interface SectionHeaderProps {
  badge: string;
  normalText: string;
  highlightedText: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ 
  badge, 
  normalText, 
  highlightedText, 
  description, 
  className = "" 
}: SectionHeaderProps) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <Badge variant="outline" className="mb-6 text-sm px-4 py-2 rounded-full">
        {badge}
      </Badge>
      <SectionHeading 
        normalText={normalText}
        highlightedText={highlightedText}
      />
      {description && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
          {description}
        </p>
      )}
    </div>
  );
}
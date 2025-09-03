import * as React from 'react';

interface SectionHeadingProps {
  normalText: string;
  highlightedText: string;
  className?: string;
}

export function SectionHeading({ normalText, highlightedText, className = "" }: SectionHeadingProps) {
  return (
    <h2 className={`font-bold mb-6 leading-tight ${className}`}>
      <span className="text-3xl sm:text-4xl md:text-5xl">{normalText} </span>
      <span className="text-primary text-3xl sm:text-4xl md:text-5xl">{highlightedText}</span>
    </h2>
  );
}
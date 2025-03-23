
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeading = ({
  title,
  subtitle,
  centered = false,
  className,
}: SectionHeadingProps) => {
  return (
    <div 
      className={cn(
        "mb-12",
        centered && "text-center",
        className
      )}
    >
      <h2 className="font-playfair text-3xl sm:text-4xl font-semibold mb-4">{title}</h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-3xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
};

export default SectionHeading;

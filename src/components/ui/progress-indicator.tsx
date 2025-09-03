import React from 'react';
import { Badge } from './badge';
import { Progress } from './progress';

interface Step {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: string;
  className?: string;
  variant?: 'horizontal' | 'compact';
}

export function ProgressIndicator({ 
  steps, 
  currentStep, 
  className = '',
  variant = 'horizontal' 
}: ProgressIndicatorProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div 
          className="text-sm"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          {currentStepIndex + 1}/{steps.length}
        </div>
        <div className="w-20">
          <Progress 
            value={progress} 
            className="h-2"
            style={{
              backgroundColor: 'var(--color-background-tertiary)',
              borderRadius: 'var(--radius-rounded)'
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          {React.createElement(steps[currentStepIndex]?.icon, { 
            className: "w-4 h-4", 
            style: { color: 'var(--color-brand-primary)' }
          })}
          <span 
            className="text-sm font-medium"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {steps[currentStepIndex]?.label}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1 flex-1 max-w-2xl mx-8 ${className}`}>
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < currentStepIndex;
        const StepIcon = step.icon;

        return (
          <div key={step.id} className="flex items-center flex-1">
            <div 
              className={`flex items-center gap-2 px-3 py-2 transition-colors`}
              style={{
                borderRadius: 'var(--radius-8)',
                backgroundColor: isActive 
                  ? 'var(--color-brand-primary)' 
                  : isCompleted 
                    ? 'var(--color-semantic-green)' + '20'
                    : 'var(--color-background-tertiary)',
                color: isActive 
                  ? 'var(--color-utility-white)' 
                  : isCompleted 
                    ? 'var(--color-semantic-green)'
                    : 'var(--color-text-tertiary)',
                transition: 'all var(--animation-quick-transition) ease'
              }}
            >
              <StepIcon className="w-4 h-4" />
              <span 
                className="text-sm"
                style={{
                  fontWeight: 'var(--font-weight-medium)',
                  fontSize: 'var(--font-size-small)'
                }}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`h-px flex-1 mx-2`}
                style={{
                  backgroundColor: isCompleted 
                    ? 'var(--color-semantic-green)' + '40'
                    : 'var(--color-border-primary)'
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Progress indicator for simple numbered steps
interface NumberedProgressProps {
  steps: string[];
  currentStep: string;
  className?: string;
}

export function NumberedProgress({ steps, currentStep, className = '' }: NumberedProgressProps) {
  const currentIndex = steps.indexOf(currentStep);

  return (
    <div className={`flex justify-center gap-3 ${className}`}>
      {steps.map((stepName, index) => (
        <div key={stepName} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors`}
            style={{
              backgroundColor: currentStep === stepName 
                ? 'var(--color-brand-primary)' 
                : index < currentIndex 
                  ? 'var(--color-semantic-green)' 
                  : 'var(--color-background-tertiary)',
              color: currentStep === stepName || index < currentIndex 
                ? 'var(--color-utility-white)' 
                : 'var(--color-text-tertiary)'
            }}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div 
              className="h-px w-12 mx-2"
              style={{
                backgroundColor: index < currentIndex 
                  ? 'var(--color-semantic-green)' + '40'
                  : 'var(--color-background-tertiary)'
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
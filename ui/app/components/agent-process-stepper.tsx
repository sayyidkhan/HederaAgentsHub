'use client';

import { CheckCircle2, Circle, Loader2, XCircle } from 'lucide-react';
import { ProcessStep } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AgentProcessStepperProps {
  steps: ProcessStep[];
}

export function AgentProcessStepper({ steps }: AgentProcessStepperProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        return (
          <div key={step.key} className="relative flex gap-4">
            {/* Connector line */}
            {!isLast && (
              <div
                className={cn(
                  'absolute left-4 top-8 h-full w-0.5 -ml-px',
                  step.status === 'done'
                    ? 'bg-primary'
                    : 'bg-border'
                )}
              />
            )}
            
            {/* Icon */}
            <div className="relative z-10">
              {step.status === 'done' && (
                <CheckCircle2 className="h-8 w-8 text-primary" />
              )}
              {step.status === 'active' && (
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              )}
              {step.status === 'pending' && (
                <Circle className="h-8 w-8 text-muted-foreground" />
              )}
              {step.status === 'error' && (
                <XCircle className="h-8 w-8 text-destructive" />
              )}
            </div>
            
            {/* Content */}
            <div className="flex-1 space-y-1 pb-8">
              <p className={cn(
                'font-medium',
                step.status === 'done' || step.status === 'active'
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}>
                {step.title}
              </p>
              {step.subtitle && (
                <p className="text-sm text-muted-foreground">{step.subtitle}</p>
              )}
              {step.status === 'done' && (
                <Badge variant="success" className="mt-2">
                  Completed
                </Badge>
              )}
              {step.status === 'active' && (
                <Badge className="mt-2">Processing</Badge>
              )}
              {step.status === 'pending' && (
                <Badge variant="outline" className="mt-2">
                  Pending
                </Badge>
              )}
              {step.meta && step.meta.invoiceId && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Invoice ID: {step.meta.invoiceId}
                </p>
              )}
              {step.meta && step.meta.txId && (
                <p className="mt-2 text-xs font-mono text-muted-foreground">
                  Tx: {step.meta.txId}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}


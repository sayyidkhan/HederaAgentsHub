'use client';

import { FileText, CheckCircle, DollarSign, Package, Activity } from 'lucide-react';
import { HcsEvent } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatRelativeTime } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface HcsTimelineProps {
  events: HcsEvent[];
}

function getEventIcon(type: string) {
  switch (type) {
    case 'SELLER_ITEM_LISTED':
      return <FileText className="h-4 w-4" />;
    case 'AGENT_DISCOVERING_BUYER_AGENTS':
      return <Activity className="h-4 w-4" />;
    case 'TRUST_ESTABLISHED':
      return <CheckCircle className="h-4 w-4" />;
    case 'PAYMENT_REQUESTED':
    case 'PAYMENT_SUBMITTED':
    case 'PAYMENT_CONFIRMED':
      return <DollarSign className="h-4 w-4" />;
    case 'RESOURCE_DELIVERED':
      return <Package className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
}

export function HcsTimeline({ events }: HcsTimelineProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No events yet. Timeline will update as the transaction progresses.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>HCS Event Timeline</CardTitle>
        <CardDescription>
          All events are logged to Hedera Consensus Service for immutable proof
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{event.summary}</p>
                  <Badge variant="outline" className="text-xs">
                    {formatRelativeTime(event.timestamp)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">Type: {event.type}</p>
                {event.data && Object.keys(event.data).length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                      View data
                    </summary>
                    <pre className="mt-2 rounded-md bg-muted p-2 text-xs">
                      {JSON.stringify(event.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


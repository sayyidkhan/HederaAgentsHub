'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AgentProcessStepper } from '@/components/agent-process-stepper';
import { ProcessStep } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function TransactionsPage() {
  // Mock data for demonstration
  const steps: ProcessStep[] = [
    {
      key: 'listed',
      title: 'Seller Item Listed',
      status: 'done',
    },
    {
      key: 'discovering',
      title: 'Agent Discovering Buyer Agents',
      subtitle: 'ERC-8004 Standard',
      status: 'done',
    },
    {
      key: 'trust',
      title: 'Trust Established',
      subtitle: 'Identity + Reputation Verified',
      status: 'done',
    },
    {
      key: 'payment_requested',
      title: 'Payment Requested',
      subtitle: 'x402 Invoice Generated',
      status: 'done',
    },
    {
      key: 'payment_processing',
      title: 'Blockchain Payment in Process',
      subtitle: 'Hedera Testnet, Mirror Node pending',
      status: 'active',
    },
    {
      key: 'payment_verified',
      title: 'Payment Verified',
      subtitle: 'View on HashScan',
      status: 'pending',
    },
    {
      key: 'completed',
      title: 'Transaction Complete',
      subtitle: 'Seller ships the item',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Transaction Progress</h1>
        <p className="mt-1 text-muted-foreground">
          Track your peer-to-peer transaction from listing to completion.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-6">
                <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-muted">
                  <div className="text-center text-sm text-muted-foreground">
                    Product Image
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Transaction ID: 1A2B-3C4D-5E6F
                  </p>
                  <h2 className="text-xl font-semibold">Sale of 'Vintage Leather Jacket'</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge>In Progress</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Amount: <span className="font-semibold text-foreground">$150.00</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Process Stepper */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <AgentProcessStepper steps={steps} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                View on HashScan
              </Button>
              <Button variant="outline" className="w-full">
                Contact Seller
              </Button>
              <Button variant="destructive" className="w-full">
                Raise a Dispute
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { HeaderNav } from '@/components/header-nav';
import { AgentProcessStepper } from '@/components/agent-process-stepper';
import { HcsTimeline } from '@/components/hcs-timeline';
import { InvoiceCard } from '@/components/invoice-card';
import { HashScanLink } from '@/components/hashscan-link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AuthGuard } from '@/lib/auth-guard';
import { useOrderStore } from '@/lib/store';
import { getOrder, payInvoice } from '@/lib/api';
import { startMockProcess, completePayment } from '@/lib/process';
import { ProcessStep, HcsEvent } from '@/lib/types';
import { Loader2, ShoppingBag } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PageProps {
  params: { id: string };
}

export default function OrderDetailPage({ params }: PageProps) {
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [processStarted, setProcessStarted] = useState(false);

  const {
    ordersById,
    stepperByOrderId,
    timelinesByOrderId,
    invoicesByOrderId,
    createOrder,
    setSteps,
    setTimeline,
    setInvoice,
    markPaid,
  } = useOrderStore();

  const order = ordersById[id];
  const steps = stepperByOrderId[id] || [];
  const events = timelinesByOrderId[id] || [];
  const invoice = invoicesByOrderId[id];

  useEffect(() => {
    async function loadOrder() {
      setLoading(true);
      try {
        const orderData = await getOrder(id);
        if (orderData) {
          createOrder(orderData);
        }
      } finally {
        setLoading(false);
      }
    }
    
    if (!order) {
      loadOrder();
    } else {
      setLoading(false);
    }
  }, [id, order, createOrder]);

  useEffect(() => {
    if (order && !processStarted && steps.length === 0) {
      setProcessStarted(true);
      
      // Start the mock agent process
      startMockProcess(id, (newSteps: ProcessStep[], newEvents: HcsEvent[]) => {
        setSteps(id, newSteps);
        setTimeline(id, newEvents);
        
        // Create invoice when payment step is reached
        const paymentStep = newSteps.find(s => s.key === 'payment_requested');
        if (paymentStep?.status === 'done' && paymentStep.meta?.invoiceId && !invoice) {
          setInvoice(id, {
            id: paymentStep.meta.invoiceId,
            orderId: id,
            amount: 150,
            asset: 'USDC (test)',
            status: 'unpaid',
            createdAt: new Date(),
          });
        }
      });
    }
  }, [order, processStarted, steps.length, id, setSteps, setTimeline, setInvoice, invoice]);

  const handlePay = async (invoiceId: string) => {
    if (!invoice) return;
    
    // Update invoice to pending
    setInvoice(id, { ...invoice, status: 'pending' });
    
    // Simulate payment
    const result = await payInvoice(invoiceId);
    
    // Mark as paid and continue process
    markPaid(id, result.txId);
    
    // Complete the payment process
    await completePayment(id, result.txId, steps, events, (newSteps, newEvents) => {
      setSteps(id, newSteps);
      setTimeline(id, newEvents);
    });
  };

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen">
          <HeaderNav />
          <div className="container flex min-h-[60vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!order) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen">
          <HeaderNav />
        <div className="container py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Order not found</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const completedSteps = steps.filter(s => s.status === 'done').length;
  const progress = (completedSteps / steps.length) * 100;

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen">
        <HeaderNav />
      
      <main className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <h1 className="text-2xl font-bold">Transaction Progress</h1>
            <Badge variant="outline">{order.type === 'sell' ? 'Selling' : 'Buying'}</Badge>
          </div>
          <p className="text-muted-foreground">
            Track your peer-to-peer transaction from listing to completion.
          </p>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              {completedSteps} of {steps.length} steps completed
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Product & Process */}
          <div className="space-y-6 lg:col-span-2">
            {/* Product Summary */}
            {order.listing && (
              <Card>
                <CardHeader>
                  <CardTitle>Product Summary</CardTitle>
                  <CardDescription>
                    Transaction ID: {id.slice(0, 16).toUpperCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-muted">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{order.listing.title}</h3>
                      <p className="text-2xl font-bold text-primary">${order.listing.price}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Sold by</span>
                        <span className="text-sm font-medium">@{order.listing.sellerName}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Agent Process Stepper */}
            <Card>
              <CardHeader>
                <CardTitle>Agent Process</CardTitle>
                <CardDescription>Automated workflow powered by AI agents</CardDescription>
              </CardHeader>
              <CardContent>
                {steps.length > 0 ? (
                  <AgentProcessStepper steps={steps} />
                ) : (
                  <div className="flex min-h-[200px] items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* HCS Timeline */}
            <HcsTimeline events={events} />
          </div>

          {/* Right Column - Invoice & Actions */}
          <div className="space-y-6">
            {/* AI Trust Score */}
            <Card>
              <CardHeader>
                <CardTitle>AI Agent Trust Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative">
                  <svg className="h-32 w-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={`${(85 / 100) * 352} 352`}
                      strokeLinecap="round"
                      className="text-primary"
                      transform="rotate(-90 64 64)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">85</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">ERC-8004 Reputation</p>
              </CardContent>
            </Card>

            {/* Invoice */}
            <InvoiceCard invoice={invoice} onPay={handlePay} />

            {/* HashScan Link */}
            <HashScanLink txId={invoice?.txId} disabled={invoice?.status !== 'paid'} />

            {/* Blockchain Details */}
            {invoice?.txId && (
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-mono text-xs break-all">{invoice.txId}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Blockchain Invoice ID</p>
                    <p className="font-mono text-xs">0.0.1234567-cba-987654</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}


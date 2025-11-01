'use client';

import { useState } from 'react';
import { DollarSign, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Invoice } from '@/lib/types';

interface InvoiceCardProps {
  invoice: Invoice | null;
  onPay?: (invoiceId: string) => Promise<void>;
}

export function InvoiceCard({ invoice, onPay }: InvoiceCardProps) {
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    if (!invoice || !onPay) return;
    
    setPaying(true);
    try {
      await onPay(invoice.id);
    } finally {
      setPaying(false);
    }
  };

  if (!invoice) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Invoice will be generated after trust verification
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Payment Invoice
        </CardTitle>
        <CardDescription>x402 Invoice Generated</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="font-semibold">${invoice.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Asset</span>
            <span className="font-medium">{invoice.asset}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Invoice ID</span>
            <span className="font-mono text-xs">{invoice.id.slice(0, 12)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge
              variant={
                invoice.status === 'paid'
                  ? 'success'
                  : invoice.status === 'pending'
                  ? 'warning'
                  : 'outline'
              }
            >
              {invoice.status}
            </Badge>
          </div>
          {invoice.txId && (
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Transaction ID</span>
              <span className="font-mono text-xs">{invoice.txId.slice(0, 16)}...</span>
            </div>
          )}
        </div>

        {invoice.status === 'unpaid' && onPay && (
          <Button className="w-full" onClick={handlePay} disabled={paying}>
            {paying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        )}

        {invoice.status === 'pending' && (
          <div className="rounded-md bg-muted p-4 text-center">
            <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Payment submitted. Waiting for blockchain confirmation...
            </p>
          </div>
        )}

        {invoice.status === 'paid' && (
          <div className="rounded-md bg-green-50 p-4 text-center dark:bg-green-950">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              Payment confirmed on Hedera Testnet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


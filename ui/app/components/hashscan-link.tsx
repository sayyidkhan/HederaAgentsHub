'use client';

import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HashScanLinkProps {
  txId?: string;
  disabled?: boolean;
}

export function HashScanLink({ txId, disabled }: HashScanLinkProps) {
  const hashscanUrl = txId
    ? `https://hashscan.io/testnet/transaction/${txId}`
    : '#';

  return (
    <Button
      variant="outline"
      className="w-full"
      disabled={disabled || !txId}
      asChild={!!txId}
    >
      {txId ? (
        <a href={hashscanUrl} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" />
          View on HashScan Explorer
        </a>
      ) : (
        <>
          <ExternalLink className="mr-2 h-4 w-4" />
          View on HashScan Explorer
        </>
      )}
    </Button>
  );
}


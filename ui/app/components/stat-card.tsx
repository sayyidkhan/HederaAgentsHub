'use client';

import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
}

export function StatCard({ label, value, sublabel }: StatCardProps) {
  return (
    <Card className="bg-white border-none shadow-sm">
      <CardContent className="pt-6 text-center">
        <div className="mb-2">
          <p className="text-3xl font-bold text-[#021058]">{value}</p>
          {sublabel && (
            <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#021058]/60">
              {sublabel}
            </p>
          )}
        </div>
        <p className="text-sm font-medium uppercase tracking-wide text-[#021058]/80">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}


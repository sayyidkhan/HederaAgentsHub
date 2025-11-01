'use client';

import Link from 'next/link';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Listing } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg bg-white border-primary/10">
      <Link href={`/orders/${listing.id}`}>
        <div className="relative aspect-square overflow-hidden bg-secondary">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <ShoppingBag className="h-16 w-16 text-primary/30" />
          </div>
          <div className="absolute right-2 top-2">
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="mb-2">
          <Link href={`/orders/${listing.id}`}>
            <h3 className="font-semibold line-clamp-1 hover:underline">{listing.title}</h3>
          </Link>
          <p className="text-xl font-bold text-primary">
            ${listing.price}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{listing.sellerRating}</span>
            <span>·</span>
            <span>{listing.sellerName}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


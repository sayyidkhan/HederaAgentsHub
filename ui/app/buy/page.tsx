'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderNav } from '@/components/header-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AuthGuard } from '@/lib/auth-guard';
import { createBuyOrder } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function BuyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    query: '',
    budget: '',
    quantity: '1',
    location: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const order = await createBuyOrder({
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        quantity: parseInt(formData.quantity),
      });
      
      setOrderId(order.id);
      setShowDialog(true);
      
      // Auto-navigate after 2 seconds
      setTimeout(() => {
        router.push(`/orders/${order.id}`);
      }, 2000);
    } catch (error) {
      console.error('Failed to create buy order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen">
        <HeaderNav />
      
      <main className="container max-w-2xl py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">What are you looking for?</h1>
          <p className="mt-2 text-muted-foreground">
            Fill in the details below to find sellers for the item you want.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="query">What do you want to buy?</Label>
                <Input
                  id="query"
                  placeholder="e.g. Vintage Leather Jacket"
                  value={formData.query}
                  onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Your Budget</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input
                    id="budget"
                    type="number"
                    step="0.01"
                    placeholder="250.00"
                    className="pl-7"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific requirements or preferences..."
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Find Sellers'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      {/* Agent Registered Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-primary"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
              </svg>
            </div>
            <DialogTitle className="text-2xl">Buyer Agent is registered</DialogTitle>
            <DialogDescription className="text-base">
              ...and waiting for Seller Agents.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Button className="w-full" onClick={() => router.push(`/orders/${orderId}`)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </AuthGuard>
  );
}


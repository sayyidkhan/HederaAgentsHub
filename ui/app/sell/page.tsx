'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderNav } from '@/components/header-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createSellOrder } from '@/lib/api';
import { siteConfig } from '@/lib/config';
import { Upload, Loader2 } from 'lucide-react';
import { AuthGuard } from '@/lib/auth-guard';

export default function SellPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '', 
    condition: 'Used - Like New',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const order = await createSellOrder({
        ...formData,
        price: parseFloat(formData.price),
        images: ['/images/placeholder.jpg'],
      });
      
      // Navigate to order page to show agent process
      router.push(`/orders/${order.id}`);
    } catch (error) {
      console.error('Failed to create sell order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen">
        <HeaderNav />
      
      <main className="container max-w-4xl py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Sell Your Item</h1>
          <p className="text-muted-foreground">
            Fill out the details below to list your item on the marketplace.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Form */}
            <div className="space-y-6 lg:col-span-2">
              {/* Photos */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Photos</CardTitle>
                  <CardDescription>
                    Add at least one photo. The first one will be the main image.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex min-h-[200px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
                    <div className="text-center">
                      <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="mb-2 text-sm font-medium">Drag & drop or click to upload</p>
                      <p className="text-xs text-muted-foreground">
                        Upload your primary image here. It will be the first one buyers see.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex aspect-square items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50"
                      >
                        <p className="text-sm text-muted-foreground">Add secondary image</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Item Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Item Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Vintage Leather Jacket"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item in detail..."
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="pl-7"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select
                        value={formData.condition}
                        onValueChange={(value) => setFormData({ ...formData, condition: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Used - Like New">Used - Like New</SelectItem>
                          <SelectItem value="Used - Good">Used - Good</SelectItem>
                          <SelectItem value="Used - Fair">Used - Fair</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {siteConfig.categories.filter(c => c !== 'All').map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location (Optional)</Label>
                    <Input
                      id="location"
                      placeholder="e.g. San Francisco, CA"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Listing...
                  </>
                ) : (
                  'List for Sale'
                )}
              </Button>
            </div>

            {/* Preview Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>How your listing will appear</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="aspect-square rounded-lg bg-muted" />
                      <div>
                        <h3 className="font-semibold line-clamp-2">
                          {formData.title || 'Your item title'}
                        </h3>
                        <p className="mt-1 text-xl font-bold text-primary">
                          ${formData.price || '0.00'}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {formData.description || 'Your item description will appear here...'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
    </AuthGuard>
  );
}


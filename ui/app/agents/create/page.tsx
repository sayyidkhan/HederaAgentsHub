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
import { AuthGuard } from '@/lib/auth-guard';
import { createAgent } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Loader2, Bot, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Agent, AgentCapability } from '@/lib/types';

export default function CreateAgentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'buyer' as Agent['type'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // In production, use actual user.id from Supabase
      const newAgent = await createAgent({
        ...formData,
        userId: 'user-1',
      });
      
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Failed to create agent:', error);
      alert('Failed to create agent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen">
        <HeaderNav />
        
        <main className="container py-8 max-w-3xl">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to My Agents
          </Link>

          <Card className="border-primary/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Create New Agent</CardTitle>
                  <CardDescription>
                    Configure your AI agent to automate marketplace activities
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Agent Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Electronics Buyer Agent"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="border-primary/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Give your agent a descriptive name
                  </p>
                </div>

                {/* Agent Type */}
                <div className="space-y-2">
                  <Label htmlFor="type">Agent Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: Agent['type']) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger id="type" className="border-primary/20">
                      <SelectValue placeholder="Select agent type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Buyer Agent</span>
                          <span className="text-xs text-muted-foreground">Automates purchasing and deal finding</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="seller">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Seller Agent</span>
                          <span className="text-xs text-muted-foreground">Automates listing and sales management</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="validator">
                        <div className="flex flex-col items-start">
                          <span className="font-medium">Validator Agent</span>
                          <span className="text-xs text-muted-foreground">Validates transactions and product quality</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your agent does and its key features..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="border-primary/20 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a detailed description of your agent's purpose and capabilities
                  </p>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <Bot className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">What happens next?</h4>
                      <p className="text-sm text-blue-800">
                        Your agent will be created with a unique DID (Decentralized Identifier) and EVM address 
                        on the Hedera network. You can configure capabilities and start using it immediately.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.name || !formData.description}
                    className="flex-1 gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4" />
                        Create Agent
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  );
}


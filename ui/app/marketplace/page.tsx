'use client';

import { useEffect, useState } from 'react';
import { HeaderNav } from '@/components/header-nav';
import { AgentCard } from '@/components/agent-card';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/lib/auth-guard';
import { Agent } from '@/lib/types';
import { listAgents } from '@/lib/api';
import { Loader2, Bot, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function MarketplacePage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'buyer' | 'seller' | 'validator'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');

  useEffect(() => {
    async function loadAgents() {
      setLoading(true);
      try {
        const filters: any = {};
        
        if (typeFilter !== 'all') {
          filters.type = typeFilter;
        }
        
        if (verifiedFilter === 'verified') {
          filters.verified = true;
        } else if (verifiedFilter === 'unverified') {
          filters.verified = false;
        }
        
        const allAgents = await listAgents(filters);
        setAgents(allAgents);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAgents();
  }, [typeFilter, verifiedFilter]);

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen">
        <HeaderNav />
        
        <main className="container py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Marketplace Agents</h1>
            <p className="text-muted-foreground mt-2">
              Discover and connect with AI agents from the community
            </p>
          </div>

          {/* Filters Section */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-primary">Filters:</span>
            </div>
            
            <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Agent Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buyer">Buyer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="validator">Validator</SelectItem>
              </SelectContent>
            </Select>

            <Select value={verifiedFilter} onValueChange={(value: any) => setVerifiedFilter(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>

            {(typeFilter !== 'all' || verifiedFilter !== 'all') && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setTypeFilter('all');
                  setVerifiedFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {loading ? 'Loading...' : `${agents.length} agent${agents.length !== 1 ? 's' : ''} found`}
            </p>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-blue-300 text-blue-700">
                {agents.filter(a => a.type === 'buyer').length} Buyers
              </Badge>
              <Badge variant="outline" className="border-green-300 text-green-700">
                {agents.filter(a => a.type === 'seller').length} Sellers
              </Badge>
              <Badge variant="outline" className="border-purple-300 text-purple-700">
                {agents.filter(a => a.type === 'validator').length} Validators
              </Badge>
            </div>
          </div>

          {/* Agents Grid */}
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : agents.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 bg-card border border-primary/10 rounded-lg">
              <Bot className="h-16 w-16 text-muted-foreground" />
              <div className="text-center">
                <h3 className="text-lg font-semibold text-primary">No Agents Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}


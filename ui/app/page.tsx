'use client';

import { useEffect, useState } from 'react';
import { HeaderNav } from '@/components/header-nav';
import { AgentCard } from '@/components/agent-card';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/lib/auth-guard';
import { Agent } from '@/lib/types';
import { getMyAgents } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Loader2, Plus, Bot } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadAgents() {
      if (!user) return;
      
      setLoading(true);
      try {
        // For demo purposes, using 'user-1' as the user ID
        // In production, you would use the actual user.id from Supabase
        const myAgents = await getMyAgents('user-1');
        setAgents(myAgents);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAgents();
  }, [user]);

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen">
        <HeaderNav />
        
        <main className="container py-8">
          {/* Header Section */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">My Agents</h1>
              <p className="text-muted-foreground mt-2">
                Manage your AI agents and view their performance
              </p>
            </div>
            <Link href="/agents/create">
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Create Agent
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-card border border-primary/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Agents</p>
                  <p className="text-2xl font-bold text-primary">{agents.length}</p>
                </div>
                <Bot className="h-8 w-8 text-primary/50" />
              </div>
            </div>
            <div className="bg-card border border-primary/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Agents</p>
                  <p className="text-2xl font-bold text-green-600">
                    {agents.filter(a => a.status === 'active').length}
                  </p>
                </div>
                <Bot className="h-8 w-8 text-green-500/50" />
              </div>
            </div>
            <div className="bg-card border border-primary/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold text-primary">
                    {agents.reduce((sum, a) => sum + a.totalTransactions, 0)}
                  </p>
                </div>
                <Bot className="h-8 w-8 text-primary/50" />
              </div>
            </div>
            <div className="bg-card border border-primary/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                  <p className="text-2xl font-bold text-primary">
                    {agents.length > 0 
                      ? (agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length).toFixed(1)
                      : 0}%
                  </p>
                </div>
                <Bot className="h-8 w-8 text-primary/50" />
              </div>
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
                <h3 className="text-lg font-semibold text-primary">No Agents Yet</h3>
                <p className="text-muted-foreground mt-2">Create your first AI agent to get started</p>
              </div>
              <Link href="/agents/create">
                <Button size="lg" className="gap-2">
                  <Plus className="h-5 w-5" />
                  Create Your First Agent
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          )}
        </main>

        {/* Floating Action Button (Mobile) */}
        <Link
          href="/agents/create"
          className="fixed bottom-6 right-6 sm:hidden"
        >
          <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
            <Plus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </AuthGuard>
  );
}

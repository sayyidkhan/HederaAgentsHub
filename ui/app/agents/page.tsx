'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeaderNav } from '@/components/header-nav';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/lib/auth-guard';
import { Bot, Plus, Loader2 } from 'lucide-react';
import { AgentCard } from '@/components/agent-card';
import { Agent } from '@/lib/types';
import { mockAgents } from '@/lib/mockDb';

export default function MyAgentsPage() {
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  
  useEffect(() => {
    // In a real app, this would come from an API
    setAgents(mockAgents);
  }, []);
  
  // Calculate totals
  const totalTransactions = agents.reduce((sum, agent) => sum + (agent.totalTransactions || 0), 0);
  const totalBalance = agents.reduce((sum, agent) => sum + agent.reputationScore, 0).toFixed(1);

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <HeaderNav />
        
        <main className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Agents</h1>
            <p className="mt-2 text-gray-600">
              Manage your AI agents and view their performance
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("active")}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === "active"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Active ({mockAgents.length})
              </button>
              <button
                onClick={() => setActiveTab("inactive")}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium ${
                  activeTab === "inactive"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Inactive (0)
              </button>
            </nav>
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
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 md:hidden"
        >
          <Plus className="h-6 w-6" />
          <span className="sr-only">Create Agent</span>
        </Link>
      </div>
    </AuthGuard>
  );
}

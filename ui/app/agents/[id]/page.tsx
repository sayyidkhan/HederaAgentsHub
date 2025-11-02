'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeaderNav } from '@/components/header-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { AuthGuard } from '@/lib/auth-guard';
import { Agent } from '@/lib/types';
import { getAgent } from '@/lib/api';
import { 
  Loader2, 
  Bot, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Zap,
  Shield,
  Activity,
  Calendar,
  MapPin,
  User
} from 'lucide-react';
import Link from 'next/link';
import { getUserById } from '@/lib/mockDb';

interface PageProps {
  params: { id: string };
}

export default function AgentDetailPage({ params }: PageProps) {
  const { id } = params;
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgent() {
      setLoading(true);
      try {
        const agentData = await getAgent(id);
        setAgent(agentData);
      } catch (error) {
        console.error('Failed to fetch agent:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAgent();
  }, [id]);

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen">
          <HeaderNav />
          <div className="flex min-h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!agent) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen">
          <HeaderNav />
          <div className="container py-8">
            <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
              <Bot className="h-16 w-16 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-primary">Agent Not Found</h3>
              <Link href="/">
                <Button>Back to My Agents</Button>
              </Link>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const getTypeColor = (type: Agent['type']) => {
    switch (type) {
      case 'buyer':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'seller':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'validator':
        return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  const getStatusBadge = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-orange-300 text-orange-700"><Clock className="h-3 w-3 mr-1" />Pending Verification</Badge>;
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen">
        <HeaderNav />
        
        <main className="container py-8 max-w-6xl">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to My Agents
          </Link>

          {/* Agent Header */}
          <Card className="border-primary/10 mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20 border-2 border-primary/20">
                    <AvatarImage src={agent.avatar} alt={agent.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <Bot className="h-10 w-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold text-primary">{agent.name}</h1>
                      {agent.verified && (
                        <CheckCircle2 className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getTypeColor(agent.type)} variant="outline">
                        {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)} Agent
                      </Badge>
                      {getStatusBadge(agent.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Configure</Button>
                  <Link href={`/agents/${agent.id}/run`}>
                    <Button className="gap-2">
                      <Activity className="h-4 w-4" />
                      Run Order
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Stats */}

              {/* Capabilities */}
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Capabilities
                  </CardTitle>
                  <CardDescription>
                    Skills and features enabled for this agent
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {agent.capabilities.map((cap) => (
                      <div key={cap.id} className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg border border-primary/10">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          cap.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          <Zap className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-primary">{cap.name}</h4>
                            <Badge variant={cap.enabled ? 'default' : 'secondary'} className="text-xs">
                              {cap.enabled ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{cap.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">{cap.category}</Badge>
                            {cap.priceModel && (
                              <Badge variant="outline" className="text-xs">{cap.priceModel}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Agent Info */}
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5" />
                    Agent Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Owner Information */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Agent Owner
                    </div>
                    <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-lg">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={getUserById(agent.userId)?.avatar} alt={getUserById(agent.userId)?.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {getUserById(agent.userId)?.name.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{getUserById(agent.userId)?.name}</p>
                        <p className="text-xs text-muted-foreground">{getUserById(agent.userId)?.email}</p>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">EVM Address</div>
                    <div className="font-mono text-xs bg-secondary/50 p-2 rounded break-all">
                      {agent.evmAddress}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">DID</div>
                    <div className="font-mono text-xs bg-secondary/50 p-2 rounded break-all">
                      {agent.did}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Created</div>
                    <div className="text-sm font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {agent.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Last Updated</div>
                    <div className="text-sm font-medium">
                      {agent.updatedAt.toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    View Activity Log
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Zap className="h-4 w-4 mr-2" />
                    Manage Capabilities
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </Button>
                  <Separator />
                  <Button variant="destructive" className="w-full">
                    Deactivate Agent
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}


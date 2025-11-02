'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HeaderNav } from '@/components/header-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthGuard } from '@/lib/auth-guard';
import { Agent, ProcessStep, HcsEvent } from '@/lib/types';
import { getAgent } from '@/lib/api';
import { startAgentOrderProcess } from '@/lib/process';
import { AgentProcessStepper } from '@/components/agent-process-stepper';
import { HcsTimeline } from '@/components/hcs-timeline';
import { InvoiceCard } from '@/components/invoice-card';
import { getInvoiceByOrderId } from '@/lib/mockDb';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Loader2, 
  Bot, 
  ArrowLeft, 
  Play,
  CheckCircle2,
  Activity,
  Settings,
  DollarSign,
  ShoppingCart
} from 'lucide-react';

interface PageProps {
  params: { id: string };
}

interface AgentConfig {
  prompt: string;
  minPrice: number;
  maxPrice: number;
  productRequirements: string;
  minSellerReputation: number;
  autoApprove: boolean;
}

export default function AgentRunPage({ params }: PageProps) {
  const { id } = params;
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [events, setEvents] = useState<HcsEvent[]>([]);
  const [showConfig, setShowConfig] = useState(true);
  const orderId = `order-${id}-${Date.now()}`;
  
  const [config, setConfig] = useState<AgentConfig>({
    prompt: agent?.type === 'buyer' 
      ? 'Find the best iPhone under my budget with good condition' 
      : 'List my iPhone at the best market price',
    minPrice: 80,
    maxPrice: 100,
    productRequirements: 'iPhone 14 or newer, good condition, unlocked',
    minSellerReputation: 4.5,
    autoApprove: false,
  });

  useEffect(() => {
    async function loadAgent() {
      setLoading(true);
      try {
        const agentData = await getAgent(id);
        setAgent(agentData);
        // Set default prompt and price limits based on agent type
        if (agentData) {
          setConfig(prev => ({
            ...prev,
            prompt: agentData.type === 'buyer'
              ? 'Find the best iPhone under my budget with good condition'
              : 'List my iPhone at the best market price',
            minPrice: agentData.type === 'buyer' ? 80 : 90,
            maxPrice: 100
          }));
        }
      } catch (error) {
        console.error('Failed to fetch agent:', error);
      } finally {
        setLoading(false);
      }
    }
    loadAgent();
  }, [id]);

  const handleRunOrder = async () => {
    if (!agent) return;
    
    setRunning(true);
    setShowConfig(false);
    
    const onUpdate = (newSteps: ProcessStep[], newEvents: HcsEvent[]) => {
      setSteps(newSteps);
      setEvents(newEvents);
      
      // Check if all steps are done
      if (newSteps.every(step => step.status === 'done')) {
        setCompleted(true);
        setRunning(false);
      }
    };

    try {
      await startAgentOrderProcess(orderId, agent.type, onUpdate, config);
    } catch (error) {
      console.error('Failed to run agent process:', error);
      setRunning(false);
    }
  };

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
              <Link href="/agents">
                <Button>Back to My Agents</Button>
              </Link>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const invoice = getInvoiceByOrderId(orderId);

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <HeaderNav />
        
        <main className="container py-8 max-w-6xl">
          {/* Back Button */}
          <Link 
            href={`/agents/${agent.id}`} 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Agent Details
          </Link>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Run Agent Order</h1>
                <p className="text-gray-600">
                  Execute {agent.name} to process an automated transaction
                </p>
              </div>
              {!running && !completed && (
                <Button 
                  onClick={handleRunOrder}
                  size="lg"
                  className="gap-2"
                >
                  <Play className="h-5 w-5" />
                  Start Process
                </Button>
              )}
              {completed && (
                <Badge className="bg-green-500 text-white px-4 py-2 text-base gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Completed
                </Badge>
              )}
            </div>
          </div>

          {/* Agent Info Card */}
          <Card className="mb-6 border-primary/10">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Bot className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle>{agent.name}</CardTitle>
                  <CardDescription className="mt-1">{agent.description}</CardDescription>
                </div>
                <Badge 
                  className={
                    agent.type === 'buyer' 
                      ? 'bg-blue-100 text-blue-700 border-blue-200' 
                      : 'bg-green-100 text-green-700 border-green-200'
                  } 
                  variant="outline"
                >
                  {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)} Agent
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Configuration Card */}
          {showConfig && !running && steps.length === 0 && (
            <Card className="mb-6 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <CardTitle>Configure Agent {agent.type === 'buyer' ? 'Buying' : 'Selling'} Parameters</CardTitle>
                </div>
                <CardDescription>
                  Set instructions and guardrails before running the agent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prompt/Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-base font-semibold flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Agent Instructions
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder={agent.type === 'buyer' 
                      ? 'Example: Find the best iPhone under my budget with good condition and warranty'
                      : 'Example: List my iPhone at competitive price and negotiate if needed'
                    }
                    value={config.prompt}
                    onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
                    className="min-h-[100px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    Provide natural language instructions for what the agent should do
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price Range Guardrail */}
                  <div className="space-y-2">
                    <Label htmlFor="minPrice" className="text-base font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      {agent.type === 'buyer' ? 'Minimum Price' : 'Minimum Price'}
                    </Label>
                    <div className="relative">
                      <Input
                        id="minPrice"
                        type="number"
                        value={config.minPrice}
                        onChange={(e) => setConfig({ ...config, minPrice: Number(e.target.value) })}
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">HBAR</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {agent.type === 'buyer' 
                        ? 'Minimum price to consider (80 HBAR default)'
                        : 'Will not sell below this price (90 HBAR default)'
                      }
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxPrice" className="text-base font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Maximum Price
                    </Label>
                    <div className="relative">
                      <Input
                        id="maxPrice"
                        type="number"
                        value={config.maxPrice}
                        onChange={(e) => setConfig({ ...config, maxPrice: Number(e.target.value) })}
                        className="pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">HBAR</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {agent.type === 'buyer' 
                        ? 'Agent will not buy above this price (100 HBAR default)'
                        : 'Maximum price to sell at (100 HBAR default)'
                      }
                    </p>
                  </div>
                </div>

                {/* Min Seller Reputation */}
                {agent.type === 'buyer' && (
                  <div className="space-y-2">
                    <Label htmlFor="minReputation" className="text-base font-semibold">
                      Minimum Seller Reputation
                    </Label>
                    <Input
                      id="minReputation"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={config.minSellerReputation}
                      onChange={(e) => setConfig({ ...config, minSellerReputation: Number(e.target.value) })}
                    />
                    <p className="text-sm text-muted-foreground">
                      Only consider sellers with this rating or higher
                    </p>
                  </div>
                )}

                {/* Product Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-base font-semibold">
                    Product Requirements
                  </Label>
                  <Textarea
                    id="requirements"
                    placeholder={agent.type === 'buyer'
                      ? 'Example: iPhone 14 or newer, good condition, unlocked, original accessories'
                      : 'Example: iPhone 14 Pro, 256GB, excellent condition, unlocked, with original box'
                    }
                    value={config.productRequirements}
                    onChange={(e) => setConfig({ ...config, productRequirements: e.target.value })}
                    className="min-h-[80px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    Specify product details and requirements
                  </p>
                </div>

                {/* Auto-approve Toggle */}
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium">Auto-approve Negotiation</p>
                    <p className="text-sm text-muted-foreground">
                      Agent can complete deals within guardrails without approval
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.autoApprove}
                    onChange={(e) => setConfig({ ...config, autoApprove: e.target.checked })}
                    className="h-5 w-5 rounded border-gray-300"
                  />
                </div>

                {/* Account Information */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                    Account Information
                  </h4>
                  <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
                    <div>
                      <span className="text-xs text-muted-foreground font-medium">Agent Wallet Address</span>
                      <p className="text-sm font-mono bg-background px-2 py-1 rounded mt-1 break-all">
                        {agent.evmAddress}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground font-medium">Agent DID</span>
                      <p className="text-xs font-mono bg-background px-2 py-1 rounded mt-1 break-all">
                        {agent.did}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guardrails Summary */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                    Active Guardrails
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Badge variant="secondary" className="justify-start text-xs py-2">
                      ✓ Price Range: {config.minPrice}-{config.maxPrice} HBAR
                    </Badge>
                    {agent.type === 'buyer' && (
                      <Badge variant="secondary" className="justify-start text-xs py-2">
                        ✓ Min Reputation: {config.minSellerReputation}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="justify-start text-xs py-2">
                      ✓ Product Specs Required
                    </Badge>
                    <Badge variant="secondary" className="justify-start text-xs py-2">
                      ✓ Trust Verification
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {steps.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Process Steps */}
              <div className="lg:col-span-2 space-y-4">
                {/* Active Configuration Display */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-blue-900">
                      <Settings className="h-4 w-4" />
                      Active Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-blue-600 font-medium">Price Range:</span>
                        <span className="ml-2 text-blue-900">{config.minPrice}-{config.maxPrice} HBAR</span>
                      </div>
                      {agent?.type === 'buyer' && (
                        <div>
                          <span className="text-blue-600 font-medium">Min Reputation:</span>
                          <span className="ml-2 text-blue-900">{config.minSellerReputation}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-blue-600 font-medium">Account:</span>
                        <span className="ml-2 text-blue-900 font-mono text-xs">{agent?.evmAddress.substring(0, 10)}...</span>
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Auto-approve:</span>
                        <span className="ml-2 text-blue-900">{config.autoApprove ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Process Flow
                    </CardTitle>
                    <CardDescription>
                      Real-time progress of the agent order execution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AgentProcessStepper steps={steps} />
                  </CardContent>
                </Card>

                {/* Invoice Card */}
                {completed && invoice && (
                  <Card className="border-primary/10">
                    <CardHeader>
                      <CardTitle>Transaction Invoice</CardTitle>
                      <CardDescription>
                        Payment completed successfully
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <InvoiceCard invoice={invoice} showPayButton={false} />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Timeline */}
              <div className="lg:col-span-1">
                <Card className="border-primary/10 sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Event Timeline</CardTitle>
                    <CardDescription>
                      Blockchain events logged on HCS
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {events.length > 0 ? (
                      <HcsTimeline events={events} />
                    ) : (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        Events will appear here as the process runs
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Process Summary */}
          {completed && (
            <Card className="mt-6 bg-green-50 border-green-200">
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                      Order Process Completed Successfully
                    </h3>
                    <p className="text-green-800 mb-4">
                      The {agent.name} has successfully completed the entire transaction flow:
                    </p>
                    <ul className="space-y-2 text-green-800">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Agent discovery and matching</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Trust establishment through DID verification</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Price negotiation within guardrails</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Smart contract handshake agreement</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Payment transfer on Hedera network</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Invoice generation with payment proof</span>
                      </li>
                    </ul>
                    <div className="mt-4 flex gap-3">
                      <Link href={`/agents/${agent.id}`}>
                        <Button variant="outline">Back to Agent</Button>
                      </Link>
                      <Link href="/agents">
                        <Button>View All Agents</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}


'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Agent } from '@/lib/types';
import { Bot, CheckCircle2, Clock, TrendingUp, Zap } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  showActions?: boolean;
}

export function AgentCard({ agent, showActions = true }: AgentCardProps) {
  const getTypeColor = (type: Agent['type']) => {
    switch (type) {
      case 'buyer':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'seller':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'validator':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (status: Agent['status']) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-orange-300 text-orange-700"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={agent.avatar} alt={agent.name} />
              <AvatarFallback className="bg-primary/10 text-primary">
                <Bot className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                {agent.verified && (
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <CardDescription className="mt-1">
                <Badge className={getTypeColor(agent.type)} variant="outline">
                  {agent.type.charAt(0).toUpperCase() + agent.type.slice(1)}
                </Badge>
              </CardDescription>
            </div>
          </div>
          {getStatusBadge(agent.status)}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {agent.description}
        </p>

        {/* Capabilities */}
        <div className="flex flex-wrap gap-1 mb-4">
          {agent.capabilities.slice(0, 3).map((cap) => (
            <Badge key={cap.id} variant="secondary" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              {cap.name}
            </Badge>
          ))}
          {agent.capabilities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{agent.capabilities.length - 3}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-secondary/50 rounded-lg p-2">
            <div className="text-sm font-semibold text-primary">{agent.reputationScore.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Rating</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2">
            <div className="text-sm font-semibold text-primary">{agent.totalTransactions}</div>
            <div className="text-xs text-muted-foreground">Transactions</div>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2">
            <div className="text-sm font-semibold text-primary flex items-center justify-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {agent.successRate.toFixed(0)}%
            </div>
            <div className="text-xs text-muted-foreground">Success</div>
          </div>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="pt-3 border-t border-border/40">
          <Link href={`/agents/${agent.id}`} className="w-full">
            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              View Details
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
}


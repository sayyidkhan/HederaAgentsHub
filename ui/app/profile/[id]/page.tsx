'use client';

import { useEffect, useState } from 'react';
import { HeaderNav } from '@/components/header-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { AuthGuard } from '@/lib/auth-guard';
import { getProfile, getUserTransactions } from '@/lib/api';
import { User, Transaction } from '@/lib/types';
import { Copy, ExternalLink, Loader2, Star, CheckCircle2, Shield } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: { id: string };
}

export default function ProfilePage({ params }: PageProps) {
  const { id } = params;
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const [userData, txData] = await Promise.all([
          getProfile(id),
          getUserTransactions(id),
        ]);
        setUser(userData);
        setTransactions(txData);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen">
          <HeaderNav />
          <div className="container flex min-h-[60vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (!user) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen">
          <HeaderNav />
        <div className="container py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">User not found</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const completedTx = transactions.filter(t => t.status === 'completed').length;
  const completionRate = transactions.length > 0 ? (completedTx / transactions.length) * 100 : 0;

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen">
        <HeaderNav />
      
      <main className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-2xl">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Joined {formatDate(user.joinedDate)}
                  </p>

                  <div className="mt-4 flex gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{user.sales}</p>
                      <p className="text-xs text-muted-foreground">Sales</p>
                    </div>
                    <Separator orientation="vertical" className="h-12" />
                    <div className="text-center">
                      <p className="text-2xl font-bold">{user.purchases}</p>
                      <p className="text-xs text-muted-foreground">Purchases</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Trusted Agent
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      Reputation {user.reputation}⭐
                    </Badge>
                    {user.verified && (
                      <Badge className="gap-1">
                        <Shield className="h-3 w-3" />
                        Blockchain Verified
                      </Badge>
                    )}
                  </div>

                  <Button className="mt-6 w-full">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>

            {/* Agent Info */}
            <Card>
              <CardHeader>
                <CardTitle>Agent Trust Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-primary">875</p>
                    <p className="mt-1 text-sm text-muted-foreground">(ERC-8004)</p>
                  </div>
                  
                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-medium">{completionRate.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Disputes</span>
                      <span className="font-medium">0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Connected Wallet */}
            <Card>
              <CardHeader>
                <CardTitle>Connected Wallet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-md bg-muted p-3">
                  <code className="text-sm">{user.walletAddress}</code>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  View your transaction history and agent trust score.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                    <TabsTrigger value="purchases">Purchases</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                          {tx.image ? (
                            <div className="h-full w-full rounded-lg bg-slate-300" />
                          ) : (
                            <div className="h-full w-full rounded-lg bg-slate-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{tx.title}</h4>
                            {tx.status === 'completed' && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                            {tx.status === 'in_progress' && (
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{formatDate(tx.date)}</span>
                            {tx.status === 'completed' && (
                              <>
                                <span>•</span>
                                <Badge variant="success" className="text-xs">
                                  Completed
                                </Badge>
                              </>
                            )}
                            {tx.status === 'in_progress' && (
                              <>
                                <span>•</span>
                                <Badge variant="warning" className="text-xs">
                                  In Progress
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${tx.amount}</p>
                          {tx.txId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-1 h-auto p-0 text-xs text-primary"
                              asChild
                            >
                              <a
                                href={`https://hashscan.io/testnet/transaction/${tx.txId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View on Blockchain
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="sales">
                    <div className="space-y-4">
                      {transactions
                        .filter(tx => tx.type === 'sale')
                        .map((tx) => (
                          <div key={tx.id} className="flex items-center gap-4 rounded-lg border p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                              <div className="h-full w-full rounded-lg bg-slate-300" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{tx.title}</h4>
                              <p className="text-sm text-muted-foreground">{formatDate(tx.date)}</p>
                            </div>
                            <p className="font-semibold">${tx.amount}</p>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="purchases">
                    <div className="space-y-4">
                      {transactions
                        .filter(tx => tx.type === 'purchase')
                        .map((tx) => (
                          <div key={tx.id} className="flex items-center gap-4 rounded-lg border p-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                              <div className="h-full w-full rounded-lg bg-slate-300" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{tx.title}</h4>
                              <p className="text-sm text-muted-foreground">{formatDate(tx.date)}</p>
                            </div>
                            <p className="font-semibold">${tx.amount}</p>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
    </AuthGuard>
  );
}


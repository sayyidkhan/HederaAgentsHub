'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Agent {
  agentId: string;
  name: string;
  purpose: string;
  capabilities: string[];
  evmAddress: string;
  topicId: string;
  ownerWallet?: string;
  createdAt?: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accountId, setAccountId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    capabilities: '',
  });

  useEffect(() => {
    // Get account ID from localStorage
    const storedAccountId = localStorage.getItem('demo_account_id');
    if (storedAccountId) {
      setAccountId(storedAccountId);
      fetchAgents(storedAccountId);
    } else {
      setError('No wallet connected. Please connect your wallet first.');
      setLoading(false);
    }
  }, []);

  const fetchAgents = async (walletAddress: string) => {
    setLoading(true);
    setError('');

    try {
      // Get credentials from localStorage
      const accountId = localStorage.getItem('demo_account_id') || '';
      const privateKey = localStorage.getItem('demo_private_key') || '';
      
      const url = new URL('http://localhost:8080/api/agents/metadata');
      url.searchParams.append('walletAddress', walletAddress);
      url.searchParams.append('accountId', accountId);
      url.searchParams.append('privateKey', privateKey);
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Agents data:', data);

      if (data.success && data.agents) {
        setAgents(data.agents);
      } else {
        setAgents([]);
      }
    } catch (err: any) {
      console.error('Error fetching agents:', err);
      setError(err.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const refreshAgents = () => {
    if (accountId) {
      fetchAgents(accountId);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const capabilities = formData.capabilities
        .split(',')
        .map(cap => cap.trim())
        .filter(cap => cap.length > 0);

      // Get credentials from localStorage
      const storedAccountId = localStorage.getItem('demo_account_id') || '';
      const storedPrivateKey = localStorage.getItem('demo_private_key') || '';

      const response = await fetch('http://localhost:8080/api/agents/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          purpose: formData.purpose,
          capabilities,
          ownerWallet: accountId,
          accountId: storedAccountId,
          privateKey: storedPrivateKey,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create agent');
      }

      console.log('✅ Agent created:', data);
      alert(`Agent created successfully!\n\nAgent ID: ${data.agentId}\nTopic: ${data.topicId}`);

      // Reset form and close modal
      setFormData({ name: '', purpose: '', capabilities: '' });
      setShowModal(false);

      // Refresh agents list
      refreshAgents();
    } catch (err: any) {
      console.error('Error creating agent:', err);
      alert(`Failed to create agent: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              My Agents
            </h1>
            {accountId ? (
              <a
                href={`https://hashscan.io/testnet/account/${accountId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-white transition-colors inline-flex items-center gap-2"
              >
                Wallet: {accountId}
                <span className="text-sm">🔗</span>
              </a>
            ) : (
              <p className="text-purple-200">No wallet connected</p>
            )}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              ➕ Create Agent
            </button>
            <button
              onClick={refreshAgents}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              🔄 Refresh
            </button>
            <Link
              href="/"
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading agents...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              {!accountId && (
                <Link
                  href="/"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Connect Wallet
                </Link>
              )}
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🤖</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Agents Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't created any agents yet. Create your first agent to get started!
              </p>
              <a
                href="http://localhost:8080/api-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                View API Docs →
              </a>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {agents.length} Agent{agents.length !== 1 ? 's' : ''} Found
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {agents.map((agent) => (
                  <div
                    key={agent.agentId}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {agent.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-mono">
                          {agent.agentId}
                        </p>
                      </div>
                      <div className="text-3xl">🤖</div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {agent.purpose}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Capabilities</p>
                        <div className="flex flex-wrap gap-1">
                          {agent.capabilities.map((cap, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">EVM Address</p>
                        <p className="text-xs font-mono text-gray-700 break-all">
                          {agent.evmAddress}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">Topic ID</p>
                        <a
                          href={`https://hashscan.io/testnet/topic/${agent.topicId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-purple-600 hover:underline"
                        >
                          {agent.topicId} →
                        </a>
                      </div>

                      {agent.createdAt && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Created</p>
                          <p className="text-xs text-gray-700">
                            {new Date(agent.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center text-purple-200 text-sm">
          <p>
            API Server: <span className="font-mono">http://localhost:8080</span>
          </p>
          <p className="mt-2">
            <a
              href="http://localhost:8080/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 hover:underline"
            >
              View API Documentation →
            </a>
          </p>
        </div>
      </div>

      {/* Create Agent Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Create New Agent</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateAgent} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Agent Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Customer Support Agent"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Purpose / System Prompt *
                  </label>
                  <textarea
                    required
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    placeholder="Describe what this agent does..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ 
                      ...formData, 
                      purpose: 'I am a bot that is supposed to buy an iPhone for 1000 SGD and buy within 30 days' 
                    })}
                    className="mt-2 text-xs text-purple-600 hover:text-purple-700 font-medium"
                  >
                    💡 Use example prompt
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Capabilities *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.capabilities}
                    onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
                    placeholder="e.g., chat, analysis, automation"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-500">Quick add:</span>
                    {['chat', 'analysis', 'automation', 'research', 'trading', 'monitoring'].map((cap) => (
                      <button
                        key={cap}
                        type="button"
                        onClick={() => {
                          const current = formData.capabilities;
                          const caps = current ? current.split(',').map(c => c.trim()) : [];
                          if (!caps.includes(cap)) {
                            setFormData({ 
                              ...formData, 
                              capabilities: current ? `${current}, ${cap}` : cap 
                            });
                          }
                        }}
                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200 transition-colors"
                      >
                        + {cap}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <p className="text-xs text-purple-800 mb-1">
                    <strong>Owner Wallet:</strong>
                  </p>
                  <p className="text-xs font-mono text-purple-700">{accountId}</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {creating ? '⏳ Creating...' : '✨ Create Agent'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={creating}
                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

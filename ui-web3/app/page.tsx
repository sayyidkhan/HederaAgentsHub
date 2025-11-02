'use client';

import { useState } from 'react';
import { getAllWallets, getWalletById, type DemoWallet } from '../lib/walletConfig';

// Extend Window interface for HashPack
declare global {
  interface Window {
    hashpack?: any;
  }
}

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [accountId, setAccountId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState('wallet-1');
  const [availableWallets] = useState<DemoWallet[]>(getAllWallets());

  const debugHashPack = () => {
    console.log('=== HashPack Debug ===');
    console.log('window.hashpack:', (window as any).hashpack);
    console.log('window.HashPack:', (window as any).HashPack);
    console.log('All window properties with "hash":', Object.keys(window).filter(k => k.toLowerCase().includes('hash')));
    
    const hashpack = (window as any).hashpack || (window as any).HashPack;
    if (hashpack) {
      console.log('HashPack object:', hashpack);
      console.log('HashPack methods:', Object.keys(hashpack));
      console.log('HashPack type:', typeof hashpack);
    } else {
      console.log('❌ HashPack not found on window object');
      alert('HashPack not detected!\n\nMake sure:\n1. HashPack extension is installed\n2. You refreshed the page after installing\n3. HashPack is unlocked');
    }
  };

  const connectWallet = async () => {
    const wallet = getWalletById(selectedWalletId);
    
    if (!wallet) {
      alert('Wallet not found!');
      return;
    }
    
    setAccountId(wallet.accountId);
    setWalletConnected(true);
    
    console.log('✅ Demo wallet connected!');
    console.log('Wallet:', wallet.name);
    console.log('Account ID:', wallet.accountId);
    console.log('EVM Address:', wallet.evmAddress);
    console.log('Private Key:', wallet.privateKey);
    
    // Store in localStorage for later use
    localStorage.setItem('demo_account_id', wallet.accountId);
    localStorage.setItem('demo_evm_address', wallet.evmAddress);
    localStorage.setItem('demo_private_key', wallet.privateKey);
    localStorage.setItem('demo_wallet_name', wallet.name);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setAccountId('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            HederaAgentsHub
          </h1>
          <p className="text-xl text-purple-200">
            Connect your HashPack wallet to get started
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {!walletConnected ? (
            /* Not Connected */
            <div className="text-center">
              <div className="mb-8">
                <svg
                  className="w-24 h-24 mx-auto text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Connect Demo Wallet
              </h2>
              <p className="text-gray-600 mb-6">
                Select a wallet and connect with demo credentials
              </p>

              {/* Wallet Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Demo Wallet
                </label>
                <select
                  value={selectedWalletId}
                  onChange={(e) => setSelectedWalletId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                >
                  {availableWallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name} - {wallet.accountId}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-gray-500">
                  {availableWallets.find(w => w.id === selectedWalletId)?.description}
                </p>
              </div>

              <button
                onClick={connectWallet}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                🚀 Connect Demo Wallet
              </button>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 mb-2">
                  ✅ Demo Mode Active
                </p>
                <p className="text-xs text-green-700 font-mono">
                  Selected: {availableWallets.find(w => w.id === selectedWalletId)?.accountId}
                </p>
              </div>

              <div className="mt-8 text-sm text-gray-500">
                <p>Don't have HashPack?</p>
                <a
                  href="https://www.hashpack.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:underline"
                >
                  Download HashPack Wallet →
                </a>
              </div>
            </div>
          ) : (
            /* Connected */
            <div>
              <div className="flex items-center justify-between mb-8 pb-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Wallet Connected
                  </h2>
                  <p className="text-gray-600">
                    You're connected to Hedera testnet
                  </p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>

              {/* Wallet Info */}
              <div className="space-y-4 mb-8">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-semibold mb-1">
                    Account ID
                  </p>
                  <p className="text-lg font-mono text-gray-800">
                    {accountId}
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-semibold mb-1">
                    EVM Address
                  </p>
                  <p className="text-sm font-mono text-gray-800 break-all">
                    {localStorage.getItem('demo_evm_address') || '0x98d46dda75a216f94bf9784a6665a4e3821da3d9'}
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-semibold mb-1">
                    Network
                  </p>
                  <p className="text-lg text-gray-800 capitalize">
                    Testnet
                  </p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-semibold mb-1">
                    Mode
                  </p>
                  <p className="text-sm text-gray-800">
                    🎮 Demo Mode (Hardcoded)
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <a
                  href="/agents"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-colors text-center"
                >
                  🤖 View My Agents
                </a>

                <a
                  href={`https://hashscan.io/testnet/account/${accountId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors text-center"
                >
                  View on HashScan →
                </a>

                <a
                  href="http://localhost:8080/api-docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-lg transition-colors text-center"
                >
                  View API Docs →
                </a>
              </div>

              {/* Next Steps */}
              <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  ✅ Ready to Authenticate!
                </h3>
                <p className="text-green-700 text-sm mb-3">
                  Next steps:
                </p>
                <ul className="text-green-700 text-sm space-y-1 list-disc list-inside">
                  <li>Sign authentication message</li>
                  <li>Get JWT token from /api/auth/wallet</li>
                  <li>Create agents via /api/agents/create</li>
                  <li>View your agents on blockchain</li>
                </ul>
              </div>
            </div>
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
              className="hover:text-white underline"
            >
              View API Documentation →
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

import walletsData from '../config/wallets.json';

export interface DemoWallet {
  id: string;
  name: string;
  accountId: string;
  evmAddress: string;
  privateKey: string;
  network: string;
  description: string;
}

export interface WalletConfig {
  demoWallets: DemoWallet[];
  defaultWallet: string;
}

export const walletConfig: WalletConfig = walletsData;

export function getWalletById(id: string): DemoWallet | undefined {
  return walletConfig.demoWallets.find(wallet => wallet.id === id);
}

export function getDefaultWallet(): DemoWallet {
  const defaultWallet = getWalletById(walletConfig.defaultWallet);
  if (!defaultWallet) {
    throw new Error('Default wallet not found');
  }
  return defaultWallet;
}

export function getAllWallets(): DemoWallet[] {
  return walletConfig.demoWallets;
}

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { WagmiConfig, createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a query client for @tanstack/react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30 * 1000, // 30 seconds
    },
  },
});

// Create wagmi config using the latest v2 pattern
const config = createConfig({
  chains: [baseSepolia, base], // Prioritize Base Sepolia for development
  transports: {
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org'),
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
  },
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'GENEForge',
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'DEFAULT_PROJECT_ID',
      metadata: {
        name: 'GENEForge',
        description: 'Blockchain Genomics Platform on Base',
        url: 'https://geneforge.io',
        icons: ['https://geneforge.io/logo.png']
      },
    }),
  ],
});

// Register config type for better type inference
declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

// WagmiProvider component
export default function WagmiProvider({ children }: { children: ReactNode }) {
  // Handle server-side rendering
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Debug wallet connectors
    console.log('Available wallet connectors in WagmiProvider:');
    console.log('MetaMask available:', typeof window !== 'undefined' && window.ethereum?.isMetaMask);
    console.log('Coinbase Wallet available:', typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet);
    
    // Log chain information
    console.log('Configured chains:', [baseSepolia.id, base.id]);
    console.log('Base Sepolia chain ID:', baseSepolia.id);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        {mounted ? children : null}
      </WagmiConfig>
    </QueryClientProvider>
  );
} 
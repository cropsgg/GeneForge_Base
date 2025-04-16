'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { truncateAddress } from '@/lib/utils';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import Image from 'next/image';

// Wallet logos
const WALLET_LOGOS: Record<string, string> = {
  'MetaMask': '/metamask-logo.svg',
  'Coinbase Wallet': '/coinbase-logo.svg'
};

export function NavbarConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, status } = useConnect();
  const { disconnect } = useDisconnect();
  
  // State for dropdown menu
  const [open, setOpen] = useState(false);
  
  // State to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    
    // Debug log all available connectors
    if (connectors.length > 0) {
      console.log('Available connectors:', connectors.length);
      console.log('Connector names:', connectors.map(c => c.name));
    } else {
      console.warn('No connectors available from wagmi');
    }
  }, [connectors]);

  // Log wallet connection errors
  useEffect(() => {
    if (error) {
      console.error('Wallet Connection Error:', error.message);
    }
  }, [error]);

  // Always show at least the wallet options if not connected
  const availableConnectors = isClient 
    ? connectors.filter(connector => 
        connector.name === 'MetaMask' || 
        connector.name === 'Coinbase Wallet')
    : [];

  return (
    <div className="relative">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setOpen(prev => !prev)}>
            {isClient && isConnected && address ? truncateAddress(address) : "Connect Wallet"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-[200px] z-50"
          sideOffset={4}
          forceMount={true}
        >
          {isClient && isConnected && address ? (
            <DropdownMenuItem
              onClick={() => disconnect()}
              className="cursor-pointer"
            >
              Disconnect
            </DropdownMenuItem>
          ) : (
            <>
              {availableConnectors.length > 0 ? (
                availableConnectors.map((connector, index) => {
                  const walletName = connector.name;
                  const logoPath = WALLET_LOGOS[walletName] || "";
                  const isPending = status === 'pending';
                  
                  return (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => {
                        connect({ connector });
                        setOpen(false);
                      }}
                      className="cursor-pointer flex items-center gap-2"
                      disabled={isPending}
                    >
                      {logoPath && (
                        <Image
                          src={logoPath}
                          alt={`${walletName} logo`}
                          width={20}
                          height={20}
                        />
                      )}
                      {walletName}
                      {isPending && ' (connecting...)'}
                    </DropdownMenuItem>
                  );
                })
              ) : (
                <DropdownMenuItem disabled>
                  No wallet connectors available
                </DropdownMenuItem>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Connection error message */}
      {error && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-xs flex items-center space-x-2 w-[200px] z-50">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
} 
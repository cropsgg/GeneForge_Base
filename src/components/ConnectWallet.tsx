'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';

// Wallet logos
const WALLET_LOGOS: Record<string, string> = {
  'MetaMask': '/metamask-logo.svg',
  'Coinbase Wallet': '/coinbase-logo.svg'
};

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error, status } = useConnect();
  const { disconnect } = useDisconnect();
  const [showConfetti, setShowConfetti] = useState(false);

  // State to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    
    // Debug log connectors
    if (connectors.length > 0) {
      console.log('ConnectWallet component connectors available:', connectors.length);
      console.log('Connector names:', connectors.map(c => c.name));
    }
  }, [connectors]);

  // When connection status changes
  useEffect(() => {
    if (isConnected && isClient) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  }, [isConnected, isClient]);

  // Set error message when there's a connection error
  useEffect(() => {
    if (error) {
      console.error('Wallet Connection Error:', error.message);
    }
  }, [error]);
  
  // Always show wallet options regardless of ready state
  const availableConnectors = isClient 
    ? connectors.filter(connector => 
        connector.name === 'MetaMask' || 
        connector.name === 'Coinbase Wallet')
    : [];

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
      {isClient && isConnected ? (
        <div className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium text-green-600 dark:text-green-400"
          >
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </motion.div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => disconnect()}
            className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/50 dark:border-red-700 dark:text-red-500 dark:hover:text-red-400"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <div className="flex flex-col space-y-3 w-full">
          {availableConnectors.length > 0 ? (
            availableConnectors.map((connector, index) => {
              // Check if this specific connector is pending
              const isPending = status === 'pending';
              const walletName = connector.name;
              const logoPath = WALLET_LOGOS[walletName] || "";
              
              return (
                <Button
                  key={index}
                  onClick={() => connect({ connector })}
                  // Disable if pending
                  disabled={isPending}
                  variant="default"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {logoPath && (
                    <Image
                      src={logoPath}
                      alt={`${walletName} logo`}
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                  )}
                  Connect {connector.name}
                  {/* Show connecting text if pending */}
                  {isPending && ' (connecting...)'}
                </Button>
              );
            })
          ) : (
            <Button disabled variant="default" className="w-full">
                No Wallet Connectors Available
            </Button>
          )}
          
          {!isClient && (
             <Button disabled variant="default" className="w-full">
                 Loading Connectors...
             </Button>
          )}
        </div>
      )}

      {/* Connection error message */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 w-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-xs flex items-center space-x-2"
        >
          <AlertCircle className="h-4 w-4"/>
          <span>{error.message}</span>
        </motion.div>
      )}

      {/* Confetti animation */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg p-8 flex flex-col items-center"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: 1, 
                rotate: [0, 10, -10, 10, 0],
                y: [0, -20, 0]
              }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="w-24 h-24 mb-4 relative"
                animate={{ 
                  rotate: 360,
                }}
                transition={{ duration: 1, repeat: 1 }}
              >
                <svg 
                  className="w-full h-full" 
                  viewBox="0 0 100 100" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="45" stroke="#3b82f6" strokeWidth="10" />
                  <motion.path 
                    d="M30 50L45 65L75 35" 
                    stroke="#3b82f6" 
                    strokeWidth="10" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  />
                </svg>
                
                {/* Confetti-like particles */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                      backgroundColor: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#10b981',
                    }}
                    initial={{ x: 0, y: 0 }}
                    animate={{
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 200,
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </motion.div>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-800 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Wallet Connected!
              </motion.h2>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                You&apos;re ready to use the gene data platform
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
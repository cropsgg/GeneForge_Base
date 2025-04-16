import { createPublicClient, createWalletClient, http, custom } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { keccak256, stringToHex, parseEther, Hex, Address } from 'viem';

// Import the contract ABIs for GENEForge genomics platform
import SampleProvenanceABI from './abis/SampleProvenance.json';
import ExperimentalDataAuditABI from './abis/ExperimentalDataAudit.json';
import AccessControlABI from './abis/AccessControl.json';
import WorkflowAutomationABI from './abis/WorkflowAutomation.json';
import IntellectualPropertyABI from './abis/IntellectualProperty.json';

// Contract addresses configuration
interface ContractAddresses {
  sampleProvenance: string;
  experimentalDataAudit: string;
  accessControl: string;
  workflowAutomation: string;
  intellectualProperty: string;
}

// Default placeholder addresses
const defaultAddresses: ContractAddresses = {
  sampleProvenance: '0x97212557fdfffd409e39ef5a9fb6bbb8c372ab99',
  experimentalDataAudit: '0xd4c1c9e965dc6bcf2d398840c70acb34e940b978',
  accessControl: '0xd98078eb6de460d5883566f1fe4ae43fe89ae77b',
  workflowAutomation: '0x2a7ec664a8d61cdb49f1b9de2b19a9517e68b62a',
  intellectualProperty: '0xacc3012caa93ec7141535f28aab4aa9a47b30edd'
};

// Use default addresses directly
let addresses: ContractAddresses = { ...defaultAddresses };

// Only try to load addresses in browser environment
if (typeof window !== 'undefined') {
  try {
    // Using dynamic import to avoid require() style imports
    import('./contract-addresses.json').then(module => {
      addresses = { ...defaultAddresses, ...module.default };
    }).catch(err => {
      console.warn('Could not load contract addresses, using default addresses');
    });
  } catch (importError) {
    console.warn('Could not load contract addresses, using default addresses');
  }
}

// The chain where contracts are deployed
const CONTRACT_CHAIN = baseSepolia; // Using Base Sepolia testnet for development/testing

// Contract ABI mapping
const contractABIs: Record<keyof ContractAddresses, unknown[]> = {
  sampleProvenance: SampleProvenanceABI,
  experimentalDataAudit: ExperimentalDataAuditABI,
  accessControl: AccessControlABI,
  workflowAutomation: WorkflowAutomationABI,
  intellectualProperty: IntellectualPropertyABI
};

// Function to check if a function exists in the ABI
function doesFunctionExistInAbi(abi: unknown[], functionName: string): boolean {
  for (const item of abi) {
    if (
      typeof item === 'object' && 
      item !== null && 
      'type' in item && 
      'name' in item && 
      item.type === 'function' && 
      item.name === functionName
    ) {
      return true;
    }
  }
  return false;
}

// Get contract info (abi and address)
function getContract(contractName: keyof ContractAddresses) {
  return {
    abi: contractABIs[contractName],
    address: addresses[contractName]
  };
}

// Create a public client for reading from contracts
const publicClient = createPublicClient({
  chain: CONTRACT_CHAIN,
  transport: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org')
});

// Helper to get wallet client and account
async function getWalletClient() {
  // Check for browser environment
  if (typeof window === 'undefined') {
    throw new Error('Not in browser environment');
  }

  try {
    // Define ethereum property on window for TypeScript
    interface WindowWithEthereum extends Window {
      ethereum?: {
        isMetaMask?: boolean;
        isCoinbaseWallet?: boolean;
        request: (args: Record<string, unknown>) => Promise<unknown>;
        chainId?: string;
      };
    }
    
    const windowWithEthereum = window as WindowWithEthereum;
    
    if (windowWithEthereum.ethereum) {
      // Check and switch chain if needed
      try {
        // Get the current chain ID from the wallet
        const currentChainIdHex = await windowWithEthereum.ethereum.request({ 
          method: 'eth_chainId' 
        });
        const currentChainId = parseInt(currentChainIdHex as string, 16);
        console.log(`Current wallet chain: ${currentChainId}, Target chain: ${CONTRACT_CHAIN.id}`);
        
        // If the current chain doesn't match our target chain, try to switch
        if (currentChainId !== CONTRACT_CHAIN.id) {
          console.log(`Switching chain from ${currentChainId} to ${CONTRACT_CHAIN.id} (${CONTRACT_CHAIN.name})`);
          
          try {
            // Request the wallet to switch to our chain
            await windowWithEthereum.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${CONTRACT_CHAIN.id.toString(16)}` }],
            });
            console.log(`Successfully switched to ${CONTRACT_CHAIN.name}`);
          } catch (switchError: unknown) {
            console.error('Error switching chain:', switchError);
            
            // Check if it's the expected error type
            const error = switchError as { code?: number; message?: string };
            
            // If the chain hasn't been added to the wallet yet
            if (error.code === 4902) {
              try {
                await windowWithEthereum.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: `0x${CONTRACT_CHAIN.id.toString(16)}`,
                      chainName: CONTRACT_CHAIN.name,
                      nativeCurrency: {
                        name: 'Ether',
                        symbol: 'ETH',
                        decimals: 18,
                      },
                      rpcUrls: ['https://sepolia.base.org'],
                      blockExplorerUrls: ['https://sepolia.basescan.org'],
                    },
                  ],
                });
              } catch (addError) {
                console.error('Error adding chain to wallet:', addError);
                throw new Error(`Please add the ${CONTRACT_CHAIN.name} network to your wallet manually. Chain ID: ${CONTRACT_CHAIN.id}`);
              }
            } else if (error.code === 4001) {
              throw new Error(`Please approve switching to the ${CONTRACT_CHAIN.name} network in your wallet to proceed.`);
            } else {
              throw new Error(`Unable to switch to ${CONTRACT_CHAIN.name} network. Please switch networks manually in your wallet.`);
            }
          }
        }
      } catch (chainError) {
        console.error('Error checking/switching chain:', chainError);
        throw chainError;
      }
      
      // Now create the wallet client with the correct chain
      const walletClient = createWalletClient({
        chain: CONTRACT_CHAIN,
        transport: custom(windowWithEthereum.ethereum)
      });
      
      try {
        // Get the account after ensuring correct chain
    const [account] = await walletClient.getAddresses();
    
    if (!account) {
          throw new Error('No wallet account connected. Please connect your wallet in the browser extension and try again.');
        }
        
        return { walletClient, account };
      } catch (accountError) {
        console.error('Error accessing wallet accounts:', accountError);
        throw new Error('Could not access your wallet accounts. Please ensure your wallet is unlocked and this site has permission to access your accounts.');
      }
    } else {
      // No wallet found
      let errorMessage = 'No wallet provider found. ';
      
      // Detect if we're on mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        errorMessage += 'Please use a mobile crypto wallet browser like MetaMask Mobile or Coinbase Wallet.';
      } else {
        errorMessage += 'Please install MetaMask or Coinbase Wallet browser extension and refresh the page.';
      }
      
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error getting wallet client:', error);
    // Re-throw with a more user-friendly message if it's not already a custom error
    if (error instanceof Error && 
        !error.message.includes('Please install MetaMask') && 
        !error.message.includes('No wallet account connected')) {
      throw new Error('Could not connect to wallet. Please check your wallet connection and try again.');
    }
    throw error;
  }
}

// Generic read function
async function readContract<T>(
  contractName: keyof ContractAddresses,
  functionName: string,
  args: unknown[] = []
): Promise<T> {
  try {
    if (!publicClient) {
      throw new Error('Public client not available');
    }
    
    const { abi, address } = getContract(contractName);
    
    // Add verification that the function exists in the ABI
    const functionExists = doesFunctionExistInAbi(abi, functionName);
    
    if (!functionExists) {
      console.error(`Function "${functionName}" not found in ${contractName} ABI`);
      throw new Error(`Function "${functionName}" not found in contract ABI. Check your contract deployment and ABI definition.`);
    }
    
    if (address === defaultAddresses[contractName]) {
      console.warn(`Using placeholder address for ${contractName}. Make sure the contract is properly deployed.`);
    }
    
    console.log(`Reading from ${contractName}.${functionName} with args:`, args);
    const data = await publicClient.readContract({
      address: address as `0x${string}`,
      abi,
      functionName,
      args,
    }) as T;
    
    return data;
  } catch (error) {
    console.error(`Error reading from ${contractName}.${functionName}:`, error);
    
    // Enhanced error reporting
    if (error instanceof Error) {
      if (error.message.includes('could not be found')) {
        throw new Error(`Contract function "${functionName}" not found. Please check the ABI and contract deployment.`);
      } else if (error.message.includes('invalid address')) {
        throw new Error(`Invalid contract address for ${contractName}. Please verify the contract deployment.`);
      }
    }
    
    throw error;
  }
}

// Generic write function
async function writeContract(
  contractName: keyof ContractAddresses,
  functionName: string,
  args: unknown[] = []
): Promise<string> {
  try {
    const { walletClient, account } = await getWalletClient();
    const { abi, address } = getContract(contractName);
    
    // Add verification that the function exists in the ABI
    const functionExists = doesFunctionExistInAbi(abi, functionName);
    
    if (!functionExists) {
      console.error(`Function "${functionName}" not found in ${contractName} ABI`);
      throw new Error(`Function "${functionName}" not found in contract ABI. Check your contract deployment and ABI definition.`);
    }
    
    if (address === defaultAddresses[contractName]) {
      console.warn(`Using placeholder address for ${contractName}. Make sure the contract is properly deployed.`);
    }
    
    console.log(`Writing to ${contractName}.${functionName} with args:`, args);
    const hash = await walletClient.writeContract({
      account,
      address: address as Address,
      abi,
      functionName,
      args,
    });
    
    return hash;
  } catch (error) {
    console.error(`Error writing to ${contractName}.${functionName}:`, error);
    
    // Enhanced error reporting
    if (error instanceof Error) {
      if (error.message.includes('user rejected transaction') || 
          error.message.includes('User rejected the request') ||
          error.message.includes('rejected by user') ||
          error.message.includes('user denied') ||
          error.message.includes('transaction cancelled')) {
      throw new Error("Transaction rejected in wallet.");
      } else if (error.message.includes('not found on ABI')) {
        throw new Error(`Contract function "${functionName}" not found. Please check the ABI and contract deployment.`);
      } else if (error.message.includes('invalid address')) {
        throw new Error(`Invalid contract address for ${contractName}. Please verify the contract deployment.`);
      }
    }
    
    throw error;
  }
}

// Specific contract functions using the generic helpers

// SampleProvenance functions - for genetic samples

/**
 * Register a new genetic sample in the blockchain
 */
export async function registerGenomeSample(
  sampleId: string,
  sampleType: string,
  description: string,
  importance: string
): Promise<string> {
  return writeContract(
    'sampleProvenance',
    'registerSample',
    [sampleId, sampleType, description, importance]
  );
}

// Alias for registerGenomeSample to maintain backward compatibility
export const registerSample = registerGenomeSample;

/**
 * Retrieve a genetic sample's details by ID
 */
export async function getGenomeSample(sampleId: string): Promise<[string, string, string, string, string, bigint]> {
  return readContract(
    'sampleProvenance',
    'getSample',
    [sampleId]
  );
}

/**
 * Get the total count of genomic samples
 */
export async function getGenomeSampleCount(): Promise<number> {
  const count = await readContract<bigint>(
    'sampleProvenance',
    'getSampleCount'
  );
    return Number(count);
}

// Specimen functions - for genetic specimens

/**
 * Register a new genetic specimen
 */
export async function registerGeneticSpecimen(
  sampleId: string,
  specimenType: string,
  description: string,
  importance: string
): Promise<string> {
  return writeContract(
    'sampleProvenance',
    'registerSample',
    [sampleId, specimenType, description, importance]
  );
}

/**
 * Get the total count of specimens
 */
export async function getGeneticSpecimenCount(): Promise<number> {
  const count = await readContract<bigint>(
    'sampleProvenance',
    'getSampleCount'
  );
  return Number(count);
}

/**
 * Fetch details of a specific genetic specimen
 */
export async function fetchGeneticSpecimen(id: bigint): Promise<any> {
  return readContract(
    'sampleProvenance',
    'getSample',
    [id]
  );
}

// Experiment tracking functions

/**
 * Register a new CRISPR experiment - fallback to registerSample for demo purposes
 * Note: In a production environment, this would call a dedicated experiment registration function
 */
export async function registerCRISPRExperiment(
  specimenId: bigint,
  location: string,
  notes: string
): Promise<string> {
  // Since the contract doesn't have a dedicated experiment function yet,
  // we'll use registerSample as a fallback for the demo
  const sampleId = `EXP-${specimenId.toString()}`;
  const experimentType = "CRISPR";
  const description = `Location: ${location}. Notes: ${notes}`;
  const importance = "Medium"; // Default importance
  
  return writeContract(
    'sampleProvenance',
    'registerSample',
    [sampleId, experimentType, description, importance]
  );
}

/**
 * Get count of experiments (falls back to sample count for demo)
 */
export async function getCRISPRExperimentCount(): Promise<number> {
  // Fallback to sample count for the demo
  const count = await readContract<bigint>(
    'sampleProvenance',
    'getSampleCount'
  );
    return Number(count);
}

/**
 * Fetch details of a specific experiment (falls back to getSample with EXP- prefix)
 */
export async function fetchCRISPRExperiment(id: bigint): Promise<any> {
  // Fallback to getSample for the demo
  return readContract(
    'sampleProvenance',
    'getSample',
    [`EXP-${id.toString()}`]
  );
}

// Evidence/Results functions

/**
 * Register research evidence or results
 */
export async function registerResearchEvidence(
  specimenId: bigint,
  evidenceType: string,
  evidenceHash: string
): Promise<string> {
  return writeContract(
    'experimentalDataAudit',
    'registerEvidence',
    [specimenId, evidenceType, evidenceHash]
  );
}

/**
 * Get count of evidence records
 */
export async function getResearchEvidenceCount(): Promise<number> {
  const count = await readContract<bigint>(
    'experimentalDataAudit',
    'getEvidenceCount'
  );
    return Number(count);
}

/**
 * Fetch specific evidence record
 */
export async function fetchResearchEvidence(id: bigint): Promise<any> {
  return readContract(
    'experimentalDataAudit',
    'getEvidence',
    [id]
  );
}

// Helper functions
function getRoleBytes(role: string): Hex {
  return keccak256(stringToHex(role));
}

function getWorkflowStatusValue(status: string): number {
  const statusMap: Record<string, number> = {
    "Collected": 0,
    "Processing": 1,
    "Analyzed": 2,
    "Published": 3,
    "Archived": 4
  };
  
  return statusMap[status] || 0;
}

// Access control functions for genetic data security

/**
 * Grant access role to a researcher or team member
 */
export async function grantResearcherAccess(role: string, targetAccount: string): Promise<string> {
    const roleBytes = getRoleBytes(role);
  return writeContract(
    'accessControl', 
    'grantRole',
    [roleBytes, targetAccount as `0x${string}`]
  );
}

// Workflow functions

/**
 * Update the workflow status of a genetic sample
 */
export async function updateGeneticSampleStatus(sampleId: string, status: string, notes: string): Promise<string> {
  const statusValue = getWorkflowStatusValue(status);
  return writeContract(
    'workflowAutomation',
    'updateSampleStatus',
    [sampleId, statusValue, notes]
  );
}

// Intellectual Property functions

/**
 * Register intellectual property related to genetic research
 */
export async function registerGeneticIP(
  title: string, 
  description: string, 
  ipType: string, 
  uri: string | undefined, 
  initialOwnersString: string
): Promise<string> {
  // Convert comma-separated list to array of addresses
  const initialOwners = initialOwnersString
      .split(',')
    .map(addr => addr.trim())
    .filter(addr => addr.startsWith('0x')) as `0x${string}`[];
  
  return writeContract(
    'intellectualProperty',
    'createIPRecord',
    [title, description, ipType, uri || "", initialOwners]
  );
}

// More functions for other contract interactions would be added here 
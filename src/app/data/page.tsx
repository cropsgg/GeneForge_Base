"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
/* DataForm is imported for potential future use */
// import { SamplesList } from "@/components/SamplesList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConnectWallet from "@/components/ConnectWallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertCircle, Loader2, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { registerGeneticSpecimen, registerCRISPRExperiment, grantResearcherAccess, updateGeneticSampleStatus, registerGeneticIP } from "@/contracts/contract-service";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { handleTransactionError } from "@/utils/error-handlers";

// Sample interfaces based on the contract schema
/* interface Specimen {
  id: bigint;
  recordedBy: string;
  specimenType: string;
  description: string;
  importance: string;
  timestamp: bigint;
}

interface Experiment {
  id: bigint;
  specimenId: bigint;
  location: string;
  handler: string;
  notes: string;
  timestamp: bigint;
}

interface Evidence {
  id: bigint;
  specimenId: bigint;
  evidenceType: string;
  evidenceHash: string;
  recordedBy: string;
  timestamp: bigint;
} */

// Define sample types for genomics
/* const SAMPLE_TYPES = [
  { value: "DNA", description: "Extracted DNA material" },
  { value: "RNA", description: "Extracted RNA material" },
  { value: "Blood", description: "Whole blood samples" },
  { value: "Tissue", description: "Tissue samples" },
  { value: "Cell", description: "Cell cultures or isolated cells" }
]; */

// Define sample importance levels
const IMPORTANCE_LEVELS = [
  { value: "Low", description: "Basic sample with standard research value" },
  { value: "Medium", description: "Notable sample with increased research potential" },
  { value: "High", description: "Rare sample with significant research value" },
  { value: "Critical", description: "Extremely valuable sample requiring highest security" }
];

// Define experiment types
/* const EXPERIMENT_TYPES = [
  { value: "Sequencing", description: "DNA/RNA sequencing experiments" },
  { value: "PCR", description: "Polymerase Chain Reaction" },
  { value: "CRISPR", description: "Gene editing using CRISPR/Cas9" },
  { value: "Expression", description: "Gene expression analysis" },
  { value: "Microarray", description: "DNA microarray analysis" }
]; */

// Define evidence types
/* const EVIDENCE_TYPES = [
  { value: "Image", description: "Gel electrophoresis or other visual data" },
  { value: "SequenceData", description: "Raw DNA/RNA sequence data files" },
  { value: "LabReport", description: "Formal laboratory reports" },
  { value: "Protocol", description: "Experimental protocols used" },
  { value: "Publication", description: "Published papers or articles" }
]; */

// Access roles
/* const ACCESS_ROLES = [
  { value: "Viewer", description: "Can only view genomic data" },
  { value: "Researcher", description: "Can view and conduct gene editing experiments" },
  { value: "Manager", description: "Can approve experiments and manage genetic samples" },
  { value: "Admin", description: "Full administrative rights to all genetic data" }
]; */

// Workflow statuses
/* const WORKFLOW_STATUSES = [
  { value: "Collected", description: "Genetic sample has been collected" },
  { value: "Processing", description: "Sample is being processed for sequencing" },
  { value: "Analyzed", description: "Genomic analysis has been completed" },
  { value: "Published", description: "Results have been published" },
  { value: "Archived", description: "Sample has been archived" }
]; */

// IP licensing options
/* const IP_OPTIONS = [
  { value: "Private", description: "Genetic research results are private with full IP rights" },
  { value: "Licensed", description: "Results available for licensed use by other labs" },
  { value: "Academic", description: "Free for academic/non-commercial genetic research" },
  { value: "Open", description: "Open source with attribution for wider scientific access" }
]; */

export default function DataPage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("samples");
  const { toast } = useToast();
  
  // Genomic samples state
  const [specimenId, setSpecimenId] = useState("");
  const [specimenType, setSpecimenType] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState("");
  const [isSubmittingSpecimen, setIsSubmittingSpecimen] = useState(false);
  
  // CRISPR experiments state
  const [experimentSpecimenId, setExperimentSpecimenId] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmittingExperiment, setIsSubmittingExperiment] = useState(false);
  
  // Access control state
  const [accessUserAddress, setAccessUserAddress] = useState("");
  // const [accessSampleId, setAccessSampleId] = useState(""); // Removing unused state but keeping declaration
  const [accessRole, setAccessRole] = useState("");
  const [isSubmittingAccess, setIsSubmittingAccess] = useState(false);
  
  // Workflow state
  const [workflowSampleId, setWorkflowSampleId] = useState("");
  const [workflowStatus, setWorkflowStatus] = useState("");
  const [workflowNotes, setWorkflowNotes] = useState("");
  const [isSubmittingWorkflow, setIsSubmittingWorkflow] = useState(false);
  
  // IP rights state
  const [ipTitle, setIpTitle] = useState("");
  const [ipType, setIpType] = useState("");
  const [ipDescription, setIpDescription] = useState("");
  const [ipUri, setIpUri] = useState("");
  const [ipInitialOwners, setIpInitialOwners] = useState("");
  const [isSubmittingIp, setIsSubmittingIp] = useState(false);

  // Add this state for storing transaction history
  const [transactionHistory, setTransactionHistory] = useState<Array<{hash: string, timestamp: number, description: string}>>([]);

  // Reset form states when tab changes
  useEffect(() => {
    setIsSubmittingSpecimen(false);
    setIsSubmittingExperiment(false);
    setIsSubmittingAccess(false);
    setIsSubmittingWorkflow(false);
    setIsSubmittingIp(false);
  }, [activeTab]);

  // Add this function in the component
  const addToTransactionHistory = (hash: string, description: string) => {
    const newTransaction = {
      hash,
      timestamp: Date.now(),
      description
    };
    
    // Add to state
    setTransactionHistory(prev => [newTransaction, ...prev]);
    
    // Also save to localStorage for persistence
    try {
      const existingHistory = JSON.parse(localStorage.getItem('txHistory') || '[]');
      const updatedHistory = [newTransaction, ...existingHistory].slice(0, 10); // Keep last 10 transactions
      localStorage.setItem('txHistory', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Error saving transaction history to localStorage', e);
    }
  };

  // Load transaction history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('txHistory');
      if (savedHistory) {
        setTransactionHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error('Error loading transaction history from localStorage', e);
    }
  }, []);

  // Handlers for genomic specimens
  const handleSpecimenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to register a genomic sample",
        variant: "destructive",
      });
      return;
    }

    if (!specimenId || !specimenType || !description || !importance) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields for the genetic sample",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingSpecimen(true);
    try {
      console.log("Submitting genetic sample to blockchain:", {
        specimenId, specimenType, description, importance
      });
      
      // Show switching notification
      toast({
        title: "Preparing Transaction",
        description: "Your wallet may prompt you to switch to the Base Sepolia testnet to proceed.",
        variant: "default",
      });
      
      const tx = await registerGeneticSpecimen(
        specimenId,
        specimenType,
        description,
        importance
      );
      
      console.log("Transaction successful:", tx);
      
      // Add to transaction history
      addToTransactionHistory(tx, `Registered Sample: ${specimenId}`);
      
      toast({
        title: "Genetic Sample Registered",
        description: `Transaction hash: ${tx.slice(0, 10)}...`,
        variant: "default",
      });
      
      // Show transaction details in console for reference
      console.log(`Full transaction hash: ${tx}`);
      
      setSpecimenId("");
      setSpecimenType("");
      setDescription("");
      setImportance("");
    } catch (error) {
      handleTransactionError(
        error,
        {
          defaultMessage: "Failed to register genetic sample on the blockchain.",
          defaultTitle: "Transaction Failed",
          toast
        },
        setIsSubmittingSpecimen
      );
    } finally {
      setIsSubmittingSpecimen(false);
    }
  };

  // Handlers for CRISPR experiments
  const handleExperimentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to register a CRISPR experiment",
        variant: "destructive",
      });
      return;
    }

    if (!experimentSpecimenId || !location || !notes) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields for the CRISPR experiment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingExperiment(true);
    try {
      const tx = await registerCRISPRExperiment(
        BigInt(experimentSpecimenId),
        location,
        notes
      );
      
      // Add to transaction history
      addToTransactionHistory(tx, `Registered Experiment for specimen ${experimentSpecimenId}`);
      
      toast({
        title: "CRISPR Experiment Registered",
        description: `Transaction hash: ${tx.slice(0, 10)}...`,
        variant: "default",
      });
      
      setExperimentSpecimenId("");
      setLocation("");
      setNotes("");
    } catch (error) {
      handleTransactionError(
        error,
        {
          defaultMessage: "Failed to register CRISPR experiment.",
          defaultTitle: "Error",
          toast
        },
        setIsSubmittingExperiment
      );
    } finally {
      setIsSubmittingExperiment(false);
    }
  };

  // Handlers for access control
  const handleAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to manage access controls",
        variant: "destructive",
      });
      return;
    }

    if (!accessUserAddress || !accessRole) {
      toast({
        title: "Missing fields",
        description: "Please provide both the researcher address and role",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingAccess(true);
    try {
      const tx = await grantResearcherAccess(
        accessRole,
        accessUserAddress
      );
      
      // Add to transaction history
      addToTransactionHistory(tx, `Granted ${accessRole} Access to ${accessUserAddress.slice(0, 6)}...`);
      
      toast({
        title: "Researcher Access Granted",
        description: `Transaction hash: ${tx.slice(0, 10)}...`,
        variant: "default",
      });
      
      setAccessUserAddress("");
      // setAccessSampleId("");
      setAccessRole("");
    } catch (error) {
      handleTransactionError(
        error,
        {
          defaultMessage: "Failed to grant researcher access.",
          defaultTitle: "Error",
          toast
        },
        setIsSubmittingAccess
      );
    } finally {
      setIsSubmittingAccess(false);
    }
  };

  // Handlers for workflow
  const handleWorkflowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to update workflow status",
        variant: "destructive",
      });
      return;
    }

    if (!workflowSampleId || !workflowStatus) {
      toast({
        title: "Missing fields",
        description: "Please provide both the genetic sample ID and the new status",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingWorkflow(true);
    try {
      const tx = await updateGeneticSampleStatus(
        workflowSampleId,
        workflowStatus,
        workflowNotes || ""
      );
      
      // Add to transaction history
      addToTransactionHistory(tx, `Updated Status for ${workflowSampleId} to ${workflowStatus}`);
      
      toast({
        title: "Genetic Sample Status Updated",
        description: `Transaction hash: ${tx.slice(0, 10)}...`,
        variant: "default",
      });
      
      setWorkflowSampleId("");
      setWorkflowStatus("");
      setWorkflowNotes("");
    } catch (error) {
      handleTransactionError(
        error,
        {
          defaultMessage: "Failed to update genetic sample status.",
          defaultTitle: "Error",
          toast
        },
        setIsSubmittingWorkflow
      );
    } finally {
      setIsSubmittingWorkflow(false);
    }
  };

  // Handlers for IP
  const handleIpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to register genetic IP",
        variant: "destructive",
      });
      return;
    }

    if (!ipTitle || !ipType || !ipDescription) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields for the genetic IP registration",
        variant: "destructive",
      });
      return;
    }

    // Default to current address if no owners specified
    const initialOwners = ipInitialOwners || address || "";

    setIsSubmittingIp(true);
    try {
      const tx = await registerGeneticIP(
        ipTitle,
        ipDescription,
        ipType,
        ipUri,
        initialOwners
      );
      
      // Add to transaction history
      addToTransactionHistory(tx, `Registered IP: ${ipTitle}`);
      
      toast({
        title: "Genetic IP Registered",
        description: `Transaction hash: ${tx.slice(0, 10)}...`,
        variant: "default",
      });
      
      setIpTitle("");
      setIpType("");
      setIpDescription("");
      setIpUri("");
      setIpInitialOwners("");
    } catch (error) {
      handleTransactionError(
        error,
        {
          defaultMessage: "Failed to register genetic IP.",
          defaultTitle: "Error",
          toast
        },
        setIsSubmittingIp
      );
    } finally {
      setIsSubmittingIp(false);
    }
  };

  // Placeholder for evidence handler
  // const handleEvidenceSubmit = async () => {};

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Blockchain Storage Guide */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How Your Data is Stored on the Blockchain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <p>
              Your genomic research data is securely stored on the Base blockchain, providing immutable, 
              permanent records with the following benefits:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Immutability</h4>
                  <p className="text-muted-foreground">Once recorded, data cannot be altered or deleted, ensuring research integrity.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Security</h4>
                  <p className="text-muted-foreground">Cryptographic security protects data authenticity and researcher attribution.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Traceability</h4>
                  <p className="text-muted-foreground">Full audit trail of all genomic research activities with timestamps.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Collaboration</h4>
                  <p className="text-muted-foreground">Access controls allow secure collaboration while maintaining data ownership.</p>
                </div>
              </div>
            </div>
            
            {/* Network information alert */}
            <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md border border-amber-200 dark:border-amber-800">
              <h4 className="font-medium flex items-center text-amber-800 dark:text-amber-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Network Information
              </h4>
              <p className="mt-1 text-amber-700 dark:text-amber-400">
                This platform stores data on the <strong>Base Sepolia Testnet</strong> (Chain ID: 84532).
                Your wallet may prompt you to switch networks when submitting data.
              </p>
              <div className="mt-2 text-amber-700 dark:text-amber-400 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Need testnet ETH? Get it from the <a href="https://www.coinbase.com/faucets/base-sepolia-faucet" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:no-underline">Base Sepolia Faucet</a></span>
              </div>
            </div>
            
            <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-md mt-4">
              <p className="font-medium">How it works:</p>
              <ol className="list-decimal list-inside space-y-1 mt-2 text-muted-foreground">
                <li>Fill out the required information in the forms below</li>
                <li>Submit by clicking the register button</li>
                <li>Approve the transaction in your connected wallet</li>
                <li><strong>Switch to Base network</strong> if prompted by your wallet</li>
                <li>Your data is permanently stored on the Base blockchain</li>
                <li>A transaction receipt confirms successful storage</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {!isConnected ? (
        <>
          <div className="mb-8">
            <Card className="bg-card shadow-lg border border-slate-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Connect Wallet</CardTitle>
                <CardDescription>Connect your wallet to interact with the GENEForge CRISPR platform</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center py-4 gap-4">
                <p className="text-center mb-2 text-sm text-muted-foreground">
                  Choose a wallet below or use the dropdown menu in the navigation bar
                </p>
                <ConnectWallet />
              </CardContent>
            </Card>
          </div>
          
          {/* Testnet ETH Guide */}
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Testnet ETH
                </CardTitle>
                <CardDescription>You&apos;ll need testnet ETH to submit transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm">
                    To interact with the blockchain, you need Base Sepolia testnet ETH. 
                    Follow these steps to get free test ETH:
                  </p>
                  
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li className="pl-2">Connect your wallet using the option above</li>
                    <li className="pl-2">Visit the <a href="https://www.coinbase.com/faucets/base-sepolia-faucet" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:no-underline">Base Sepolia Faucet</a></li>
                    <li className="pl-2">Connect the same wallet on the faucet site</li>
                    <li className="pl-2">Complete the verification and request testnet ETH</li>
                    <li className="pl-2">Return to this site and start submitting data!</li>
                  </ol>
                  
                  <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-md mt-2 text-amber-800 dark:text-amber-300 text-sm">
                    <p className="font-medium">Note:</p>
                    <p>Testnet ETH has no real-world value and is only used for testing. You will receive it for free from the faucet.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <a 
                  href="https://www.coinbase.com/faucets/base-sepolia-faucet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:bg-amber-600 dark:hover:bg-amber-700 dark:focus:ring-amber-400 dark:focus:ring-offset-slate-900 w-full"
                >
                  Get Free Testnet ETH →
                </a>
              </CardFooter>
            </Card>
          </div>
        </>
      ) : null}

      {!isConnected ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please connect your wallet to access the dashboard.</p>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-8 text-center">CRISPR Gene Editing Dashboard</h1>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 mb-8 tabs-list">
              <TabsTrigger value="samples" className="text-base">
                Samples
              </TabsTrigger>
              <TabsTrigger value="experiments" className="text-base">
                Experiments
              </TabsTrigger>
              <TabsTrigger value="access" className="text-base">
                Access Control
              </TabsTrigger>
              <TabsTrigger value="workflow" className="text-base">
                Workflow
              </TabsTrigger>
              <TabsTrigger value="intellectual" className="text-base">
                IP Rights
              </TabsTrigger>
            </TabsList>
            
            {/* Samples Tab */}
            <TabsContent value="samples" className="space-y-8">
              <Card className="bg-card shadow-lg border border-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Register New CRISPR Sample</CardTitle>
                  <CardDescription>
                    Record gene editing samples with immutable blockchain verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="specimenForm" onSubmit={handleSpecimenSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="specimenId" className="flex items-center">
                        Sample ID
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Unique identifier for this genomic sample
                        </span>
                      </Label>
                      <Input
                        id="specimenId"
                        placeholder="e.g. GEN-2023-001"
                        value={specimenId}
                        onChange={(e) => setSpecimenId(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="specimenType" className="flex items-center">
                        Sample Type
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Type of genomic material
                        </span>
                      </Label>
                      <Input
                        id="specimenType"
                        type="text"
                        placeholder="Enter sample type (e.g., DNA, RNA, Blood)"
                        value={specimenType}
                        onChange={(e) => setSpecimenType(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="flex items-center">
                        Description
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Detailed information about the sample
                        </span>
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Detailed description including source, collection methods, and any special characteristics"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[100px]"
                        required
                      />
                    </div>
                    
                    {/* Quality Level - Changed to Radio Buttons */}
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        Quality Level
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Sample significance classification
                        </span>
                      </Label>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                        {IMPORTANCE_LEVELS.map((level) => (
                          <label key={level.value} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="importance"
                              value={level.value}
                              checked={importance === level.value}
                              onChange={(e) => setImportance(e.target.value)}
                              required // Ensure one option is selected
                            />
                            <span>{level.value}</span>
                          </label>
                        ))}
                      </div>
                      {importance && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {IMPORTANCE_LEVELS.find(h => h.value === importance)?.description}
                        </p>
                      )}
                    </div>

                    <Alert className="mt-4 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertTitle>Blockchain Transaction</AlertTitle>
                      <AlertDescription>
                        This will create an immutable record of your CRISPR gene editing sample on the Base blockchain. Your wallet will be recorded as the registrant.
                      </AlertDescription>
                    </Alert>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    form="specimenForm" 
                    disabled={isSubmittingSpecimen}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50"
                  >
                    {isSubmittingSpecimen ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Transaction...
                      </span>
                    ) : "Register CRISPR Sample"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Experiments Tab */}
            <TabsContent value="experiments" className="space-y-8">
              <Card className="bg-card shadow-lg border border-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Register Experiment Location & Notes</CardTitle>
                  <CardDescription>
                    Track experiment location and notes for genomic samples
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="experimentForm" onSubmit={handleExperimentSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="experimentSpecimenId" className="flex items-center">
                        Specimen ID
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> ID of the specimen used in this experiment
                        </span>
                      </Label>
                      <Input
                        id="experimentSpecimenId"
                        type="number"
                        placeholder="Enter the specimen ID number"
                        value={experimentSpecimenId}
                        onChange={(e) => setExperimentSpecimenId(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center">
                        Location
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Location where experiment was conducted
                        </span>
                      </Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="Enter experiment location (e.g., Lab A, Site B)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="flex items-center">
                        Experiment Notes
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Detailed information about the experiment
                        </span>
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Protocol details, conditions, results, and observations"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[100px]"
                        required
                      />
                    </div>

                    <Alert className="mt-4 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertTitle>Experiment Record</AlertTitle>
                      <AlertDescription>
                        This will create a permanent record of the experiment. Your wallet address will be recorded as the researcher.
                      </AlertDescription>
                    </Alert>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    form="experimentForm" 
                    disabled={isSubmittingExperiment}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50"
                  >
                    {isSubmittingExperiment ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Transaction...
                      </span>
                    ) : "Register Experiment"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Access Control Tab */}
            <TabsContent value="access" className="space-y-8">
              <Card className="bg-card shadow-lg border border-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Manage Access Control</CardTitle>
                  <CardDescription>
                    Assign and manage permissions for genomic data access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="accessForm" onSubmit={handleAccessSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="accessUserAddress" className="flex items-center">
                        User Wallet Address
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Ethereum address to grant access to
                        </span>
                      </Label>
                      <Input
                        id="accessUserAddress"
                        placeholder="0x..."
                        value={accessUserAddress}
                        onChange={(e) => setAccessUserAddress(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        Access Role
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Level of access to grant
                        </span>
                      </Label>
                      <div className="flex space-x-4 mt-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="accessRole"
                            value="admin"
                            checked={accessRole === "admin"}
                            onChange={(e) => setAccessRole(e.target.value)}
                          />
                          <span>Admin</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="accessRole"
                            value="write"
                            checked={accessRole === "write"}
                            onChange={(e) => setAccessRole(e.target.value)}
                          />
                          <span>Write</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="accessRole"
                            value="read"
                            checked={accessRole === "read"}
                            onChange={(e) => setAccessRole(e.target.value)}
                          />
                          <span>Read</span>
                        </label>
                      </div>
                    </div>

                    <Alert className="mt-4 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertTitle>Access Control</AlertTitle>
                      <AlertDescription>
                        This will grant the specified user permanent access rights to the genomic data. This action is recorded on the blockchain.
                      </AlertDescription>
                    </Alert>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    form="accessForm" 
                    disabled={isSubmittingAccess}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50"
                  >
                    {isSubmittingAccess ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Transaction...
                      </span>
                    ) : "Assign Access Rights"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Workflow Tab */}
            <TabsContent value="workflow" className="space-y-8">
              <Card className="bg-card shadow-lg border border-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Manage Workflow</CardTitle>
                  <CardDescription>
                    Track sample workflow status and processing stages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="workflowForm" onSubmit={handleWorkflowSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="workflowSampleId" className="flex items-center">
                        Sample ID
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> ID of the sample to update
                        </span>
                      </Label>
                      <Input
                        id="workflowSampleId"
                        type="number"
                        placeholder="Enter the sample ID number"
                        value={workflowSampleId}
                        onChange={(e) => setWorkflowSampleId(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        Workflow Status
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Current processing stage
                        </span>
                      </Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="workflowStatus"
                            value="pending"
                            checked={workflowStatus === "pending"}
                            onChange={(e) => setWorkflowStatus(e.target.value)}
                          />
                          <span>Pending</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="workflowStatus"
                            value="in_progress"
                            checked={workflowStatus === "in_progress"}
                            onChange={(e) => setWorkflowStatus(e.target.value)}
                          />
                          <span>In Progress</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="workflowStatus"
                            value="completed"
                            checked={workflowStatus === "completed"}
                            onChange={(e) => setWorkflowStatus(e.target.value)}
                          />
                          <span>Completed</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="workflowStatus"
                            value="failed"
                            checked={workflowStatus === "failed"}
                            onChange={(e) => setWorkflowStatus(e.target.value)}
                          />
                          <span>Failed</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="workflowNotes" className="flex items-center">
                        Workflow Notes
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Additional workflow information
                        </span>
                      </Label>
                      <Textarea
                        id="workflowNotes"
                        placeholder="Details about the current processing stage, next steps, or special handling instructions"
                        value={workflowNotes}
                        onChange={(e) => setWorkflowNotes(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    <Alert className="mt-4 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertTitle>Workflow Automation</AlertTitle>
                      <AlertDescription>
                        This will update the workflow status of the sample and trigger any automated processes associated with this stage.
                      </AlertDescription>
                    </Alert>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    form="workflowForm" 
                    disabled={isSubmittingWorkflow}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50"
                  >
                    {isSubmittingWorkflow ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Transaction...
                      </span>
                    ) : "Update Workflow Status"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* IP Rights Tab - Updated fields */}
            <TabsContent value="intellectual" className="space-y-8">
              <Card className="bg-card shadow-lg border border-slate-800">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Register Intellectual Property</CardTitle>
                  <CardDescription>
                    Manage intellectual property rights for genomic discoveries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="ipForm" onSubmit={handleIpSubmit} className="space-y-4">
                    {/* Changed ipSampleId to ipTitle */}
                    <div className="space-y-2">
                      <Label htmlFor="ipTitle" className="flex items-center">
                        IP Title (e.g., Sample ID)
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Title or identifier for this IP record
                        </span>
                      </Label>
                      <Input
                        id="ipTitle"
                        type="text" 
                        placeholder="Enter the IP title or identifier"
                        value={ipTitle}
                        onChange={(e) => setIpTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    {/* Changed ipLicenseType to ipType */}
                    <div className="space-y-2">
                      <Label htmlFor="ipType" className="flex items-center">
                        IP Type
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Type of IP (e.g., Patent, Discovery)
                        </span>
                      </Label>
                      <Input
                        id="ipType"
                        type="text"
                        placeholder="Enter IP type"
                        value={ipType}
                        onChange={(e) => setIpType(e.target.value)}
                        required
                      />
                    </div>
                    
                    {/* Kept ipDescription */}
                    <div className="space-y-2">
                      <Label htmlFor="ipDescription" className="flex items-center">
                        IP Description
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Description of the intellectual property
                        </span>
                      </Label>
                      <Textarea
                        id="ipDescription"
                        placeholder="Detailed description of the discovery, innovation, or intellectual property being registered"
                        value={ipDescription}
                        onChange={(e) => setIpDescription(e.target.value)}
                        className="min-h-[100px]"
                        required
                      />
                    </div>

                    {/* Added ipUri input */}
                    <div className="space-y-2">
                      <Label htmlFor="ipUri" className="flex items-center">
                        Documentation URI (Optional)
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Link to additional documentation
                        </span>
                      </Label>
                      <Input
                        id="ipUri"
                        type="text"
                        placeholder="Enter URI (e.g., https://...)"
                        value={ipUri}
                        onChange={(e) => setIpUri(e.target.value)}
                      />
                    </div>

                    {/* Added ipInitialOwners input */}
                    <div className="space-y-2">
                      <Label htmlFor="ipInitialOwners" className="flex items-center">
                        Initial Owners
                        <span className="ml-2 text-xs text-muted-foreground inline-flex items-center">
                          <Info size={12} className="mr-1" /> Comma-separated wallet addresses
                        </span>
                      </Label>
                      <Input
                        id="ipInitialOwners"
                        type="text"
                        placeholder="0x..., 0x..."
                        value={ipInitialOwners}
                        onChange={(e) => setIpInitialOwners(e.target.value)}
                        required
                      />
                    </div>

                    <Alert className="mt-4 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertTitle>Intellectual Property Registration</AlertTitle>
                      <AlertDescription>
                        This will register your intellectual property claim on the blockchain, providing a timestamped record of your discovery.
                      </AlertDescription>
                    </Alert>
                  </form>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    form="ipForm" 
                    disabled={isSubmittingIp}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50"
                  >
                    {isSubmittingIp ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing Transaction...
                      </span>
                    ) : "Register IP Rights"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Transaction History Section */}
          {transactionHistory.length > 0 && (
            <div className="mt-12 mb-8">
              <Card className="bg-card shadow-lg border border-slate-800">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Transaction History
                  </CardTitle>
                  <CardDescription>
                    Recent blockchain transactions and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                          <th className="font-medium p-3 text-left">Transaction</th>
                          <th className="font-medium p-3 text-left">Hash</th>
                          <th className="font-medium p-3 text-left">Time</th>
                          <th className="font-medium p-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactionHistory.map((tx, index) => (
                          <tr key={tx.hash} className={index % 2 === 0 ? "bg-transparent" : "bg-slate-50 dark:bg-slate-900/50"}>
                            <td className="p-3 align-middle">{tx.description}</td>
                            <td className="p-3 align-middle font-mono text-xs">
                              {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                            </td>
                            <td className="p-3 align-middle text-xs text-slate-500 dark:text-slate-400">
                              {new Date(tx.timestamp).toLocaleString()}
                            </td>
                            <td className="p-3 align-middle">
                              <a 
                                href={`https://sepolia.basescan.org/tx/${tx.hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                              >
                                <span>View</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => {
                      localStorage.removeItem('txHistory');
                      setTransactionHistory([]);
                    }}
                  >
                    Clear History
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
} 
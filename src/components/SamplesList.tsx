'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { getGenomeSampleCount, getGenomeSample } from '@/contracts/contract-service';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Sample {
  sampleId: string;
  sampleType: string;
  description: string;
  hazardLevel: string;
  registeredBy: string;
  timestamp: bigint;
}

export function SamplesList() {
  const { isConnected } = useAccount();
  const [samples, setSamples] = useState<Sample[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSample = async (id: string): Promise<Sample | null> => {
    try {
      const [sampleId, sampleType, description, hazardLevel, registeredBy, timestamp] = await getGenomeSample(id);
      return {
        sampleId,
        sampleType,
        description,
        hazardLevel,
        registeredBy,
        timestamp
      };
    } catch (error) {
      console.error(`Error fetching sample ${id}:`, error);
      return null;
    }
  };

  const loadSamples = useCallback(async () => {
    if (!isConnected) {
      // Mock data when not connected
      setSamples([
        {
          sampleId: "SAMPLE001",
          sampleType: "DNA",
          description: "Sample description",
          hazardLevel: "High",
          registeredBy: "0x1234567890123456789012345678901234567890",
          timestamp: BigInt(Date.now())
        }
      ]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const count = await getGenomeSampleCount();
      
      if (count === 0) {
        setSamples([]);
        setIsLoading(false);
        return;
      }

      // Fetch each sample by ID
      // Note: Assuming sample IDs are string values like "SAMPLE001", "SAMPLE002", etc.
      // This may need to be adjusted based on how your contract stores sample IDs
      const samplePromises = [];
      for (let i = 1; i <= count; i++) {
        samplePromises.push(fetchSample(`SAMPLE${i.toString().padStart(3, '0')}`));
      }

      const fetchedSamples = await Promise.all(samplePromises);
      const validSamples = fetchedSamples.filter(
        (sample): sample is Sample => sample !== null
      );
      setSamples(validSamples);
    } catch (error) {
      console.error("Error loading samples:", error);
      setError("Failed to load samples. Please try again later.");
      // Fallback to mock data
      setSamples([
        {
          sampleId: "SAMPLE001",
          sampleType: "DNA",
          description: "Sample description",
          hazardLevel: "High",
          registeredBy: "0x1234567890123456789012345678901234567890",
          timestamp: BigInt(Date.now())
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  useEffect(() => {
    loadSamples();
  }, [loadSamples]);

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp)).toLocaleString();
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (isLoading) {
    return <div className="p-4">Loading samples...</div>;
  }

  if (error) {
    return (
      <Alert className="mb-4 border-red-500 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (samples.length === 0) {
    return (
      <div className="p-4">
        No genomic samples found. Connect your wallet and register a sample to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>List of registered genomic samples</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Sample ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Hazard Level</TableHead>
            <TableHead>Recorded By</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {samples.map((sample) => (
            <TableRow key={sample.sampleId}>
              <TableCell className="font-medium">{sample.sampleId}</TableCell>
              <TableCell>{sample.sampleType}</TableCell>
              <TableCell>{sample.description}</TableCell>
              <TableCell>{sample.hazardLevel}</TableCell>
              <TableCell>{truncateAddress(sample.registeredBy)}</TableCell>
              <TableCell>{formatDate(sample.timestamp)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default SamplesList; 
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Database, Shield, Zap, FileCode, GitBranch, Dna } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="hero-gradient absolute inset-0"></div>
        
        {/* DNA Animation */}
        <motion.div 
          className="dna-animation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
        <Image
            src="/dna-helix.svg" 
            alt="DNA Helix" 
            width={600} 
            height={600}
          priority
        />
        </motion.div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-start max-w-3xl space-y-6">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary">GeneForge:</span> Blockchain CRISPR Platform
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Secure genomic research with blockchain verification - enabling transparent, traceable and immutable gene editing workflows with BASE blockchain.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link href="/data">
                <Button className="gradient-button text-white">
                  Connect Wallet
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-muted/50 dark:bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Blockchain-Powered CRISPR Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform offers secure, immutable record-keeping for genomic research and CRISPR gene editing with cutting-edge blockchain technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              className="feature-card bg-card p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Dna className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Genetic Sample Provenance</h3>
              <p className="text-muted-foreground">
                Track the origin, chain of custody, and complete history of genomic samples with immutable blockchain records.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="feature-card bg-card p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <FileCode className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">CRISPR Experiment Audit</h3>
              <p className="text-muted-foreground">
                Record CRISPR editing results and maintain a complete audit trail of all gene editing experiments.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="feature-card bg-card p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Genomic Data Access Control</h3>
              <p className="text-muted-foreground">
                Manage permissions and access rights to sensitive genomic data with role-based access controls.
              </p>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div 
              className="feature-card bg-card p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gene Editing Workflow</h3>
              <p className="text-muted-foreground">
                Set up automated workflows for CRISPR protocols and gene editing procedures using smart contracts.
              </p>
            </motion.div>
            
            {/* Feature 5 */}
            <motion.div 
              className="feature-card bg-card p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <GitBranch className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Genomic IP Protection</h3>
              <p className="text-muted-foreground">
                Record and protect intellectual property rights associated with genomic discoveries and CRISPR innovations.
              </p>
            </motion.div>
            
            {/* Feature 6 */}
            <motion.div 
              className="feature-card bg-card p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Base Blockchain</h3>
              <p className="text-muted-foreground">
                Powered by Base, an Ethereum Layer 2 solution that offers the scalability and security needed for genomic data.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-10 flex flex-col lg:flex-row items-center justify-between">
            <div className="max-w-2xl mb-8 lg:mb-0">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Gene Editing Journey?</h2>
              <p className="text-lg text-muted-foreground">
                Connect your wallet and begin recording CRISPR experiments and genomic data on the blockchain today.
              </p>
            </div>
            <Link href="/data">
              <Button size="lg" className="gradient-button text-white">
                Connect Wallet
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

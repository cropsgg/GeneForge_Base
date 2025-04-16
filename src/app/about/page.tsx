'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, LineChart, DollarSign, Link, BadgeCheck, Lock, FileCheck } from 'lucide-react';

// Fade in animation for sections
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Stagger children animation
const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          About HackHazards
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          A blockchain-based platform revolutionizing the tracking and management of hazardous materials 
          with unparalleled security, transparency, and immutability.
        </p>
      </motion.header>
      
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="mb-16"
      >
        <h2 className="text-3xl font-semibold mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={fadeIn} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <BadgeCheck className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-medium">Immutable Records</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Create permanent, tamper-proof records of hazardous material handling that cannot be altered 
              or deleted once recorded on the blockchain.
            </p>
            <div className="flex items-center text-sm text-blue-600">
              <Lock className="w-4 h-4 mr-1" />
              <span>Secured by Base Blockchain</span>
            </div>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <FileCheck className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-medium">Compliance Ready</h3>
            </div>
            <p className="text-gray-600 mb-3">
              Built with regulatory requirements in mind, allowing for easy verification 
              of compliance with hazardous materials handling protocols.
            </p>
            <div className="flex items-center text-sm text-blue-600">
              <Lock className="w-4 h-4 mr-1" />
              <span>Digital chain of custody</span>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="mb-16"
      >
        <h2 className="text-3xl font-semibold mb-6">Blockchain Immutability</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium mb-3 text-blue-600">What is Immutability?</h3>
            <p className="mb-4">
              Data stored on the blockchain is immutable, meaning once it&apos;s recorded, it cannot be altered
              or deleted. This creates a permanent, tamper-proof record that can be trusted.
            </p>
            <p>
              Each transaction is cryptographically secured and linked to previous transactions,
              creating a chain that cannot be broken or modified without detection.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium mb-3 text-blue-600">How It Works</h3>
            <p className="mb-4">
              Each transaction is verified by multiple participants in the network before being added to a block.
              Once added, changing any information would require changing all subsequent blocks and gaining
              consensus from the majority of the network, making it practically impossible.
            </p>
            <p>
              This process ensures that your data remains secure and trustworthy over time.
            </p>
          </div>
        </div>
        
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-medium mb-3">Why Immutability Matters for Hazardous Materials</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <ArrowRight className="min-w-5 w-5 h-5 mr-2 mt-1" />
              <span>Provides an unalterable chain of custody record for hazardous materials</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="min-w-5 w-5 h-5 mr-2 mt-1" />
              <span>Creates indisputable evidence for regulatory compliance</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="min-w-5 w-5 h-5 mr-2 mt-1" />
              <span>Prevents fraudulent manipulation of safety and testing data</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="min-w-5 w-5 h-5 mr-2 mt-1" />
              <span>Ensures complete historical records for liability protection</span>
            </li>
          </ul>
        </div>
      </motion.section>
      
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="mb-16"
      >
        <h2 className="text-3xl font-semibold mb-8">Why Base Blockchain?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div variants={fadeIn} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Zap className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-medium">Scalability</h3>
            </div>
            <p className="text-gray-600">
              Base is built on Ethereum&apos;s layer 2 solution, providing high throughput
              and low transaction costs without sacrificing security.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <DollarSign className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-medium">Cost-effectiveness</h3>
            </div>
            <p className="text-gray-600">
              Significantly lower gas fees compared to the Ethereum mainnet,
              making it affordable for frequent data transactions.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-medium">Security</h3>
            </div>
            <p className="text-gray-600">
              Inherits the strong security guarantees of Ethereum while improving
              on performance and user experience.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Link className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-medium">Interoperability</h3>
            </div>
            <p className="text-gray-600">
              Seamless integration with the broader Ethereum ecosystem
              and its extensive array of tools and services.
            </p>
          </motion.div>
          
          <motion.div variants={fadeIn} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <LineChart className="w-8 h-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-medium">Reliability</h3>
            </div>
            <p className="text-gray-600">
              Consistent uptime and performance with enterprise-grade
              infrastructure and Coinbase backing.
            </p>
          </motion.div>
        </div>
      </motion.section>
      
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <h2 className="text-3xl font-semibold mb-6">Getting Started</h2>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl shadow-sm">
          <p className="text-lg mb-4">
            Ready to experience the future of hazardous materials management? 
            Connect your wallet and start using HackHazards today.
          </p>
          <div className="flex flex-wrap gap-4 mt-6">
            <a 
              href="/data" 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Enter Data
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a 
              href="https://base.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              Learn About Base
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
} 
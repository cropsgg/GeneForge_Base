# GENEForge - Blockchain Platform for Genome Data

A decentralized platform for secure genome data management and CRISPR gene editing research built on Base blockchain.

## Overview

This application provides a blockchain-based solution for tracking and managing genome data, experimental results, and CRISPR research. The smart contracts enable:

- Sample provenance tracking for genetic samples
- Experimental data auditing for CRISPR gene editing
- Access control and permissions for sensitive genetic data
- Workflow automation for research approval processes
- Intellectual property protection for genetic discoveries

## Project Structure

```
base_hackhazards/
├── src/
│   ├── app/               # Next.js app routes
│   ├── components/        # React components
│   ├── contracts/         # Smart contracts and deployment
│   │   ├── solidity/      # Solidity smart contracts
│   │   ├── abis/          # Contract ABIs (generated)
│   │   ├── artifacts/     # Contract artifacts (generated)
│   │   ├── compile.js     # Contract compilation script
│   │   ├── deploy.js      # Contract deployment script
│   │   └── deploy-contracts.js  # Main deployment workflow
│   ├── lib/               # Utility functions
│   └── providers/         # React context providers
└── public/                # Static assets
```

## Smart Contract Overview

### SampleProvenance.sol
Tracks the origin, chain of custody, and ownership history of genome data samples. This contract ensures that the complete history of a sample is recorded immutably on the blockchain, providing proof of authenticity and traceability.

### ExperimentalDataAudit.sol
Records experimental data and test results related to CRISPR gene editing. This contract creates an immutable audit trail of all data collected during experiments, ensuring data integrity and providing cryptographic proof that data hasn't been tampered with.

### AccessControl.sol
Manages permissions and access rights to specific genome data records. This contract implements role-based access control to ensure that only authorized personnel can access or modify sensitive genetic information.

### WorkflowAutomation.sol
Automates key workflows and approval processes related to genome data management. This contract implements business logic for approval chains, event triggers, and compliance workflows related to genetic research.

### IntellectualProperty.sol
Protects intellectual property rights related to genetic research data and methodologies. This contract provides timestamped proof of discovery and innovation, which can be crucial for patent applications and IP disputes.

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- MetaMask or other Web3 wallet
- Base Sepolia ETH (for deployment and testing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/geneforge.git
   cd geneforge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file to add your private key and other settings:
   ```
   PRIVATE_KEY=your_private_key_without_0x_prefix
   BASE_SEPOLIA_RPC_URL=your_base_sepolia_rpc_url
   ```

## Smart Contract Deployment

1. Compile the smart contracts:
   ```bash
   node src/contracts/compile.js
   ```

2. Deploy contracts to Base Sepolia:
   ```bash
   node src/contracts/deploy-contracts.js
   ```

3. Once deployment completes, the contract addresses will be saved to `src/contracts/contract-addresses.json`

## Running the Application

Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser and connect your wallet to interact with the application.

## Using the Application

1. Connect your Web3 wallet (MetaMask, etc.)
2. Navigate to the "Data" section to register genetic samples, experimental data, or IP records
3. Use the different tabs to manage various aspects of your genetic research data
4. All transactions will be recorded on the Base blockchain, providing immutable proof

## Simplified Workflow

The application follows a streamlined approach for blockchain interaction:

1. User inputs genomic data or research results in the frontend forms
2. Data is sent to the smart contracts via the contract service
3. Transactions are confirmed in your wallet
4. Data is permanently stored on Base blockchain
5. Data can be retrieved and displayed from the contracts

## Security Considerations

- Role-based access control for sensitive genetic data
- Immutable audit trails for all research activities
- Cryptographic verification of data integrity
- Secure intellectual property protection

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

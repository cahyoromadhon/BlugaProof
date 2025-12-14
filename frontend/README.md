# Bluga Proof

**Bluga Proof** is a decentralized digital copyright proof system built on the Sui blockchain ecosystem. The project leverages Walrus decentralized storage and SHA256 cryptographic hashing to create immutable, verifiable proof of digital asset ownership and copyright protection.

## 🎯 Overview

Bluga Proof provides a trustless, decentralized solution for protecting digital copyrights. By combining blockchain technology with decentralized storage, users can:

- **Notarize digital files** - Upload and register files with cryptographic proof of ownership
- **Verify authenticity** - Check if a file has been previously registered and retrieve its certificate
- **Immutable records** - All proofs are stored on the Sui blockchain, ensuring tamper-proof evidence
- **Decentralized storage** - Files are stored on Walrus, eliminating single points of failure

## 🔐 How It Works

### Notarization Flow

1. **File Upload** - User selects a file through the frontend interface
2. **Hash Generation** - SHA256 hash is computed from the file content
3. **Walrus Storage** - File is uploaded to Walrus decentralized storage
4. **Certificate Minting** - Smart contract creates a `BlugaCertificate` NFT on Sui blockchain
5. **Proof Generation** - Immutable record is created linking file hash, Walrus URL, and owner address

### Verification Flow

1. **File Upload** - User uploads a file to verify
2. **Hash Computation** - SHA256 hash is generated from the file
3. **Blockchain Query** - System searches for matching certificates on-chain
4. **Result Display** - Shows if file exists, who owns it, and when it was registered

## 🛠️ Tech Stack

- **Blockchain**: Sui Network
- **Smart Contract**: Move Language
- **Storage**: Walrus Decentralized Storage
- **Hashing**: SHA256
- **Backend**: Node.js, Express.js, TypeScript
- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS
- **Authentication**: Enoki zkLogin
- **Wallet Integration**: Sui dApp Kit

## 🏗️ Project Structure

The project is organized into three main components:

### 1. **Contract** (`/contract`)

Smart contract module written in Move language for the Sui blockchain.

```
contract/
├── Move.toml              # Move package configuration
├── sources/
│   └── contract.move      # BlugaCertificate smart contract
└── tests/
    └── contract_tests.move # Contract unit tests
```

**Key Features:**
- `BlugaCertificate` struct: Stores file hash, metadata, creator address, and timestamp
- `mint_certificate` function: Creates on-chain certificates for notarized files
- Immutable proof of ownership with timestamp verification

### 2. **Backend** (`/backend`)

Express.js server providing API endpoints for blockchain interactions and file processing.

```
backend/
├── package.json           # Node.js dependencies
├── tsconfig.json          # TypeScript configuration
├── data/
│   └── notarizations.json # Local notarization storage
└── src/
    ├── index.ts           # Main server entry point
    ├── routes/
    │   ├── notarize.ts    # File notarization endpoint
    │   ├── verify.ts      # File verification endpoint
    │   ├── sponsor.ts     # Transaction sponsorship
    │   ├── sponsorSign.ts # Sponsor signature handling
    │   └── sponsorComplete.ts # Complete sponsored transactions
    ├── services/
    │   ├── enokiClient.ts # Enoki zkLogin integration
    │   └── walrusClient.ts # Walrus storage client
    └── utils/
        ├── notarizationStore.ts # Notarization data management
        └── types.ts       # TypeScript type definitions
```

**Key Technologies:**
- **Express.js** - RESTful API server
- **Sui SDK** - Blockchain interaction
- **Walrus SDK** - Decentralized storage
- **Enoki** - zkLogin and wallet management
- **Multer** - File upload handling

**API Endpoints:**
- `POST /api/notarize` - Upload and notarize files
- `POST /api/verify` - Verify file authenticity
- `POST /api/sponsor` - Initiate sponsored transactions
- `POST /api/sponsor-sign` - Sign sponsored transactions
- `POST /api/sponsor-complete` - Complete sponsored transactions

### 3. **Frontend** (`/frontend`)

React-based web application providing user interface for notarization and verification.

```
frontend/
├── package.json           # Frontend dependencies
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite bundler configuration
├── index.html             # HTML entry point
└── src/
    ├── App.tsx            # Main application component
    ├── main.tsx           # Application entry point
    ├── constants.ts       # Configuration constants
    ├── index.css          # Global styles
    ├── components/
    │   └── CopyButton.tsx # Reusable copy-to-clipboard button
    ├── lib/
    │   ├── api.ts         # API client
    │   ├── api/
    │   │   ├── api.ts     # Base API utilities
    │   │   ├── mint.ts    # Certificate minting functions
    │   │   ├── notarize.ts # Notarization API calls
    │   │   ├── sponsor.ts  # Sponsorship API calls
    │   │   └── sui.ts     # Sui blockchain utilities
    │   └── zk/
    │       ├── ephermal.ts # Ephemeral key management
    │       └── nonce.ts   # Nonce generation for zkLogin
    ├── tabs/
    │   ├── NotarizationTab.tsx # File upload & notarization UI
    │   └── VerifyTab.tsx  # File verification UI
    └── utils/
        └── hash.ts        # SHA256 hashing utilities
```

**Key Technologies:**
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Sui dApp Kit** - Wallet connection and blockchain interaction
- **Enoki** - zkLogin social authentication
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Sui CLI
- Sui Wallet

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd bluga
```

2. **Install Contract Dependencies**
```bash
cd contract
sui move build
```

3. **Install Backend Dependencies**
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

4. **Install Frontend Dependencies**
```bash
cd frontend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ on Sui Blockchain**
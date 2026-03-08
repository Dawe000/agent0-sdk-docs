---
title: "Architecture"
description: "How Agent0 SDK works"
---
Agent0 SDK provides a unified interface for managing agent identities, enabling discovery, and building reputation on blockchain infrastructure.

## High-Level Architecture

### What Stays Where

**Blockchain (On-chain)**

- Agent identities (ERC-721 NFTs)
- Basic metadata (ENS name, verified agent wallet)
- Feedback values, tags and endpoints
- Cryptographic commitments to off-chain files
- Ownership and operator permissions

**Decentralized Storage (Off-chain)**

- Complete agent registration files (IPFS/HTTP)
- Detailed feedback files (text + spec-aligned fields like `mcpTool`, `a2aSkills`, `oasfSkills`, plus payment proofs)
- Agent images and additional metadata

**Developer Applications**

- SDK instance with configuration
- Agent management and registration
- Search and discovery operations
- Feedback submission and retrieval

**End Users**

- Discover agents through search
- Interact with agents via endpoints
- Give feedback and build reputation
- Access agent capabilities

## Core Flows

### 1. Agent Registration Flow

**Step-by-step process:**

- **Create Agent** → Developer calls `SDK.createAgent()`

- Creates in-memory `RegistrationFile` object
- No blockchain interaction yet

- **Configure Agent** → Developer calls `agent.setMCP()`, `agent.setA2A()`, etc.

- SDK automatically fetches capabilities from endpoints (tools, prompts, resources, skills)
- Updates `RegistrationFile` locally with fetched capabilities
- Soft fails if MCP/A2A endpoints are unreachable (non-blocking)

- **Mint Agent Identity** → SDK calls `IdentityRegistry.register()`

- Mints ERC-721 NFT representing agent
- Returns unique `agentId`

- **Update Registration File** → SDK adds `agentId` to `RegistrationFile`

- Inserts the minted `agentId` into the registration data
- Updates the `registrations` array with agent ID and registry address

- **Upload Registration File** → Developer calls `agent.registerIPFS()`

- Uploads complete `RegistrationFile` (with `agentId`) to IPFS → Gets CID
- Alternative: `agent.registerHTTP()` for HTTP storage

- **Optional Domain Verification** → Developer publishes `/.well-known/agent-registration.json` on endpoint domains

- Enables verifiers/aggregators to verify endpoint-domain control (optional)

- **Link File to Identity** → SDK calls `IdentityRegistry.setAgentUri(CID)`

- Stores IPFS CID on-chain
- Creates tamper-proof link between identity and file

- **Index Agent** → Subgraph automatically indexes

- Subgraph monitors blockchain events and IPFS updates
- Extracts capabilities from registration files
- Makes agent discoverable via GraphQL queries

### 2. Agent Discovery Flow

**Search process:**

- **Query Preparation** → Developer calls `SDK.searchAgents(filters, options)`

- Builds unified search parameters (agent filters + optional feedback/reputation filters + optional semantic keyword prefilter)

- **Search Execution** → SDK queries subgraph

- Fast GraphQL queries for complex filtering
- Real-time results from indexed data

- **Result Processing** → SDK returns `AgentSummary` objects

- Includes basic info, capabilities, reputation
- Links to full registration files

- **Detailed Retrieval** → Developer calls `SDK.getAgent(agentId)`

- Queries subgraph for agent data and registration file
- Returns `AgentSummary` with full agent configuration

### 3. Feedback Submission Flow

**Two storage options:**

**Option A: On-chain Only (Simple)**

- **(No feedback file)** → Skip `SDK.prepareFeedbackFile()`

- Submit value/tags (and optional endpoint) on-chain only
- No off-chain upload, no URI/hash commitment

- **Submit to Blockchain** → SDK calls `ReputationRegistry.giveFeedback()`

- Stores value/tags (and optional endpoint) directly on-chain
- Minimal gas costs

**Option B: Hybrid**

- **Create Feedback File (optional)** → Developer calls `SDK.prepareFeedbackFile()`

- Creates detailed feedback file with spec-aligned protocol fields (e.g., `mcpTool`, `a2aSkills`, `a2aContextId`, `a2aTaskId`, `oasfSkills`, `oasfDomains`) and payment proofs

- **Upload to Storage** → SDK uploads to IPFS/HTTP

- Gets CID or URI for feedback file
- Stores complete feedback data

- **Submit Commitment** → SDK calls `ReputationRegistry.giveFeedback()`

- Stores value, tags, and file commitment on-chain
- Creates tamper-proof link to detailed feedback

- **Index Feedback** → Subgraph automatically indexes

- Monitors blockchain events (`NewFeedback`) and IPFS updates
- Makes feedback searchable and discoverable

### 4. Agent Update Flow

**Modifying existing agents:**

- **Load Agent** → Developer calls `SDK.loadAgent(agentId)`

- Retrieves current `RegistrationFile` from IPFS/HTTP
- Loads into `Agent` object for updates

- **Modify Configuration** → Developer calls update methods

- `agent.setMCP()`, `agent.setA2A()`, etc.
- Updates `RegistrationFile` locally

- **(Optional) Update Verified Agent Wallet** → Developer calls `agent.setWallet(newWallet, ...)`

- Signature-verified EIP-712 (EOA) / ERC-1271 (smart wallet) on-chain update (ERC-8004 Jan 2026)

- **Upload New File** → Developer calls `agent.registerIPFS()`

- Uploads updated `RegistrationFile` to IPFS
- Gets new CID

- **Update On-chain Reference** → SDK calls `IdentityRegistry.setAgentUri(newCID)`

- Updates IPFS CID on-chain
- Maintains link to latest version

- **Re-index Agent** → Subgraph automatically re-indexes

- Monitors blockchain events (`URIUpdated`) and IPFS updates
- Reflects new capabilities and configuration

### 5. Agent Transfer Flow

**Changing ownership:**

- **Load Agent** → Developer calls `SDK.loadAgent(agentId)`

- Retrieves current agent configuration

- **Transfer Ownership** → Developer calls `SDK.transferAgent(agentId, newOwner)`

- SDK loads agent and calls `IdentityRegistry.transferFrom()`
- Transfers ERC-721 NFT to new owner

### 6. Feedback Retrieval Flow

**Getting feedback data:**

- **Get Feedback** → Developer calls `SDK.getFeedback(agentId, clientAddress, feedbackIndex)`

- SDK queries `ReputationRegistry` for feedback records
- Gets on-chain scores, tags, and file commitments

- **Retrieve Details** → SDK fetches feedback files from IPFS/HTTP

- Downloads complete feedback data
- Parses spec-aligned feedback-file fields and payment proofs

- **Return Results** → SDK returns `Feedback` object

- Combines on-chain and off-chain data
- Provides complete feedback information

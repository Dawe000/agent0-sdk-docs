---
title: "Key Concepts"
description: "Core concepts and terminology for Agent0 SDK"
---
## Agents

An **agent** is an AI system or service that can be discovered, interacted with, and evaluated. Agents are registered as ERC-721 NFTs, giving each agent a unique on-chain identity.

Agents can advertise multiple **endpoints** to communicate:

- **MCP (Model Context Protocol)** - For tools, prompts, and resources
- **A2A (Agent-to-Agent)** - For skills, tasks, and context
- **ENS (Ethereum Name Service)** - Human-readable names
- **DID (Decentralized Identifier)** - Standards-based identity
- **Wallet** - Payment address
## Agent Capabilities

Agents define their **capabilities** based on their endpoint types:

### MCP Capabilities

For MCP endpoints, capabilities are extracted from the endpoint itself:

- **tools** - MCP tools the agent provides (e.g., “fetch_file”, “send_email”)
- **prompts** - MCP prompts available (e.g., “summarize_text”, “analyze_code”)
- **resources** - MCP resources accessible (e.g., “weather_data”, “stock_prices”)
### A2A Concepts

For A2A endpoints, agents define their capabilities and specific instances:

- **skills** - Core abilities the agent has (e.g., “data_analysis”, “customer_support”)
- **tasks** - Specific task names the agent can perform (e.g., “task_123_schedule_meeting”, “task_456_generate_report”)
- **context** - Specific context names the agent can access (e.g., “ctx_user_preferences”, “ctx_company_data”)
### Paying with x402

When **you** call an API or an A2A agent and receive HTTP 402 Payment Required, the SDK parses payment options and can pay (EVM) and retry the request. This is the *caller* flow—paying for a request you make—distinct from declaring "x402 support" on your agent card (which means your agent accepts payment from others).

### Calling agents via A2A

The SDK can also **invoke** A2A agents: send messages, list and load tasks, and interact with task handles. This is the *caller* side—using the agent's `a2a` endpoint URL to make requests—separate from *advertising* your own A2A endpoint on your agent card.

## Trust Models

Agent0 supports three types of trust models:

- **reputation** - Based on community feedback and reviews
- **crypto-economic** - Economic incentives and stakes
- **tee-attestation** - Trusted execution environment verifications
Agents can declare support for one or more trust models in their registration.

## Registration

Agents are registered on-chain following the ERC-8004 standard. Registration creates:

- An NFT representing the agent identity (unique agent ID per chain)
- A registration file stored on IPFS or HTTP containing capabilities, endpoints, and metadata
- On-chain metadata including optional wallet address, ENS name, and custom metadata
- Ownership and operator permissions (who can update the agent)
## Discovery

The SDK provides powerful search to discover agents by:

- Name and description (text search)
- Endpoint types (MCP, A2A, ENS, etc.)
- Specific capabilities (skills, tools, prompts, resources, tasks)
- Trust models
- x402 support
- Active status (whether the agent is currently available)
- Wallet address for payments

## Feedback & Reputation

Feedback provides reputation signals and can be related to specific agent capabilities or overall performance.

### Feedback Attributes

Each feedback includes:

- **Value** (signed decimal) - Reputation/trust value *(mandatory)*
- **Tags** - Usually replicate key attributes (e.g., tool name “fetch_file”, skill “data_analysis”) *(optional)*
- **MCP fields** - `mcpTool`, `mcpPrompt`, `mcpResource` *(optional)*
- **A2A fields** - `a2aSkills`, `a2aTaskId`, `a2aContextId` *(optional)*
- **OASF fields** - `oasfSkills`, `oasfDomains` *(optional)*
- **Payment proof** - Cryptographic proof of x402 payment *(optional)*
### Feedback Storage

Feedback can be stored in two ways, giving developers flexibility:

**Option 1: On-chain only (simplest)**

- Store only value, tags and endpoint directly on-chain
- No off-chain feedback file needed
- Maximum simplicity

**Option 2: Hybrid on-chain/off-chain**

- Store value, tags and endpoint on-chain
- Store complete feedback data (text + spec-aligned protocol fields + payment proofs) in a feedback file on IPFS or HTTP
- On-chain commitment (IPFS CID or HTTP URI + hash) ensures tamper-proof security
- More detailed feedback with cryptographic guarantees

Both approaches are valid - developers can choose based on their needs for simplicity vs. detailed feedback storage.

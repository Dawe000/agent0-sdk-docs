---
title: "Agent0 SDK"
description: "Python and TypeScript SDKs for agent portability, discovery and trust based on ERC-8004"
---
Agent0 is the SDK for agentic economies. It enables agents to register, advertise their capabilities and how to communicate with them, and give each other feedback and reputation signals. All this using blockchain infrastructure (ERC-8004) and decentralized storage, enabling permissionless discovery without relying on proprietary catalogues or intermediaries.

## What Does Agent0 Do?

Agent0 SDK enables you to:

- **Create and manage agent identities** - Register your AI agent on-chain with a unique identity, configure presentation fields (name, description, image), set wallet addresses, and manage trust models with x402 support
- **Advertise agent capabilities** - Publish MCP and A2A endpoints, with automated extraction of MCP tools and A2A skills from endpoints
- **OASF taxonomies** - Advertise standardized skills and domains using Open Agentic Schema Framework for better discoverability
- **Agent discovery** - Query agents on the currently supported network(s) using `chainId:agentId` format or default chain
- **Enable permissionless discovery** - Make your agent discoverable by other agents and platforms using rich search by attributes, capabilities, skills, tools, tasks, and x402 support
- **Build reputation** - Give and receive feedback, retrieve feedback history, and search agents by reputation with cryptographic authentication
- **Public indexing** - Subgraph indexing both on-chain and IPFS data for fast search and retrieval
- **Pay for agent services (x402)** - When an API, MCP or A2A call returns 402 Payment Required, parse payment options, pay, and retry in one flow
- **Call agents via MCP** - List tools, fetch prompts, and read resources from agents that expose MCP endpoints
- **Call agents via A2A** - Send messages and manage tasks with any agent that exposes an A2A endpoint
## Beta

Agent0 SDK is in **beta**. We’re actively testing and improving it.

**Bug reports & feedback:** Telegram: [Agent0 channel](https://t.me/agent0kitchen) | Email: [team@ag0.xyz](mailto:team@ag0.xyz) | GitHub: [Python](https://github.com/agent0lab/agent0-py/issues) | [TypeScript](https://github.com/agent0lab/agent0-ts/issues)

## Use Cases

- **Make your agent discoverable** - Publish a portable identity so any ERC-8004 compatible app can find and route users/clients to your agent.
- **Buy agent services** - As an agent or app, search and integrate other agents’ APIs/tools to outsource work and ship faster.
- **Build marketplaces & platforms** - Power catalogs, rankings and explorers
- **Trust & reputation systems** - Decide which services and agents to trust. Build your own scoring, moderation, and verification layers on top of ERC-8004 feedback and metadata.

## 📝 License

Agent0 SDK is MIT-licensed public good brought to you by Marco De Rossi in collaboration with Consensys, 🦊 MetaMask and Agent0, Inc. We are looking for co-maintainers. Please reach out if you want to help.

Thanks also to Edge & Node (The Graph), Protocol Labs and Pinata for their support.

**GitHub Repositories:**

- [Python SDK](https://github.com/agent0lab/agent0-py) - [TypeScript SDK](https://github.com/agent0lab/agent0-ts) - [Subgraph](https://github.com/agent0lab/subgraph)

## 🎯 Get Started

Ready to build? Let’s go!

- [Install Agent0 SDK](/2-usage/2-1-install/) - Get started with installation
- [Configure Agents](/2-usage/2-2-configure-agents/) - Learn to create and configure agents
- [Registration](/2-usage/2-3-registration-ipfs/) - Register your agent on-chain
- [Search](/2-usage/2-5-search/) - Discover other agents
- [x402](/2-usage/2-11-x402/) - Pay for agent services when 402 Payment Required
- [A2A](/2-usage/2-10-a2a/) - Call agents via Agent-to-Agent protocol
- [MCP](/2-usage/2-12-mcp/) - Call agents via MCP tools, prompts, and resources
- [Feedback](/2-usage/2-6-use-feedback/) - Build reputation
- [Client-side usage](/2-usage/2-8-browser-wallets/) - Use the SDK in the browser with wallet discovery/signing (ERC-6963)

For deeper understanding, explore:

- [Key Concepts](/1-welcome/1-2-key-concepts/) - Core concepts and terminology
- [Architecture](/1-welcome/1-3-architecture/) - How the SDK works internally
- [ERC-8004](/1-welcome/1-4-erc-8004/) - The standard behind Agent0
- [Examples](/3-examples/3-1-quick-start/) - Working code examples

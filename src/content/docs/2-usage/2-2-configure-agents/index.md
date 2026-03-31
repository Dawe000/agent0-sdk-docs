---
title: "Configure Agents"
description: "Complete guide to agent configuration"
---
Learn how to create, configure, and manage agents with all available fields and options.

## Creating an Agent

Create a new agent in memory (not yet registered):

<Tabs>
<TabItem label="Python">

```python
from agent0_sdk import SDK

# Initialize SDK
sdk = SDK(
    chainId=11155111,
    rpcUrl="https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    signer=your_private_key,
    ipfs="pinata",
    pinataJwt=your_pinata_jwt
)

# Create an agent
agent = sdk.createAgent(
    name="My AI Agent",
    description="An intelligent assistant that helps with various tasks. Skills: data analysis, code generation, natural language processing. Pricing: $0.10 per request, free tier available.",
    image="https://example.com/agent-image.png"  # Optional
)
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';

// Initialize SDK
const sdk = new SDK({
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
  privateKey: yourPrivateKey, // optional for read-only
  ipfs: 'pinata',
  pinataJwt: yourPinataJwt,
});

// Create an agent
const agent = sdk.createAgent(
  'My AI Agent',
  'An intelligent assistant that helps with various tasks. Skills: data analysis, code generation, natural language processing. Pricing: $0.10 per request, free tier available.',
  'https://example.com/agent-image.png' // Optional
);
```

</TabItem>
</Tabs>

## Core Fields

### Name and Description

<Tabs>
<TabItem label="Python">

```python
# Update basic information
agent.updateInfo(
    name="Updated Agent Name",
    description="Updated description",
    image="https://example.com/new-image.png"
)
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Update basic information
agent.updateInfo(
  'Updated Agent Name',
  'Updated description',
  'https://example.com/new-image.png'
);
```

</TabItem>
</Tabs>

### Active Status

<Tabs>
<TabItem label="Python">

```python
# Set agent as active/inactive
agent.setActive(True)   # Active (visible in searches)
agent.setActive(False)  # Inactive (hidden but not deleted)
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Set agent as active/inactive
agent.setActive(true);  // Active (visible in searches)
agent.setActive(false); // Inactive (hidden but not deleted)
```

</TabItem>
</Tabs>

### x402 Payment Support

<Tabs>
<TabItem label="Python">

```python
# Enable/disable x402 payment support
agent.setX402Support(True)
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Enable/disable x402 payment support
agent.setX402Support(true);
```

</TabItem>
</Tabs>

## Endpoint Configuration

### MCP (Model Context Protocol) Endpoint

<Tabs>
<TabItem label="Python">

```python
# Set MCP endpoint
agent.setMCP(endpoint="https://mcp.example.com/")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Set MCP endpoint (async in TypeScript)
await agent.setMCP('https://mcp.example.com/');
```

</TabItem>
</Tabs>

When you set an MCP endpoint, the SDK automatically:

- Fetches tools, prompts, and resources from the endpoint
- Populates the agent’s capabilities
### A2A (Agent-to-Agent) Endpoint

<Tabs>
<TabItem label="Python">

```python
# Set A2A endpoint
agent.setA2A(agentcard="https://a2a.example.com/agent-card.json")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Set A2A endpoint (async in TypeScript)
await agent.setA2A('https://a2a.example.com/agent-card.json');
```

</TabItem>
</Tabs>

The SDK automatically:

- Fetches skills from the A2A agent card
- Indexes capabilities for search
### ENS

<Tabs>
<TabItem label="Python">

```python
# Set ENS name
agent.setENS(name="myagent.eth")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Set ENS name
agent.setENS('myagent.eth');
```

</TabItem>
</Tabs>

This stores the ENS name both:

- In the registration file
- As on-chain metadata
### Removing Endpoints

<Tabs>
<TabItem label="Python">

```python
# Remove specific endpoint type
agent.removeEndpoint(type=EndpointType.MCP)

# Remove by value
agent.removeEndpoint(value="https://old-endpoint.com")

# Remove all endpoints
agent.removeEndpoints()
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { EndpointType } from 'agent0-sdk';

// Remove specific endpoint type
agent.removeEndpoint(EndpointType.MCP);

// Remove by value
agent.removeEndpoint({ value: 'https://old-endpoint.com' });

// Remove all endpoints
agent.removeEndpoints();
```

</TabItem>
</Tabs>

## Wallet Configuration

For runtime protocol invocation (calling other agents), see [A2A usage](/2-usage/2-10-a2a/) and [MCP usage](/2-usage/2-12-mcp/).

### Default behavior (wallet is set to the owner by default)

Per ERC-8004, `agentWallet` is **initially set to the agent owner’s address**.

- **If you don’t call `setWallet()`**: the agent wallet remains the **owner wallet** by default.
- **When you should set a dedicated agent wallet**: only if you want the agent to use a **different** wallet than the owner (e.g., separation of duties, hot wallet vs cold owner, different chain wallet).
- **After a transfer**: `agentWallet` is reset to the **zero address** and must be re-verified by the new owner by calling `setWallet()`.

### Setting a dedicated agent wallet (signature-verified)

`agentWallet` is a **reserved on-chain** attribute. Setting it is signature-verified per ERC-8004.

- **Who sends the transaction**: the SDK signer (typically the agent **owner** or an authorized **operator**) submits the on-chain transaction.
- **Developer-facing SDK API**: `agent.setWallet(...)`.
- **Who must sign the message**: the **new wallet** must authorize the change by signing the EIP-712 typed data (EOA), or by providing an ERC-1271-compatible signature payload (smart contract wallet).

<Tabs>
<TabItem label="Python">

```python
# You must register the agent first, then call setWallet() if you want a dedicated wallet
# different from the owner (the default effective wallet).
tx = agent.registerIPFS()
tx.wait_confirmed(timeout=180)

# --- EOA flow ---
# The *new wallet* must sign the EIP-712 typed data.
# If the new wallet is NOT the same as the SDK signer, provide `new_wallet_signer`.
agent.setWallet(
    new_wallet="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    chainId=11155111,
    new_wallet_signer=NEW_WALLET_PRIVATE_KEY,  # private key for 0x742d...
)

# --- One-wallet shortcut ---
# If the SDK signer IS the same address as `new_wallet`, you can omit `new_wallet_signer`
# and the SDK will auto-sign with its signer.
# agent.setWallet(new_wallet="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", chainId=11155111)

# --- Smart contract wallet flow (ERC-1271) ---
# For contract wallets, the SDK cannot produce the wallet signature for you.
# You must obtain `signature` bytes from your wallet’s signing mechanism and pass it in:
#
# signature_bytes = ...  # produced externally by the contract wallet (e.g., Safe)
# agent.setWallet(
#     new_wallet=CONTRACT_WALLET_ADDRESS,
#     chainId=11155111,
#     signature=signature_bytes,
# )
```

</TabItem>
<TabItem label="TypeScript">

```ts
// You must register the agent first, then call setWallet().
const regTx = await agent.registerIPFS();
await regTx.waitConfirmed();

// --- EOA flow ---
// The *new wallet* must sign the EIP-712 typed data.
// If the new wallet is NOT the same as the SDK signer, pass `newWalletPrivateKey`.
const tx = await agent.setWallet('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', {
  newWalletPrivateKey: NEW_WALLET_PRIVATE_KEY, // must match 0x742d...
  // deadline?: number, // optional; must be a short window
});
if (tx) await tx.waitConfirmed();

// --- One-wallet shortcut ---
// If the SDK signer address IS the same as `newWallet`, you can omit newWalletPrivateKey:
// await agent.setWallet('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');

// --- Smart contract wallet flow (ERC-1271) ---
// Provide a signature payload produced by the contract wallet’s signing mechanism.
// const signature = await yourContractWalletSignTypedData(...);
// await agent.setWallet(CONTRACT_WALLET_ADDRESS, { signature });
```

</TabItem>
</Tabs>

The wallet address is stored on-chain as the **reserved** `agentWallet` attribute and requires signature verification (ERC-8004).

### Unsetting the verified agent wallet

If you previously set a dedicated verified `agentWallet` and want to remove it (reverting to “unset” on-chain), use:

- Python: `agent.unsetWallet()`
- TypeScript: `await agent.unsetWallet()`

This clears the agent’s on-chain `agentWallet` bytes.

### “Exactly what do I sign?” (EOA vs smart contract wallet)

Both SDKs build the EIP-712 typed data internally. Conceptually, the **new wallet** signs a message like:

- **agentId**: the agent tokenId
- **newWallet**: the wallet you’re setting
- **owner**: the current agent owner (read from the registry)
- **deadline**: a short expiry window enforced by the contract
- **domain**: the Identity Registry EIP-712 domain (chainId + verifyingContract, plus name/version)

#### EOA

- **EOA signing (Python)**: pass `new_wallet_signer=...` (private key / eth-account account) unless the SDK signer *is* the new wallet.
- **EOA signing (TypeScript)**: pass `newWalletPrivateKey` unless the SDK signer *is* the new wallet.

#### Smart contract wallet (ERC-1271)

For contract wallets, you must supply `signature` / `signature` bytes that your wallet will validate in `isValidSignature`.

- The **SDK still sends the on-chain transaction** (owner/operator).
- The **signature payload must be produced externally** (wallet-specific). For example, a Safe typically requires collecting owner signatures and building the Safe-specific signature bytes.

If you need an ERC-1271 signature, produce it with your wallet’s signing flow (Safe, etc.) and pass it as `{ signature }` in `setWallet(...)`.
## OASF Skills and Domains

Agents can advertise their capabilities using the Open Agentic Schema Framework (OASF) taxonomies. This provides standardized classifications for skills and domains, improving discoverability and interoperability.

### Adding Skills

<Tabs>
<TabItem label="Python">

```python
# Add skill without validation (allows any string)
agent.addSkill("custom_skill/my_skill", validate_oasf=False)

# Add skill with validation (ensures it exists in OASF taxonomy)
agent.addSkill("advanced_reasoning_planning/strategic_planning", validate_oasf=True)
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Add skill without validation (allows any string)
agent.addSkill('custom_skill/my_skill', false);

// Add skill with validation (ensures it exists in OASF taxonomy)
agent.addSkill('advanced_reasoning_planning/strategic_planning', true);
```

</TabItem>
</Tabs>

### Adding Domains

<Tabs>
<TabItem label="Python">

```python
# Add domain without validation
agent.addDomain("custom_domain/my_domain", validate_oasf=False)

# Add domain with validation
agent.addDomain("finance_and_business/investment_services", validate_oasf=True)
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Add domain without validation
agent.addDomain('custom_domain/my_domain', false);

// Add domain with validation
agent.addDomain('finance_and_business/investment_services', true);
```

</TabItem>
</Tabs>

### Removing Skills and Domains

<Tabs>
<TabItem label="Python">

```python
# Remove a skill
agent.removeSkill("advanced_reasoning_planning/strategic_planning")

# Remove a domain
agent.removeDomain("finance_and_business/investment_services")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Remove a skill
agent.removeSkill('advanced_reasoning_planning/strategic_planning');

// Remove a domain
agent.removeDomain('finance_and_business/investment_services');
```

</TabItem>
</Tabs>

### Method Chaining

All OASF methods support chaining:

<Tabs>
<TabItem label="Python">

```python
agent.addSkill("data_engineering/data_transformation_pipeline", validate_oasf=True)\
     .addDomain("technology/data_science", validate_oasf=True)\
     .addSkill("natural_language_processing/summarization", validate_oasf=True)
```

</TabItem>
<TabItem label="TypeScript">

```ts
agent
  .addSkill('data_engineering/data_transformation_pipeline', true)
  .addDomain('technology/data_science', true)
  .addSkill('natural_language_processing/summarization', true);
```

</TabItem>
</Tabs>

### OASF in Registration File

OASF skills and domains are stored in the registration file’s `endpoints` array:

```json
{
  "endpoints": [
    {
      "name": "OASF",
      "endpoint": "https://github.com/agntcy/oasf/",
      "version": "v0.8.0",
      "skills": [
        "advanced_reasoning_planning/strategic_planning",
        "data_engineering/data_transformation_pipeline"
      ],
      "domains": [
        "finance_and_business/investment_services",
        "technology/data_science/data_visualization"
      ]
    }
  ]
}
```

**Note:** Validation is disabled by default (`validate_oasf=False` / `validateOASF=false`) to allow flexibility, but it’s recommended to enable it to ensure your agent’s capabilities are properly classified.

**Taxonomy Files:** The SDK includes complete OASF v0.8.0 taxonomy files:

- Python: `agent0_sdk/taxonomies/all_skills.json` and `all_domains.json`
- TypeScript: `src/taxonomies/all_skills.json` and `all_domains.json`
## Trust Models

### Set Trust Models

<Tabs>
<TabItem label="Python">

```python
# Using convenience method
agent.setTrust(
    reputation=True,
    cryptoEconomic=True,
    teeAttestation=False
)
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Using convenience method
agent.setTrust(
  true,  // reputation
  true,  // cryptoEconomic
  false  // teeAttestation
);
```

</TabItem>
</Tabs>

Available trust models:

- `reputation` - On-chain feedback system
- `crypto-economic` - Economic stake and slashing
- `tee-attestation` - Trusted execution environment proofs
## On-chain Metadata Management

<Tabs>
<TabItem label="Python">

```python
# Set on-chain metadata (stored on blockchain)
agent.setMetadata({
    "version": "1.0.0",
    "category": "developer-tools",
    "pricing": "free"
})

# Get metadata
metadata = agent.getMetadata()
print(metadata)
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Set on-chain metadata (stored on blockchain)
agent.setMetadata({
  version: '1.0.0',
  category: 'developer-tools',
  pricing: 'free',
});

// Get metadata
const metadata = agent.getMetadata();
console.log(metadata);
```

</TabItem>
</Tabs>

Metadata is stored as on-chain key-value pairs in the Identity Registry contract.

## Loading an Existing Agent

Load an agent that’s already registered for editing:

<Tabs>
<TabItem label="Python">

```python
# Load by agent ID
# Format: "chainId:agentId" (e.g., "11155111:123") or just "agentId" (uses default chain)
# where 11155111 is the Sepolia chain ID and 123 is the agent's token ID
agent = sdk.loadAgent("11155111:123")  # Explicit chain
agent = sdk.loadAgent("123")  # Uses SDK's default chain

# All fields are automatically loaded
print(f"Name: {agent.name}")
print(f"Description: {agent.description}")
print(f"MCP: {agent.mcpEndpoint}")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Load by agent ID (async in TypeScript)
// Format: "chainId:agentId" (e.g., "11155111:123") or just "agentId" (uses default chain)
// where 11155111 is the Sepolia chain ID and 123 is the agent's token ID
const agent = await sdk.loadAgent('11155111:123');  // Explicit chain
const agent = await sdk.loadAgent('123');  // Uses SDK's default chain

// All fields are automatically loaded
console.log(`Name: ${agent.name}`);
console.log(`Description: ${agent.description}`);
console.log(`MCP: ${agent.mcpEndpoint}`);
```

</TabItem>
</Tabs>

**Difference between `loadAgent()` and `getAgent()`:**

- **`sdk.loadAgent(agentId)`** - Returns an `Agent` object that can be modified and re-registered (loads registration file from IPFS/HTTP)
- **`sdk.getAgent(agentId)`** - Returns an `AgentSummary` object with read-only data (queries subgraph for fast access)
## Direct Property Access

All agent data can be accessed directly:

<Tabs>
<TabItem label="Python">

```python
# Identity
agent.agentId        # "11155111:123"
agent.agentURI       # "ipfs://Qm..."
agent.name           # "My Agent"
agent.description    # "Description text"
agent.image          # "https://..."

# Status
agent.active         # True/False
agent.x402support    # True/False

# Wallet
agent.walletAddress  # "0x..."
agent.walletChainId  # 11155111

# Endpoints (convenience properties)
agent.mcpEndpoint    # "https://..."
agent.a2aEndpoint    # "https://..."
agent.ensEndpoint    # "myagent.eth"

# Capabilities (populated from endpoints)
agent.mcpTools       # ["tool1", "tool2", ...]
agent.mcpPrompts     # ["prompt1", "prompt2", ...]
agent.mcpResources   # ["resource1", ...]
agent.a2aSkills      # ["skill1", "skill2", ...]

# Lists (read-only)
agent.endpoints      # List[Endpoint]
agent.trustModels    # List[TrustModel]
agent.metadata       # Dict[str, Any]
agent.owners         # List[str]
agent.operators      # List[str]
agent.updatedAt      # Unix timestamp
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Identity
agent.agentId        // "11155111:123" | undefined
agent.agentURI       // "ipfs://Qm..." | undefined
agent.name           // "My Agent"
agent.description    // "Description text"
agent.image          // "https://..." | undefined

// Status
agent.active         // true | false
agent.x402support    // true | false

// Wallet
agent.walletAddress  // "0x..." | undefined
agent.walletChainId  // number | undefined

// Endpoints (convenience properties)
agent.mcpEndpoint    // "https://..." | undefined
agent.a2aEndpoint    // "https://..." | undefined
agent.ensEndpoint    // "myagent.eth" | undefined

// Capabilities (populated from endpoints)
agent.mcpTools       // string[] | undefined
agent.mcpPrompts     // string[] | undefined
agent.mcpResources   // string[] | undefined
agent.a2aSkills      // string[] | undefined

// Access via getRegistrationFile() for lists
const regFile = agent.getRegistrationFile();
regFile.endpoints    // Endpoint[]
regFile.trustModels  // (TrustModel | string)[]
regFile.metadata     // Record
regFile.owners       // Address[]
regFile.operators    // Address[]
regFile.updatedAt     // Unix timestamp
```

</TabItem>
</Tabs>

## Complete Configuration Example

<Tabs>
<TabItem label="Python">

```python
# Create agent
agent = sdk.createAgent(
    name="My AI Agent",
    description="A powerful AI assistant",
    image="https://example.com/agent.png"
)

# Set endpoints
agent.setMCP("https://mcp.example.com/")
agent.setA2A("https://a2a.example.com/agent-card.json")
agent.setENS("myagent.eth")

# Set trust models
agent.setTrust(reputation=True, cryptoEconomic=True)

# Add OASF skills and domains
agent.addSkill("data_engineering/data_transformation_pipeline", validate_oasf=True)\
     .addDomain("technology/data_science", validate_oasf=True)

# Add metadata
agent.setMetadata({
    "version": "1.0.0",
    "language": "python",
    "framework": "agent0"
})

# Set status flags
agent.setActive(True)
agent.setX402Support(False)

# Register on-chain
tx = agent.registerIPFS()
tx.wait_confirmed(timeout=180)

# Optional: set a dedicated agent wallet on-chain (signature-verified; ERC-8004)
# agent.setWallet("0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb", chainId=11155111)

# Now ready!
print(f"Agent configured: {agent.name}")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Create agent
const agent = sdk.createAgent(
  'My AI Agent',
  'A powerful AI assistant',
  'https://example.com/agent.png'
);

// Set endpoints (async in TypeScript)
await agent.setMCP('https://mcp.example.com/');
await agent.setA2A('https://a2a.example.com/agent-card.json');
agent.setENS('myagent.eth');

// Set trust models
agent.setTrust(true, true, false); // reputation, cryptoEconomic, teeAttestation

// Add OASF skills and domains
agent
  .addSkill('data_engineering/data_transformation_pipeline', true)
  .addDomain('technology/data_science', true);

// Add metadata
agent.setMetadata({
  version: '1.0.0',
  language: 'typescript',
  framework: 'agent0',
});

// Set status flags
agent.setActive(true);
agent.setX402Support(false);

// Register on-chain
const regTx = await agent.registerIPFS();
await regTx.waitConfirmed();

// Optional: set a dedicated agent wallet on-chain (signature-verified; ERC-8004)
// await agent.setWallet('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');

// Now ready!
console.log(`Agent configured: ${agent.name}`);
```

</TabItem>
</Tabs>

## Next Steps

- Register your agent with [IPFS Registration](/2-usage/2-3-registration-ipfs/)
- Or use [HTTP Registration](/2-usage/2-4-registration-http/)

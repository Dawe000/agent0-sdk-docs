---
title: "Registration (IPFS)"
description: "Register agents with IPFS"
---
Register your agent on-chain with automatic IPFS storage for decentralized, censorship-resistant registration files.

## Alternative: Fully on-chain registration (data URI)

ERC-8004 also allows storing the entire registration JSON **directly on-chain** via a base64 `data:` URI (`data:application/json;base64,...`).

- Learn the fully on-chain flow here: [Registration (On-chain data URI)](/2-usage/2-9-registration-onchain-data-uri/)

## Overview

The IPFS registration flow handles everything automatically:

- Mint agent NFT (get agent ID)
- Upload registration file to IPFS
- Set IPFS URI on-chain
## Configuration

### Filecoin Pin

Protocol Labs offers free Filecoin pinning for ERC-8004 agents. [Learn more](https://t.me/ERC8004/1521)

<Tabs>
<TabItem label="Python">

```python
sdk = SDK(
    chainId=11155111,
    rpcUrl="https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    signer=private_key,
    ipfs="filecoinPin",
    filecoinPrivateKey="your-filecoin-private-key"
)
```

</TabItem>
<TabItem label="TypeScript">

```ts
const sdk = new SDK({
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
  privateKey: privateKey,
  ipfs: 'filecoinPin',
  filecoinPrivateKey: 'your-filecoin-private-key',
});
```

</TabItem>
</Tabs>

### Pinata

Pinata offers free pinning services for ERC-8004 agents. [Learn more](https://t.me/ERC8004/1629)

<Tabs>
<TabItem label="Python">

```python
sdk = SDK(
    chainId=11155111,
    rpcUrl="https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    signer=private_key,
    ipfs="pinata",
    pinataJwt="your-pinata-jwt-token"
)
```

</TabItem>
<TabItem label="TypeScript">

```ts
const sdk = new SDK({
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
  privateKey: privateKey,
  ipfs: 'pinata',
  pinataJwt: 'your-pinata-jwt-token',
});
```

</TabItem>
</Tabs>

### IPFS Node (Kubo daemon)

<Tabs>
<TabItem label="Python">

```python
sdk = SDK(
    chainId=11155111,
    rpcUrl="...",
    signer=private_key,
    ipfs="node",
    ipfsNodeUrl="https://ipfs.infura.io:5001"
)
```

</TabItem>
<TabItem label="TypeScript">

```ts
const sdk = new SDK({
  chainId: 11155111,
  rpcUrl: '...',
  privateKey: privateKey,
  ipfs: 'node',
  ipfsNodeUrl: 'https://ipfs.infura.io:5001',
});
```

</TabItem>
</Tabs>

### Embedded Helia (TypeScript)

If you prefer **no separate IPFS daemon**, you can run an embedded Helia node in-process:

```ts
const sdk = new SDK({
  chainId: 11155111,
  rpcUrl: '...',
  privateKey: privateKey,
  ipfs: 'helia',
});
```

## Register Agent

**Browser note:** you can run this flow client-side too—configure the SDK with `walletProvider` (EIP-1193) for writes. See [Client-side usage](/2-usage/2-8-browser-wallets/).

<Tabs>
<TabItem label="Python">

```python
# Configure your agent
agent = sdk.createAgent(...)
agent.setMCP("https://mcp.example.com/")
agent.setA2A("https://a2a.example.com/agent.json")

# Register - automatically handles everything!
tx = agent.registerIPFS()
registration_file = tx.wait_confirmed(timeout=180).result

# Get agent ID
print(f"Agent registered: {registration_file.agentId}")
print(f"Agent URI: {registration_file.agentURI}")  # ipfs://Qm...
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Configure your agent
const agent = sdk.createAgent(...);
await agent.setMCP('https://mcp.example.com/');
await agent.setA2A('https://a2a.example.com/agent.json');

// Register - automatically handles everything! (async in TypeScript)
const tx = await agent.registerIPFS();
const { result: registrationFile } = await tx.waitConfirmed();

// Get agent ID
console.log(`Agent registered: ${registrationFile.agentId}`);
console.log(`Agent URI: ${registrationFile.agentURI}`); // ipfs://Qm...
```

</TabItem>
</Tabs>

## Update Registration

After making changes, re-register to update on-chain:

<Tabs>
<TabItem label="Python">

```python
# Modify agent
agent.updateInfo(description="Updated description")
agent.setMCP("https://new-mcp.example.com")

# Re-register (uploads new file, updates URI)
tx = agent.registerIPFS()
updated = tx.wait_confirmed(timeout=180).result

print(f"Updated: {updated.agentURI}")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Modify agent
agent.updateInfo(undefined, 'Updated description', undefined);
await agent.setMCP('https://new-mcp.example.com');

// Re-register (uploads new file, updates URI) - async in TypeScript
const tx = await agent.registerIPFS();
const { result: registrationFile } = await tx.waitConfirmed();

console.log(`Updated: ${registrationFile.agentURI}`);
```

</TabItem>
</Tabs>

The SDK automatically:

- Uploads updated registration file to IPFS
- Only updates changed metadata on-chain
- Sets new IPFS URI
- Clears dirty metadata flags
## Registration File Format

Your agent’s registration file is stored on IPFS:

```json
{
  "type": "https://eips.ethereum.org/EIPS/eip-8004#registration-v1",
  "name": "My AI Agent",
  "description": "Agent description",
  "image": "https://example.com/image.png",
  "services": [
    {
      "name": "MCP",
      "endpoint": "https://mcp.example.com/",
      "version": "2025-06-18"
    }
  ],
  "registrations": [
    {
      "agentId": 123,
      "agentRegistry": "eip155:11155111:0x..."
    }
  ],
  "supportedTrust": ["reputation"],
  "active": true,
  "x402Support": false,
  "updatedAt": 1234567890
}
```

## Optional: Endpoint Domain Verification (.well-known)

If you want verifiers to treat an HTTPS endpoint domain as “verified”, you can publish:

- `https://{endpoint-domain}/.well-known/agent-registration.json`

That file should contain a `registrations` entry matching your on-chain identity:

```json
{
  "registrations": [
    {
      "agentId": 123,
      "agentRegistry": "eip155:11155111:0x8004A818BFB912233c491871b3d84c89A494BD9e"
    }
  ]
}
```

Notes:

- This is optional and is primarily used by third-party verifiers/aggregators.

## Benefits of IPFS

- **Decentralized** - No single point of failure
- **Censorship resistant** - Data replicated across nodes
- **Content addressing** - Guaranteed integrity via CIDs
- **Permanent** - Files remain accessible with proper pinning
## Next Steps

- Learn [HTTP Registration](/2-usage/2-4-registration-http/)
- Explore [Search](/2-usage/2-5-search/)

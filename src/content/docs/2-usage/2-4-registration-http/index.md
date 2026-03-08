---
title: "Registration (HTTP)"
description: "Register agents with HTTP URLs"
---
Register your agent on-chain with a direct HTTP/HTTPS URL to your registration file.

## Alternative: Fully on-chain registration (data URI)

ERC-8004 also allows storing the entire registration JSON **directly on-chain** via a base64 `data:` URI (`data:application/json;base64,...`), removing the need for HTTP hosting.

- Learn the fully on-chain flow here: [Registration (On-chain data URI)](/2-usage/2-9-registration-onchain-data-uri/)

## Overview

HTTP registration is useful when:

- You host your own registration files
- You want full control over file serving
- You prefer traditional hosting over IPFS
## Step-by-Step Process

### 1. Configure Your Agent

<Tabs>
<TabItem label="Python">

```python
# Create and configure your agent
agent = sdk.createAgent(
    name="My AI Agent",
    description="Agent description",
    image="https://example.com/image.png"
)

agent.setMCP("https://mcp.example.com/")
agent.setA2A("https://a2a.example.com/agent.json")
agent.setENS("myagent.eth")
agent.setTrust(reputation=True)
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Create and configure your agent
const agent = sdk.createAgent(
  'My AI Agent',
  'Agent description',
  'https://example.com/image.png'
);

await agent.setMCP('https://mcp.example.com/');
await agent.setA2A('https://a2a.example.com/agent.json');
agent.setENS('myagent.eth');
agent.setTrust(true); // reputation=true
```

</TabItem>
</Tabs>

### 2. Generate Registration File Content

Get the JSON content from the SDK:

<Tabs>
<TabItem label="Python">

```python
# Get the registration file object
registration_file = agent.registrationFile()

# Convert to dictionary (JSON-ready)
registration_data = registration_file.to_dict()

# Or get as formatted JSON string
json_content = str(registration_file)  # Pretty-printed JSON
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Get the registration file object
const registrationFile = agent.getRegistrationFile();

// Convert to JSON string (pretty-printed)
const jsonContent = JSON.stringify(registrationFile, null, 2);

// Or get as object
const registrationData = registrationFile;
```

</TabItem>
</Tabs>

### 3. Host the Registration File

Save the JSON content to your web server:

<Tabs>
<TabItem label="Python">

```python
# Save to file
with open("my-agent.json", "w") as f:
    f.write(json_content)

# Upload to your web server
# Example URLs:
# https://yourdomain.com/agents/my-agent.json
# https://yourusername.github.io/agents/my-agent.json
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Save to file (Node.js)
import * as fs from 'fs';

fs.writeFileSync('my-agent.json', jsonContent, 'utf8');

// Upload to your web server
// Example URLs:
// https://yourdomain.com/agents/my-agent.json
// https://yourusername.github.io/agents/my-agent.json
```

</TabItem>
</Tabs>

## Optional: Endpoint Domain Verification (.well-known)

If you want verifiers to treat an HTTPS endpoint domain as “verified”, publish:

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
- If your `agentURI` is hosted on the same domain, the extra check is typically unnecessary.

### 4. Register On-Chain

<Tabs>
<TabItem label="Python">

```python
# Register with your HTTP URL
tx = agent.registerHTTP("https://yourdomain.com/agents/my-agent.json")
registration_file = tx.wait_confirmed(timeout=180).result

print(f"Agent registered: {registration_file.agentId}")
print(f"Agent URI: {registration_file.agentURI}")  # https://yourdomain.com/...
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Register with your HTTP URL (async in TypeScript)
const tx = await agent.registerHTTP('https://yourdomain.com/agents/my-agent.json');
const { result: registrationFile } = await tx.waitConfirmed();

console.log(`Agent registered: ${registrationFile.agentId}`);
console.log(`Agent URI: ${registrationFile.agentURI}`); // https://yourdomain.com/...
```

</TabItem>
</Tabs>

## Complete Example

<Tabs>
<TabItem label="Python">

```python
from agent0_sdk import SDK

# Initialize SDK
sdk = SDK(
    chainId=11155111,
    rpcUrl="https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    signer=private_key
)

# 1. Configure agent
agent = sdk.createAgent(
    name="My AI Agent",
    description="A helpful AI assistant",
    image="https://example.com/agent.png"
)
agent.setMCP("https://mcp.example.com/")
agent.setA2A("https://a2a.example.com/agent.json")

# 2. Generate registration file
registration_data = agent.registrationFile().to_dict()
json_content = str(agent.registrationFile())

# 3. Save and upload to your server
with open("my-agent.json", "w") as f:
    f.write(json_content)
# Upload to: https://yourdomain.com/agents/my-agent.json

# 4. Register on-chain
tx = agent.registerHTTP("https://yourdomain.com/agents/my-agent.json")
tx.wait_confirmed(timeout=180)

print(f"✅ Agent registered: {agent.agentId}")
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import * as fs from 'fs';

// Initialize SDK
const sdk = new SDK({
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
  privateKey: privateKey,
});

// 1. Configure agent
const agent = sdk.createAgent(
  'My AI Agent',
  'A helpful AI assistant',
  'https://example.com/agent.png'
);
await agent.setMCP('https://mcp.example.com/');
await agent.setA2A('https://a2a.example.com/agent.json');

// 2. Generate registration file
const registrationData = agent.getRegistrationFile();
const jsonContent = JSON.stringify(registrationData, null, 2);

// 3. Save and upload to your server
fs.writeFileSync('my-agent.json', jsonContent, 'utf8');
// Upload to: https://yourdomain.com/agents/my-agent.json

// 4. Register on-chain (async in TypeScript)
const tx = await agent.registerHTTP('https://yourdomain.com/agents/my-agent.json');
const { result: registrationFile } = await tx.waitConfirmed();

console.log(`✅ Agent registered: ${registrationFile.agentId}`);
```

</TabItem>
</Tabs>

## Update Registration

To update an agent:

<Tabs>
<TabItem label="Python">

```python
# 1. Load existing agent
agent = sdk.loadAgent("11155111:123")

# 2. Modify configuration
agent.updateInfo(description="Updated description")
agent.setMCP("https://new-mcp.example.com")

# 3. Generate new registration file
json_content = str(agent.registrationFile())

# 4. Upload updated file to your server
with open("my-agent-updated.json", "w") as f:
    f.write(json_content)

# 5. Update URI on-chain (only if the URI has changed)
agent.setAgentUri("https://yourdomain.com/agents/my-agent-updated.json")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// 1. Load existing agent (async in TypeScript)
const agent = await sdk.loadAgent('11155111:123');

// 2. Modify configuration
agent.updateInfo(undefined, 'Updated description');
await agent.setMCP('https://new-mcp.example.com');

// 3. Generate new registration file
const jsonContent = JSON.stringify(agent.getRegistrationFile(), null, 2);

// 4. Upload updated file to your server
fs.writeFileSync('my-agent-updated.json', jsonContent, 'utf8');

// 5. Update URI on-chain (only if the URI has changed) - async in TypeScript
await agent.setAgentUri('https://yourdomain.com/agents/my-agent-updated.json');
```

</TabItem>
</Tabs>

## Registration File Format

The SDK generates ERC-8004 compliant registration files:

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
      "version": "2025-06-18",
      "mcpTools": ["tool1", "tool2"],
      "mcpPrompts": ["prompt1"],
      "mcpResources": ["resource1"]
    },
    {
      "name": "A2A",
      "endpoint": "https://a2a.example.com/agent.json",
      "version": "0.30",
      "a2aSkills": ["skill1", "skill2"]
    }
  ],
  "registrations": [
    {
      "agentId": 123,
      "agentRegistry": "eip155:11155111:0x8004a6090Cd10A7288092483047B097295Fb8847"
    }
  ],
  "supportedTrust": ["reputation"],
  "active": true,
  "x402Support": false,
  "updatedAt": 1234567890
}
```

## Next Steps

- Learn about [Search](/2-usage/2-5-search/)
- Explore [Feedback](/2-usage/2-6-use-feedback/)

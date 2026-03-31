---
title: "Agent API"
description: "Agent class reference"
---
Complete reference for the Agent class.

## Properties

All properties are read-only. Use setter methods to modify values.

<Tabs>
<TabItem label="Python">

```python
# Identity
agent.agentId           # Optional[str]
agent.agentURI          # Optional[str]
agent.name              # str
agent.description       # str
agent.image             # Optional[str]

# Status
agent.active            # bool
agent.x402support       # bool
agent.updatedAt         # int

# Wallet
agent.walletAddress     # Optional[str]
agent.walletChainId     # Optional[int]

# Endpoints
agent.mcpEndpoint       # Optional[str]
agent.a2aEndpoint       # Optional[str]
agent.ensEndpoint       # Optional[str]

# Capabilities
agent.mcpTools          # Optional[List[str]]
agent.mcpPrompts        # Optional[List[str]]
agent.mcpResources      # Optional[List[str]]
agent.a2aSkills         # Optional[List[str]]

# Lists
agent.endpoints         # List[Endpoint]
agent.trustModels       # List[TrustModel]
agent.metadata          # Dict[str, Any]
agent.owners            # List[str]
agent.operators         # List[str]
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';
import type { AgentId, Address, URI } from 'agent0-sdk';

// Identity
agent.agentId          // AgentId | undefined
agent.agentURI         // URI | undefined
agent.name             // string
agent.description      // string
agent.image            // URI | undefined

// Status
agent.active           // boolean
agent.x402support      // boolean
// Note: updatedAt is in registrationFile.updatedAt

// Wallet
agent.walletAddress    // Address | undefined
agent.walletChainId    // number | undefined

// Endpoints
agent.mcpEndpoint      // string | undefined
agent.a2aEndpoint       // string | undefined
agent.ensEndpoint      // string | undefined

// Capabilities
agent.mcpTools         // string[] | undefined
agent.mcpPrompts       // string[] | undefined
agent.mcpResources     // string[] | undefined
agent.a2aSkills        // string[] | undefined

// Access via getRegistrationFile()
const regFile = agent.getRegistrationFile();
regFile.endpoints      // Endpoint[]
regFile.trustModels    // (TrustModel | string)[]
regFile.metadata       // Record
regFile.owners         // Address[]
regFile.operators      // Address[]
```

</TabItem>
</Tabs>

## Endpoint Methods

### setMCP

Set MCP endpoint.

<Tabs>
<TabItem label="Python">

```python
agent = agent.setMCP(
    endpoint: str,
    version: str = "2025-06-18",
    auto_fetch: bool = True
) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';

const agent: Agent = await agent.setMCP(
  endpoint: string,
  version?: string,
  autoFetch?: boolean
);
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is async and returns `Promise<this>` for chaining.

### setA2A

Set A2A endpoint.

<Tabs>
<TabItem label="Python">

```python
agent = agent.setA2A(
    agentcard: str,
    version: str = "0.30",
    auto_fetch: bool = True
) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';

const agent: Agent = await agent.setA2A(
  agentcard: string,
  version?: string,
  autoFetch?: boolean
);
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is async and returns `Promise<this>` for chaining.

### setENS

Set ENS endpoint.

<Tabs>
<TabItem label="Python">

```python
agent = agent.setENS(name: str, version: str = "1.0") -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';

const agent: Agent = agent.setENS(
  name: string,
  version?: string
);
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is synchronous and returns `this` for chaining.

### removeEndpoint

Remove endpoint(s).

<Tabs>
<TabItem label="Python">

```python
agent = agent.removeEndpoint(
    type: Optional[EndpointType] = None,
    value: Optional[str] = None
) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { EndpointType } from 'agent0-sdk';

// Remove specific endpoint type (wildcard over value)
agent.removeEndpoint(EndpointType.MCP);

// Remove by value (wildcard over type)
agent.removeEndpoint({ value: 'https://old-endpoint.com' });

// Remove by both type and value
agent.removeEndpoint({ type: EndpointType.MCP, value: 'https://old-endpoint.com' });

// Remove all endpoints
agent.removeEndpoint();
```

</TabItem>
</Tabs>

**TypeScript Note:** This method is not available in the TypeScript SDK. Manually filter endpoints from the registration file instead.

### removeEndpoints

Remove all endpoints.

<Tabs>
<TabItem label="Python">

```python
agent = agent.removeEndpoints() -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Note: This method is not available in TypeScript SDK
// Manually clear endpoints from registrationFile instead:
const regFile = agent.getRegistrationFile();
regFile.endpoints = [];
```

</TabItem>
</Tabs>

**TypeScript Note:** This method is not available in the TypeScript SDK. Manually clear endpoints from the registration file instead.

## Runtime Protocol Methods

When loaded via `sdk.loadAgent(...)`, an `Agent` can be used directly for runtime protocol invocation.

### MCP (agent.mcp)

Use `agent.mcp` for MCP runtime calls:

- `agent.mcp.tools.list()` / `agent.mcp.tools.call(...)`
- `agent.mcp.prompts.list()` / `agent.mcp.prompts.get(...)`
- `agent.mcp.resources.list()` / `agent.mcp.resources.templates()` / `agent.mcp.resources.read(...)`

For full runtime client semantics (including `AgentSummary` and URL inputs), see [SDK API — Runtime Client Methods](/5-reference/5-1-sdk/#runtime-client-methods).
For end-to-end MCP usage examples, see [Usage: MCP](/2-usage/2-12-mcp/).

### A2A (calling this agent)

Agent supports **messageA2A**, **listTasks**, and **loadTask** — the same runtime interface exposed by `sdk.createA2AClient(...)`.

`sdk.createA2AClient(...)` accepts `Agent`, `AgentSummary`, or URL. This page documents the Agent-instance runtime surface; see [SDK API — A2A](/5-reference/5-1-sdk/#a2a) for full signature/return details and [Usage: A2A](/2-usage/2-10-a2a/) for examples.

## OASF Methods

### addSkill

Add a skill to the OASF endpoint.

<Tabs>
<TabItem label="Python">

```python
agent = agent.addSkill(
    slug: str,
    validate_oasf: bool = False
) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
const agent: Agent = agent.addSkill(
  slug: string,
  validateOASF?: boolean
);
```

</TabItem>
</Tabs>

**Parameters:**

- `slug` (str): The skill slug to add (e.g., `"natural_language_processing/summarization"`)
- `validate_oasf` / `validateOASF` (bool, default: `False`): If `True`, validate the slug against the OASF taxonomy
**Returns:** `Agent` for method chaining

**Raises/Throws:** `ValueError` / `Error` if `validate_oasf=True` and the slug is not valid

### removeSkill

Remove a skill from the OASF endpoint.

<Tabs>
<TabItem label="Python">

```python
agent = agent.removeSkill(slug: str) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
const agent: Agent = agent.removeSkill(slug: string);
```

</TabItem>
</Tabs>

**Parameters:**

- `slug` (str): The skill slug to remove
**Returns:** `Agent` for method chaining

### addDomain

Add a domain to the OASF endpoint.

<Tabs>
<TabItem label="Python">

```python
agent = agent.addDomain(
    slug: str,
    validate_oasf: bool = False
) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
const agent: Agent = agent.addDomain(
  slug: string,
  validateOASF?: boolean
);
```

</TabItem>
</Tabs>

**Parameters:**

- `slug` (str): The domain slug to add (e.g., `"finance_and_business/investment_services"`)
- `validate_oasf` / `validateOASF` (bool, default: `False`): If `True`, validate the slug against the OASF taxonomy
**Returns:** `Agent` for method chaining

**Raises/Throws:** `ValueError` / `Error` if `validate_oasf=True` and the slug is not valid

### removeDomain

Remove a domain from the OASF endpoint.

<Tabs>
<TabItem label="Python">

```python
agent = agent.removeDomain(slug: str) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
const agent: Agent = agent.removeDomain(slug: string);
```

</TabItem>
</Tabs>

**Parameters:**

- `slug` (str): The domain slug to remove
**Returns:** `Agent` for method chaining

## Trust Model Methods

### setTrust

Set trust models using keywords.

<Tabs>
<TabItem label="Python">

```python
agent = agent.setTrust(
    reputation: bool = False,
    cryptoEconomic: bool = False,
    teeAttestation: bool = False
) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';

const agent: Agent = agent.setTrust(
  reputation?: boolean,
  cryptoEconomic?: boolean,
  teeAttestation?: boolean
);
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is synchronous and returns `this` for chaining.

### trustModels

Set trust models directly.

<Tabs>
<TabItem label="Python">

```python
agent = agent.trustModels(
    models: List[Union[TrustModel, str]]
) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Note: This method is not available in TypeScript SDK
// Manually set trustModels on registrationFile instead:
import type { TrustModel } from 'agent0-sdk';

const regFile = agent.getRegistrationFile();
regFile.trustModels = models; // (TrustModel | string)[]
```

</TabItem>
</Tabs>

**TypeScript Note:** This method is not available in the TypeScript SDK. Manually set `trustModels` on the registration file instead.

## Info Methods

### updateInfo

Update basic agent information.

<Tabs>
<TabItem label="Python">

```python
agent = agent.updateInfo(
    name: Optional[str] = None,
    description: Optional[str] = None,
    image: Optional[str] = None
) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';
import type { URI } from 'agent0-sdk';

const agent: Agent = agent.updateInfo(
  name?: string,
  description?: string,
  image?: URI
);
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is synchronous and returns `this` for chaining.

### setWallet

Set agent wallet **on-chain** with signature verification (ERC-8004 Jan 2026).

Notes:

- This is **on-chain only** and requires the agent to be **registered** (`agent.agentId` must exist).
- `agentWallet` is a **reserved on-chain metadata key**:
  - you **cannot** set it via `setMetadata()`
  - you **cannot** set it during `register()`
- EOAs use **EIP-712** signatures; smart wallets use **ERC-1271**.
- On transfer, the contract resets `agentWallet` to the **zero address**; the new owner must re-verify it.

<Tabs>
<TabItem label="Python">

```python
agent = agent.setWallet(
    new_wallet: Address,
    chainId: Optional[int] = None,
    *,
    new_wallet_signer: Optional[Union[str, Any]] = None,
    deadline: Optional[int] = None,
    signature: Optional[bytes] = None,
) -> Optional[TransactionHandle[Agent]]
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';
import type { Address, RegistrationFile, TransactionHandle } from 'agent0-sdk';

const tx: TransactionHandle<RegistrationFile> | undefined = await agent.setWallet(address as Address, {
  // deadline?: number
  // newWalletPrivateKey?: string
  // signature?: string | Uint8Array
});
if (tx) await tx.waitConfirmed();
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is async and returns a `TransactionHandle<RegistrationFile>` (or `undefined` if it was already set to that value).

### unsetWallet

Unset agent wallet **on-chain** (ERC-8004 Jan 2026).

Notes:

- This is **on-chain only** and requires the agent to be **registered** (`agent.agentId` must exist).
- This clears the reserved on-chain `agentWallet` value by sending the corresponding Identity Registry transaction.

<Tabs>
<TabItem label="Python">

```python
tx = agent.unsetWallet() -> Optional[TransactionHandle[Agent]]
```

</TabItem>
<TabItem label="TypeScript">

```ts
import type { RegistrationFile, TransactionHandle } from 'agent0-sdk';

const tx: TransactionHandle<RegistrationFile> | undefined = await agent.unsetWallet();
if (tx) await tx.waitConfirmed();
```

</TabItem>
</Tabs>

### setActive

Set active status.

<Tabs>
<TabItem label="Python">

```python
agent = agent.setActive(active: bool) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';

const agent: Agent = agent.setActive(active: boolean);
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is synchronous and returns `this` for chaining.

### setX402Support

Set x402 support.

<Tabs>
<TabItem label="Python">

```python
agent = agent.setX402Support(x402Support: bool) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';

const agent: Agent = agent.setX402Support(x402Support: boolean);
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is synchronous and returns `this` for chaining.

## Metadata Methods

### setMetadata

Set metadata.

<Tabs>
<TabItem label="Python">

```python
agent = agent.setMetadata(kv: Dict[str, Any]) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';

const agent: Agent = agent.setMetadata(
  kv: Record
);
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is synchronous and returns `this` for chaining.

### getMetadata

Get metadata.

<Tabs>
<TabItem label="Python">

```python
metadata = agent.getMetadata() -> Dict[str, Any]
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';

const metadata: Record = agent.getMetadata();
```

</TabItem>
</Tabs>

### delMetadata

Delete a metadata key.

<Tabs>
<TabItem label="Python">

```python
agent = agent.delMetadata(key: str) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';

const agent: Agent = agent.delMetadata(key: string);
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is synchronous and returns `this` for chaining.

## Registration Methods

### registerIPFS

Register with IPFS (recommended).

<Tabs>
<TabItem label="Python">

```python
tx = agent.registerIPFS() -> TransactionHandle[RegistrationFile]
reg_file = tx.wait_confirmed(timeout=180).result
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';
import type { RegistrationFile, TransactionHandle } from 'agent0-sdk';

const tx: TransactionHandle<RegistrationFile> = await agent.registerIPFS();
const { result: regFile } = await tx.waitConfirmed();
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is async and returns `Promise<RegistrationFile>`.

### registerOnChain

Register with a fully on-chain ERC-8004 registration file by writing `agentURI`/`tokenURI` as a base64 JSON `data:` URI (`data:application/json;base64,...`).

This is a convenient wrapper over the Identity Registry `register(...)` / `setAgentURI(...)` calls and is **additive** (does not change `registerIPFS()` or HTTP registration).

<Tabs>
<TabItem label="Python">

```python
tx = agent.registerOnChain() -> TransactionHandle[RegistrationFile]
reg_file = tx.wait_confirmed(timeout=180).result
```

</TabItem>
<TabItem label="TypeScript">

```ts
import type { RegistrationFile, TransactionHandle } from 'agent0-sdk';

const tx: TransactionHandle<RegistrationFile> = await agent.registerOnChain();
const { result: regFile } = await tx.waitConfirmed();
```

</TabItem>
</Tabs>

Notes:

- Writing large strings on-chain can be expensive (gas). Keep the registration JSON compact.
- `loadAgent()` enforces a max decoded `data:` URI size by default (256 KiB). Configure it on the SDK if needed.

### register

Register with direct URI.

<Tabs>
<TabItem label="Python">

```python
tx = agent.register(agentUri: str) -> TransactionHandle[RegistrationFile]
reg_file = tx.wait_confirmed(timeout=180).result
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';
import type { RegistrationFile, TransactionHandle, URI } from 'agent0-sdk';

const tx: TransactionHandle<RegistrationFile> = await agent.registerHTTP(
  agentUri: URI
);
const { result: regFile } = await tx.waitConfirmed();
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is named `registerHTTP` in TypeScript SDK and is async.

### updateRegistration

Update registration after edits.

<Tabs>
<TabItem label="Python">

```python
tx_or_file = agent.updateRegistration(
    agentURI: Optional[str] = None,
    idem: Optional[str] = None
) -> Union[RegistrationFile, TransactionHandle[RegistrationFile]]
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Note: This method is not available in TypeScript SDK
// Use registerIPFS() again to update existing registration:
const tx = await agent.registerIPFS();
const { result: regFile } = await tx.waitConfirmed();
// Or use setAgentUri() to update URI:
await agent.setAgentUri(newUri);
```

</TabItem>
</Tabs>

**TypeScript Note:** This method is not available in the TypeScript SDK. Use `registerIPFS()` again to update an existing registration, or `setAgentUri()` to update the URI.

### setAgentUri

Set agent URI locally.

<Tabs>
<TabItem label="Python">

```python
agent = agent.setAgentUri(uri: str) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';
import type { URI } from 'agent0-sdk';

await agent.setAgentUri(uri: URI);
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is async and updates the URI on-chain (not just locally).

## Ownership Methods

### transfer

Transfer ownership.

<Tabs>
<TabItem label="Python">

```python
tx = agent.transfer(
    to: str,
    approve_operator: bool = False,
    idem: Optional[str] = None
) -> TransactionHandle[Dict]
result = tx.wait_confirmed(timeout=180).result
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';
import type { Address, AgentId, TransactionHandle } from 'agent0-sdk';

const tx: TransactionHandle<{
  txHash: string;
  from: Address;
  to: Address;
  agentId: AgentId;
}> = await agent.transfer(
  newOwner: Address
);
const { result } = await tx.waitConfirmed();
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is async, only takes `newOwner` parameter (no `approve_operator` or `idem`), and returns a `TransactionHandle<...>`.

**Parameters:**

- `to` / `newOwner` (str / Address): Ethereum address of the new owner
**Returns:**

- Python: `Dict[str, Any]` containing:

- `txHash` (str): Transaction hash
- `from` (str): Previous owner address
- `to` (str): New owner address
- `agentId` (str): Agent ID that was transferred

- TypeScript: Object with typed fields `{ txHash: string; from: Address; to: Address; agentId: AgentId }`
**Raises/Throws:**

- Python: `ValueError`: If agent is not registered, address is invalid, or caller is not the owner
- TypeScript: `Error`: If agent is not registered, address is invalid, or caller is not the owner
**Example:**

<Tabs>
<TabItem label="Python">

```python
# Transfer agent to new owner
new_owner = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
tx = agent.transfer(new_owner)
result = tx.wait_confirmed(timeout=180).result

print(f"Transfer successful: {result['txHash']}")
print(f"New owner: {result['to']}")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Transfer agent to new owner
const newOwner = "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6";
const tx = await agent.transfer(newOwner);
const { result } = await tx.waitConfirmed();

console.log(`Transfer successful: ${result.txHash}`);
console.log(`New owner: ${result.to}`);
```

</TabItem>
</Tabs>

**Important Notes:**

- Only the current owner can transfer the agent
- Agent URI, metadata, and all other data remain unchanged
- Transfer is irreversible - ensure the new owner is correct
- Invalid addresses and self-transfers are automatically rejected
- Address validation includes checksum format verification
### addOperator

Add operator.

<Tabs>
<TabItem label="Python">

```python
tx = agent.addOperator(
    operator: str,
    idem: Optional[str] = None
) -> TransactionHandle[Dict]
result = tx.wait_confirmed(timeout=180).result
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Note: This method is not available in TypeScript SDK
// Use direct contract calls instead (see SDK API -> Advanced: direct contract calls)
```

</TabItem>
</Tabs>

**TypeScript Note:** This method is not available in the TypeScript SDK. Use direct contract calls instead (see SDK API -> Advanced: direct contract calls).

### removeOperator

Remove operator.

<Tabs>
<TabItem label="Python">

```python
tx = agent.removeOperator(
    operator: str,
    idem: Optional[str] = None
) -> TransactionHandle[Dict]
result = tx.wait_confirmed(timeout=180).result
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Note: This method is not available in TypeScript SDK
// Use direct contract calls instead (see SDK API -> Advanced: direct contract calls)
```

</TabItem>
</Tabs>

**TypeScript Note:** This method is not available in the TypeScript SDK. Use direct contract calls instead (see SDK API -> Advanced: direct contract calls).

### activate

Activate agent.

<Tabs>
<TabItem label="Python">

```python
reg_file = agent.activate(idem: Optional[str] = None) -> RegistrationFile
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Note: This method is not available in TypeScript SDK
// Use setActive(true) and registerIPFS() instead:
agent.setActive(true);
const tx = await agent.registerIPFS();
const { result: regFile } = await tx.waitConfirmed();
```

</TabItem>
</Tabs>

**TypeScript Note:** This method is not available in the TypeScript SDK. Use `setActive(true)` and `registerIPFS()` instead.

### deactivate

Deactivate agent.

<Tabs>
<TabItem label="Python">

```python
reg_file = agent.deactivate(idem: Optional[str] = None) -> RegistrationFile
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Note: This method is not available in TypeScript SDK
// Use setActive(false) and registerIPFS() instead:
agent.setActive(false);
const tx = await agent.registerIPFS();
const { result: regFile } = await tx.waitConfirmed();
```

</TabItem>
</Tabs>

**TypeScript Note:** This method is not available in the TypeScript SDK. Use `setActive(false)` and `registerIPFS()` instead.

## Utility Methods

### getRegistrationFile

Get registration file.

<Tabs>
<TabItem label="Python">

```python
reg_file = agent.getRegistrationFile() -> RegistrationFile
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { Agent } from 'agent0-sdk';
import type { RegistrationFile } from 'agent0-sdk';

const regFile: RegistrationFile = agent.getRegistrationFile();
```

</TabItem>
</Tabs>

### toJson

Convert to JSON.

<Tabs>
<TabItem label="Python">

```python
json_str = agent.toJson() -> str
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Note: This method is not available in TypeScript SDK
// Use JSON.stringify() on registrationFile instead:
const regFile = agent.getRegistrationFile();
const jsonStr = JSON.stringify(regFile, null, 2);
```

</TabItem>
</Tabs>

**TypeScript Note:** This method is not available in the TypeScript SDK. Use `JSON.stringify()` on the registration file instead.

### saveToFile

Save to file.

<Tabs>
<TabItem label="Python">

```python
agent.saveToFile(filePath: str) -> None
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Note: This method is not available in TypeScript SDK
// Use Node.js fs module instead:
import * as fs from 'fs';
const regFile = agent.getRegistrationFile();
fs.writeFileSync(filePath, JSON.stringify(regFile, null, 2));
```

</TabItem>
</Tabs>

**TypeScript Note:** This method is not available in the TypeScript SDK. Use Node.js `fs` module to write the registration file to disk.

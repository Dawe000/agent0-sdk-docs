---
title: "Models and Types"
description: "Data models reference"
---
Core data models and types used throughout the SDK.

## Type Aliases

<Tabs>
<TabItem label="Python">

```python
AgentId = str      # Format: "chainId:tokenId" (e.g., "11155111:123")
ChainId = int      # Chain identifier
Address = str       # Ethereum address (0x-hex)
URI = str          # https://... or ipfs://...
CID = str          # IPFS CID
Timestamp = int    # Unix timestamp
IdemKey = str      # Idempotency key
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Type aliases from 'agent0-sdk'
export type AgentId = string;  // Format: "chainId:tokenId" (e.g., "11155111:123")
export type ChainId = number;  // Chain identifier
export type Address = string;  // Ethereum address (0x-hex)
export type URI = string;      // https://... or ipfs://...
export type CID = string;     // IPFS CID
export type Timestamp = number; // Unix timestamp
export type IdemKey = string;  // Idempotency key
```

</TabItem>
</Tabs>

## ID Format Details

### AgentId Format

The SDK supports two agent ID formats:

#### Format 1: Agent ID Only

```plaintext
"1234"
```

- Uses SDK’s default chain (set during SDK initialization)
- Automatically constructs `"{defaultChainId}:1234"` for subgraph queries
- Example: If SDK is initialized with `chainId=11155111`, then `"1234"` is treated as `"11155111:1234"`
#### Format 2: Chain ID Prefix

```plaintext
"chainId:agentId"
```

- Explicitly specifies the chain
- Format: `"{chainId}:{agentId}"`
- Example: `"11155111:1234"` means agent ID `1234` on Ethereum Sepolia (chain ID `11155111`)
#### Supported Chain IDs

- `1` - Ethereum Mainnet
- `8453` - Base Mainnet
- `11155111` - Ethereum Sepolia
- `84532` - Base Sepolia
- `137` - Polygon Mainnet

- Additional networks are planned but not enabled in SDK defaults yet.
#### Usage Examples

<Tabs>
<TabItem label="Python">

```python
# Using default chain
agent = sdk.getAgent("1234")  # Uses SDK's default chain

# Explicitly specify chain
agent = sdk.getAgent("11155111:1234")  # ETH Sepolia
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Using default chain
const agent = await sdk.getAgent('1234');  // Uses SDK's default chain

// Explicitly specify chain
const agent = await sdk.getAgent('11155111:1234');  // ETH Sepolia
```

</TabItem>
</Tabs>

### Feedback ID Format

Feedback IDs uniquely identify individual feedback entries:

- **Format**: `"agentId:clientAddress:feedbackIndex"`
- **agentId**: The agent’s ID in `"chainId:agentId"` format (e.g., `"11155111:123"`) or just `"agentId"` (uses SDK’s default chain)
- **clientAddress**: Ethereum address of feedback giver (normalized to lowercase)
- **feedbackIndex**: Sequential index of feedback from this client to this agent (0-based)
- **Example**: `"11155111:123:0x742d35cc6634c0532925a3b844bc9e7595f0beb7:0"`
## EndpointType

<Tabs>
<TabItem label="Python">

```python
class EndpointType(Enum):
    MCP = "MCP"
    A2A = "A2A"
    ENS = "ENS"
    DID = "DID"
    WALLET = "wallet"
    OASF = "OASF"  # Open Agentic Schema Framework
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Enum from 'agent0-sdk'
export enum EndpointType {
  MCP = 'MCP',
  A2A = 'A2A',
  ENS = 'ENS',
  DID = 'DID',
  WALLET = 'wallet',
  OASF = 'OASF',  // Open Agentic Schema Framework
}
```

</TabItem>
</Tabs>

## TrustModel

<Tabs>
<TabItem label="Python">

```python
class TrustModel(Enum):
    REPUTATION = "reputation"
    CRYPTO_ECONOMIC = "crypto-economic"
    TEE_ATTESTATION = "tee-attestation"
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Enum from 'agent0-sdk'
export enum TrustModel {
  REPUTATION = 'reputation',
  CRYPTO_ECONOMIC = 'crypto-economic',
  TEE_ATTESTATION = 'tee-attestation',
}
```

</TabItem>
</Tabs>

## Endpoint

<Tabs>
<TabItem label="Python">

```python
@dataclass
class Endpoint:
    type: EndpointType
    value: str              # Endpoint value (URL, name, DID, ENS)
    meta: Dict[str, Any]    # Optional metadata
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Interface from 'agent0-sdk'
export interface Endpoint {
  type: EndpointType;
  value: string;  // Endpoint value (URL, name, DID, ENS)
  meta?: Record;  // Optional metadata
}
```

</TabItem>
</Tabs>

## RegistrationFile

<Tabs>
<TabItem label="Python">

```python
@dataclass
class RegistrationFile:
    agentId: Optional[AgentId]
    agentURI: Optional[URI]
    name: str
    description: str
    image: Optional[URI]
    walletAddress: Optional[Address]
    walletChainId: Optional[int]
    endpoints: List[Endpoint]
    trustModels: List[Union[TrustModel, str]]
    owners: List[Address]
    operators: List[Address]
    active: bool
    x402support: bool
    metadata: Dict[str, Any]
    updatedAt: Timestamp
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Interface from 'agent0-sdk'
export interface RegistrationFile {
  agentId?: AgentId;
  agentURI?: URI;
  name: string;
  description: string;
  image?: URI;
  walletAddress?: Address;
  walletChainId?: number;
  endpoints: Endpoint[];
  trustModels: (TrustModel | string)[];
  owners: Address[];  // from chain (read-only, hydrated)
  operators: Address[];  // from chain (read-only, hydrated)
  active: boolean;
  x402support: boolean;
  metadata: Record;
  updatedAt: Timestamp;
}
```

</TabItem>
</Tabs>

**Note:** In TypeScript, there are no built-in `to_dict()` or `from_dict()` methods. Use `JSON.stringify()` and `JSON.parse()` for serialization, or access properties directly from the interface.

## AgentSummary

<Tabs>
<TabItem label="Python">

```python
@dataclass
class AgentSummary:
    chainId: ChainId
    agentId: AgentId
    name: str
    image: Optional[URI]
    description: str
    owners: List[Address]
    operators: List[Address]
    # Endpoint semantics: endpoint string when present (not booleans)
    mcp: Optional[str]
    a2a: Optional[str]
    web: Optional[str]
    email: Optional[str]
    ens: Optional[str]
    did: Optional[str]
    walletAddress: Optional[Address]
    supportedTrusts: List[str]
    a2aSkills: List[str]
    mcpTools: List[str]
    mcpPrompts: List[str]
    mcpResources: List[str]
    oasfSkills: List[str]
    oasfDomains: List[str]
    active: bool
    x402support: bool
    # Optional (search-derived / subgraph fields)
    createdAt: Optional[Timestamp]
    updatedAt: Optional[Timestamp]
    lastActivity: Optional[Timestamp]
    agentURI: Optional[URI]
    agentURIType: Optional[str]
    feedbackCount: Optional[int]
    averageValue: Optional[float]
    semanticScore: Optional[float]
    extras: Dict[str, Any]
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Interface from 'agent0-sdk'
export interface AgentSummary {
  chainId: number;  // ChainId
  agentId: AgentId;
  name: string;
  image?: URI;
  description: string;
  owners: Address[];
  operators: Address[];
  // Endpoint semantics: endpoint string when present (not booleans)
  mcp?: string;
  a2a?: string;
  web?: string;
  email?: string;
  ens?: string;
  did?: string;
  walletAddress?: Address;
  supportedTrusts: string[];  // normalized string keys
  a2aSkills: string[];
  mcpTools: string[];
  mcpPrompts: string[];
  mcpResources: string[];
  oasfSkills?: string[];
  oasfDomains?: string[];
  active: boolean;
  x402support: boolean;
  // Optional (search-derived / subgraph fields)
  createdAt?: number;
  updatedAt?: number;
  lastActivity?: number;
  agentURI?: string;
  agentURIType?: string;
  feedbackCount?: number;
  averageValue?: number;
  semanticScore?: number;
  extras: Record;
}
```

</TabItem>
</Tabs>

| Field | Type (TS / Python) | When present | Source |
| --- | --- | --- | --- |
| `chainId` | `number` / `int` | Always | Subgraph `Agent.chainId` |
| `agentId` | `AgentId` / `AgentId` | Always | Subgraph `Agent.id` normalized to `"chainId:agentId"` |
| `name` | `string` / `str` | Always | Subgraph `Agent.registrationFile.name` |
| `description` | `string` / `str` | Always | Subgraph `Agent.registrationFile.description` |
| `image` | `URI?` / `Optional[URI]` | Optional | Subgraph `Agent.registrationFile.image` |
| `owners` | `Address[]` / `List[Address]` | Always | Subgraph `Agent.owner` (plus any additional owners if supported) |
| `operators` | `Address[]` / `List[Address]` | Always | Subgraph `Agent.operators` |
| `active` | `boolean` / `bool` | Always | Subgraph `Agent.registrationFile.active` |
| `x402support` | `boolean` / `bool` | Always | Subgraph `Agent.registrationFile.x402Support` (compat: `x402support`) |
| `mcp` | `string?` / `Optional[str]` | Optional | Subgraph `Agent.registrationFile.mcpEndpoint` |
| `a2a` | `string?` / `Optional[str]` | Optional | Subgraph `Agent.registrationFile.a2aEndpoint` |
| `web` | `string?` / `Optional[str]` | Optional | Subgraph `Agent.registrationFile.webEndpoint` |
| `email` | `string?` / `Optional[str]` | Optional | Subgraph `Agent.registrationFile.emailEndpoint` |
| `ens` | `string?` / `Optional[str]` | Optional | Subgraph `Agent.registrationFile.ens` |
| `did` | `string?` / `Optional[str]` | Optional | Subgraph `Agent.registrationFile.did` |
| `walletAddress` | `Address?` / `Optional[Address]` | Optional | Subgraph `Agent.agentWallet` (on-chain metadata) |
| `supportedTrusts` | `string[]` / `List[str]` | Always | Subgraph `Agent.registrationFile.supportedTrusts` |
| `a2aSkills` | `string[]` / `List[str]` | Always | Subgraph `Agent.registrationFile.a2aSkills` |
| `mcpTools` | `string[]` / `List[str]` | Always | Subgraph `Agent.registrationFile.mcpTools` |
| `mcpPrompts` | `string[]` / `List[str]` | Always | Subgraph `Agent.registrationFile.mcpPrompts` |
| `mcpResources` | `string[]` / `List[str]` | Always | Subgraph `Agent.registrationFile.mcpResources` |
| `oasfSkills` | `string[]` / `List[str]` | Always (may be empty) | Subgraph `Agent.registrationFile.oasfSkills` |
| `oasfDomains` | `string[]` / `List[str]` | Always (may be empty) | Subgraph `Agent.registrationFile.oasfDomains` |
| `createdAt` | `number?` / `Optional[int]` | Optional | Subgraph `Agent.createdAt` |
| `updatedAt` | `number?` / `Optional[int]` | Optional | Subgraph `Agent.updatedAt` |
| `lastActivity` | `number?` / `Optional[int]` | Optional | Subgraph `Agent.lastActivity` |
| `agentURI` | `string?` / `Optional[str]` | Optional | Subgraph `Agent.agentURI` |
| `agentURIType` | `string?` / `Optional[str]` | Optional | Subgraph `Agent.agentURIType` |
| `feedbackCount` | `number?` / `Optional[int]` | Optional | Subgraph `Agent.totalFeedback` (or feedback prefilter result) |
| `averageValue` | `number?` / `Optional[float]` | Optional | Computed by unified search feedback prefilter for the current query |
| `semanticScore` | `number?` / `Optional[float]` | Optional | Returned only for keyword searches (semantic prefilter score) |
| `extras` | `Record` / `Dict[str, Any]` | Always | Reserved for experimental/extra fields |

## x402 types

Used when calling **sdk.request()** or when an A2A call returns 402. See [Usage: x402](/2-usage/2-11-x402/).

<Tabs>
<TabItem label="Python">

```python
# X402RequestResult[T] = T | X402RequiredResponse[T]
# X402RequestOptions: url, method, headers?, body?, parseResponse?, payment?
```

</TabItem>
<TabItem label="TypeScript">

```ts
export interface X402RequiredResponse<T> {
  x402Required: true;
  x402Payment: X402Payment<T>;
}
export type X402RequestResult<T> =
  (T & { x402Required?: false }) | X402RequiredResponse<T>;
export interface X402RequestOptions<T> {
  url: string; method: string;
  headers?: Record<string, string>;
  body?: string | Uint8Array;
  parseResponse?: (body: string) => T;
  payment?: unknown;
}
```

</TabItem>
</Tabs>

| Type | Description |
|------|-------------|
| **X402RequestResult&lt;T&gt;** | Success: parsed body `T`. Or 402: **X402RequiredResponse&lt;T&gt;** with `x402Required`, `x402Payment`. |
| **X402RequiredResponse&lt;T&gt;** | 402 response. Has `x402Payment`: **X402Payment&lt;T&gt;** with `accepts`, `pay(accept?)`, optional `payFirst()`. |
| **X402Payment&lt;T&gt;** | `accepts: X402Accept[]`, `pay(accept?)` (accept optional index or X402Accept), `payFirst?()`. |
| **X402Accept** | One payment option: `price`, `token`, `network?`, `destination?`, `scheme?`, `description?`, and other server fields. |
| **X402RequestOptions&lt;T&gt;** | Request options: see table below. |
| **ResourceInfo** | Optional resource metadata on 402 response: `url`, `description?`, `mimeType?`. |
| **X402SettlementResponse** | Settlement result (e.g. from PAYMENT-RESPONSE header). |
| **Parse402FromHeaderResult** | Result of parsing a PAYMENT-REQUIRED header: `accepts`, `version`, `resource?`, `error?`. |

**X402RequestOptions fields:** `url` (string), `method` (string), `headers?` (Record), `body?` (string or binary), `parseResponse?` (function to parse 2xx body), `payment?` (optional payment payload to send with first request).

**Parsing helpers (TypeScript):** **parse402FromHeader**, **parse402FromBody**, **parse402FromWWWAuthenticate**, **parse402SettlementFromHeader**, **parse402AcceptsFromHeader** — for custom clients or debugging 402 responses. Python: same names in snake_case in `x402_types` (e.g. `parse_402_from_header`).

Use **isX402Required(result)** (TypeScript and Python) to narrow before calling `x402Payment.pay()`.

## A2A response and task types

Used when **calling** agents via A2A (`agent.messageA2A`, `listTasks`, `loadTask`). See [Usage: A2A](/2-usage/2-10-a2a/).

<Tabs>
<TabItem label="Python">

```python
# Part: text?, url?, data?, raw?
# MessageResponse: content?, parts?, contextId? (no task)
# TaskResponse: task (AgentTask handle)
# A2APaymentRequired[T]: x402Required, x402Payment.pay() / .pay_first()
```

</TabItem>
<TabItem label="TypeScript">

```ts
export interface Part {
  text?: string; url?: string; data?: string; raw?: string;
}
export interface MessageResponse {
  x402Required?: false;
  content?: string; parts?: Part[]; contextId?: string;
}
```

</TabItem>
</Tabs>

| Type | Description |
|------|-------------|
| **MessageResponse** | Direct message reply (no task). Has `content?`, `parts?`, `contextId?`. No `task` property. |
| **TaskResponse** | Agent created a task. Has `task`: **AgentTask** handle. |
| **A2APaymentRequired&lt;T&gt;** | Server returned 402. Has `x402Required: true`, `x402Payment` with `pay()`, optional `payFirst()`. After pay, get `T` (e.g. MessageResponse or TaskResponse). |
| **TaskSummary** | One task in `listTasks()` result. Has `taskId`, `contextId`, `status?` (TaskState), `messages?`. |
| **AgentTask** | Task handle from a TaskResponse or `loadTask()`. Methods: `query(options?)`, `message(content)`, `cancel()`. Each may return 402. |
| **TaskState** | Server-specific status (e.g. `open`, `working`, `completed`, `failed`, `canceled`, `rejected`). |
| **TaskQueryResult** | Return type of `task.query()`. Has `taskId`, `contextId`, `status?`, `artifacts?`, `messages?`. |
| **TaskCancelResult** | Return type of `task.cancel()`. Has `taskId`, `contextId`, `status?`. |
| **MessageA2AOptions** | Optional `blocking`, `contextId`, `taskId`, `credential`, `payment`, and language-specific fields (e.g. `acceptedOutputModes`, `historyLength`, `returnImmediately`). |
| **ListTasksOptions** / **LoadTaskOptions** | Optional filters and parameters. |
| **Part** | Content part: `text?`, `url?`, `data?`, `raw?`. Used in message content and responses. |

## Feedback

<Tabs>
<TabItem label="Python">

```python
@dataclass
class Feedback:
    id: str                 # "agentId:clientAddress:index"
    agentId: AgentId
    reviewer: Address
    value: Optional[float]
    tags: List[str]
    text: Optional[str]
    proofOfPayment: Optional[Dict]
    fileURI: Optional[URI]
    endpoint: Optional[str]
    createdAt: Timestamp
    answers: List[Dict[str, Any]]
    isRevoked: bool

    # Spec-aligned FeedbackFile fields (populated when a feedback file exists)
    mcpTool: Optional[str]
    mcpPrompt: Optional[str]
    mcpResource: Optional[str]
    a2aSkills: List[str]
    a2aContextId: Optional[str]
    a2aTaskId: Optional[str]
    oasfSkills: List[str]
    oasfDomains: List[str]
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Interface from 'agent0-sdk'
export interface Feedback {
  id: FeedbackIdTuple;  // [AgentId, Address, number]
  agentId: AgentId;
  reviewer: Address;
  value?: number;
  tags: string[];
  text?: string;
  proofOfPayment?: Record;
  fileURI?: URI;
  endpoint?: string;
  createdAt: Timestamp;
  answers: Array<Record>;
  isRevoked: boolean;

  // Subgraph FeedbackFile fields (spec-aligned)
  mcpTool?: string;
  mcpPrompt?: string;
  mcpResource?: string;
  a2aSkills?: string[];
  a2aContextId?: string;
  a2aTaskId?: string;
  oasfSkills?: string[];
  oasfDomains?: string[];
}

// Feedback ID types
export type FeedbackIdTuple = [AgentId, Address, number];
export type FeedbackId = string;  // "agentId:clientAddress:feedbackIndex"
```

</TabItem>
</Tabs>

**Note:** In TypeScript, `Feedback.id` is a tuple `[AgentId, Address, number]` rather than a string. The string format `"agentId:clientAddress:feedbackIndex"` is represented by the `FeedbackId` type.

## SearchFilters / SearchOptions / FeedbackFilters

The unified `searchAgents(filters, options)` API uses `SearchFilters` + `SearchOptions`, and reputation filters live under `SearchFilters.feedback` as `FeedbackFilters`.

This section is an **exhaustive reference** for all unified search inputs.

See also:
- [`/2-usage/2-5-search/`](/2-usage/2-5-search/) for end-to-end examples
- [`/5-reference/5-1-sdk/`](/5-reference/5-1-sdk/) for `searchAgents()` signature

### FeedbackFilters (reputation filters)

All reputation filtering is expressed under `SearchFilters.feedback`.

<Tabs>
<TabItem label="Python">

```python
@dataclass
class FeedbackFilters:
    hasFeedback: Optional[bool] = None
    hasNoFeedback: Optional[bool] = None
    includeRevoked: Optional[bool] = None
    minValue: Optional[float] = None
    maxValue: Optional[float] = None
    minCount: Optional[int] = None
    maxCount: Optional[int] = None
    fromReviewers: Optional[List[Address]] = None
    endpoint: Optional[str] = None          # substring match
    hasResponse: Optional[bool] = None
    tag1: Optional[str] = None
    tag2: Optional[str] = None
    tag: Optional[str] = None               # matches tag1 OR tag2
```

</TabItem>
<TabItem label="TypeScript">

```ts
export interface FeedbackFilters {
  hasFeedback?: boolean;
  hasNoFeedback?: boolean;
  includeRevoked?: boolean;
  minValue?: number;
  maxValue?: number;
  minCount?: number;
  maxCount?: number;
  fromReviewers?: Address[];
  endpoint?: string; // substring match
  hasResponse?: boolean;
  tag1?: string;
  tag2?: string;
  tag?: string; // matches tag1 OR tag2
}
```

</TabItem>
</Tabs>

| Field | Semantics | Execution |
| --- | --- | --- |
| `hasFeedback` | Only agents with at least 1 feedback | **Pushdown** when used alone (via `Agent.totalFeedback_gt: "0"`); otherwise **two-phase** |
| `hasNoFeedback` | Only agents with 0 feedback | **Pushdown** when used alone (via `Agent.totalFeedback: "0"`); otherwise **two-phase** |
| `includeRevoked` | Include revoked feedback entries in the pool used for filtering | Affects **two-phase** feedback prefilter |
| `minValue` / `maxValue` | Min/max **average value** over feedback matching the other feedback constraints (inclusive) | **Two-phase** |
| `minCount` / `maxCount` | Min/max **count** of feedback matching the other feedback constraints (inclusive) | **Two-phase** |
| `fromReviewers` | Only consider feedback from these reviewer wallets | **Two-phase** |
| `endpoint` | Only consider feedback where `endpoint` contains this substring | **Two-phase** |
| `hasResponse` | Only consider feedback that has at least one response (if supported) | **Two-phase** |
| `tag1` / `tag2` | Only consider feedback with matching `tag1` and/or `tag2` | **Two-phase** |
| `tag` | Shorthand: matches either `tag1` OR `tag2` | **Two-phase** |

### SearchFilters (agent filters + unified feedback)

<Tabs>
<TabItem label="Python">

```python
DateLike = Union[datetime, str, int]

@dataclass
class SearchFilters:
    # Chain / identity
    chains: Optional[Union[List[ChainId], Literal["all"]]] = None
    agentIds: Optional[List[AgentId]] = None

    # Text
    name: Optional[str] = None              # substring
    description: Optional[str] = None       # substring

    # Owners / operators
    owners: Optional[List[Address]] = None
    operators: Optional[List[Address]] = None

    # Endpoint existence
    hasRegistrationFile: Optional[bool] = None
    hasWeb: Optional[bool] = None
    hasMCP: Optional[bool] = None
    hasA2A: Optional[bool] = None
    hasOASF: Optional[bool] = None
    hasEndpoints: Optional[bool] = None

    # Endpoint substring contains
    webContains: Optional[str] = None
    mcpContains: Optional[str] = None
    a2aContains: Optional[str] = None
    ensContains: Optional[str] = None
    didContains: Optional[str] = None

    # Wallet
    walletAddress: Optional[Address] = None

    # Capability arrays (ANY semantics)
    supportedTrust: Optional[List[str]] = None
    a2aSkills: Optional[List[str]] = None
    mcpTools: Optional[List[str]] = None
    mcpPrompts: Optional[List[str]] = None
    mcpResources: Optional[List[str]] = None
    oasfSkills: Optional[List[str]] = None
    oasfDomains: Optional[List[str]] = None

    # Status
    active: Optional[bool] = None
    x402support: Optional[bool] = None

    # Time filters
    registeredAtFrom: Optional[DateLike] = None
    registeredAtTo: Optional[DateLike] = None
    updatedAtFrom: Optional[DateLike] = None
    updatedAtTo: Optional[DateLike] = None

    # Metadata filters (two-phase)
    hasMetadataKey: Optional[str] = None
    metadataValue: Optional[Dict[str, str]] = None  # { key, value }

    # Semantic search
    keyword: Optional[str] = None

    # Feedback filters (two-phase)
    feedback: Optional[FeedbackFilters] = None
```

</TabItem>
<TabItem label="TypeScript">

```ts
export interface SearchFilters {
  // Chain / identity
  chains?: number[] | 'all';
  agentIds?: AgentId[];

  // Text
  name?: string; // substring
  description?: string; // substring

  // Owners / operators
  owners?: Address[];
  operators?: Address[];

  // Endpoint existence
  hasRegistrationFile?: boolean;
  hasWeb?: boolean;
  hasMCP?: boolean;
  hasA2A?: boolean;
  hasOASF?: boolean;
  hasEndpoints?: boolean;

  // Endpoint substring contains
  webContains?: string;
  mcpContains?: string;
  a2aContains?: string;
  ensContains?: string;
  didContains?: string;

  // Wallet
  walletAddress?: Address;

  // Capability arrays (ANY semantics)
  supportedTrust?: string[];
  a2aSkills?: string[];
  mcpTools?: string[];
  mcpPrompts?: string[];
  mcpResources?: string[];
  oasfSkills?: string[];
  oasfDomains?: string[];

  // Status
  active?: boolean;
  x402support?: boolean;

  // Time filters
  registeredAtFrom?: Date | string | number;
  registeredAtTo?: Date | string | number;
  updatedAtFrom?: Date | string | number;
  updatedAtTo?: Date | string | number;

  // Metadata filters (two-phase)
  hasMetadataKey?: string;
  metadataValue?: { key: string; value: string };

  // Semantic search
  keyword?: string;

  // Feedback filters (two-phase)
  feedback?: FeedbackFilters;
}
```

</TabItem>
</Tabs>

| Field | Semantics | Execution |
| --- | --- | --- |
| `chains` | `undefined` queries **chain 1 + SDK default chainId** (de-duplicated); list queries those chains; `"all"` queries all configured chains | Controls **multi-chain** execution |
| `agentIds` | Only these agent IDs (format `"chainId:agentId"`) | **Pushdown** via `id_in` |
| `name` / `description` | Case-insensitive substring match | **Pushdown** (`*_contains_nocase` with compatibility fallback) |
| `owners` / `operators` | Match agent owner or any operator | **Pushdown** (Agent fields) |
| `hasRegistrationFile` | Require a registration file | **Pushdown** |
| `hasWeb` / `hasMCP` / `hasA2A` / `hasOASF` | Require that endpoint type is present | **Pushdown** (with subgraph compatibility fallbacks for some fields) |
| `hasEndpoints` | Require at least one of {web, email, mcp, a2a, oasf} | **Pushdown** (OR over endpoint non-null) |
| `webContains` / `mcpContains` / `a2aContains` / `ensContains` / `didContains` | Case-insensitive substring match for those endpoint strings | **Pushdown** (with compatibility fallback to case-sensitive contains where needed) |
| `walletAddress` | Exact match for the agent wallet address (if set) | **Pushdown** |
| `supportedTrust` | ANY-of: agent supports at least one of these trust model strings | **Pushdown** |
| `a2aSkills` / `mcpTools` / `mcpPrompts` / `mcpResources` / `oasfSkills` / `oasfDomains` | ANY-of: matches at least one listed element | **Pushdown** (list-contains) |
| `active` / `x402support` | Boolean filters | **Pushdown** |
| `registeredAtFrom/To` | Inclusive timestamp range over agent `createdAt` | **Pushdown** |
| `updatedAtFrom/To` | Inclusive timestamp range over agent `updatedAt` | **Pushdown** |
| `hasMetadataKey` | Require an on-chain metadata entry with this key | **Two-phase** metadata prefilter |
| `metadataValue` | Require metadata key/value exact match (value is hex/bytes-encoded in the subgraph) | **Two-phase** metadata prefilter |
| `keyword` | Semantic keyword prefilter via external semantic-search endpoint | **Two-phase** semantic prefilter (IDs + scores) |
| `feedback` | Reputation filtering for agents | **Two-phase** feedback prefilter (with limited pushdown for `hasFeedback/hasNoFeedback` when used alone) |

### SearchOptions (sort)

<Tabs>
<TabItem label="Python">

```python
@dataclass
class SearchOptions:
    sort: Optional[List[str]] = None
    semanticMinScore: Optional[float] = None
    semanticTopK: Optional[int] = None
```

</TabItem>
<TabItem label="TypeScript">

```ts
export interface SearchOptions {
  sort?: string[];            // e.g. ["averageValue:desc", "updatedAt:desc"]
  semanticMinScore?: number;  // only for keyword searches
  semanticTopK?: number;      // only for keyword searches (semantic endpoint has no cursor)
}
```

</TabItem>
</Tabs>

| Field | Semantics |
| --- | --- |
| `sort` | List of sort keys (stable): `\"field:asc\"` or `\"field:desc\"`. Common keys: `updatedAt`, `createdAt`, `lastActivity`, `averageValue`, `feedbackCount`, `semanticScore`, `name` |
| `semanticMinScore` | Minimum semantic score cutoff (keyword searches only) |
| `semanticTopK` | Limits semantic prefilter size. Important because the semantic endpoint does not provide cursors; large keyword queries may require raising this. |

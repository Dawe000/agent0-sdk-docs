---
title: "SDK API"
description: "SDK class reference"
---
Complete reference for the SDK class.

For detailed ID format documentation, see [Models Reference](/5-reference/5-3-models/).

## Initialization

<Tabs>
<TabItem label="Python">

```python
sdk = SDK(
    chainId=11155111,  # ChainId
    rpcUrl="https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    signer=None,  # Optional[Any] (omit for read-only)
    registryOverrides=None,  # Optional[Dict[ChainId, Dict[str, Address]]]
    indexingStore=None,
    embeddings=None,
    ipfs=None,  # Optional[str]: "node" | "filecoinPin" | "pinata"
    ipfsNodeUrl=None,
    filecoinPrivateKey=None,
    pinataJwt=None,
    subgraphOverrides=None,  # Optional[Dict[ChainId, str]]
    overrideRpcUrls=None,  # Optional[Dict[int, str]] — per-chain RPC URLs for x402 payments and loadAgent on other chains
)
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';

const sdk = new SDK({
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
  // Optional for read-only operations
  privateKey: process.env.PRIVATE_KEY,

  // Browser alternative (EIP-1193):
  // walletProvider,
  // registryOverrides?: Record<ChainId, Record<string, Address>>
  // subgraphUrl?: string
  // subgraphOverrides?: Record<ChainId, string>
  // Per-chain RPC URLs for x402 payments and loadAgent on other chains:
  // overrideRpcUrls?: Record<number, string>,
});
```

</TabItem>
</Tabs>

**Note:** The `chainId` parameter sets the SDK’s default chain. When you provide an `agentId` without a `chainId` prefix, the SDK uses this default chain.

**overrideRpcUrls:** Optional map of chain ID to RPC URL (e.g. `{ 84532: 'https://base-sepolia.drpc.org', 8453: 'https://base.drpc.org' }`). Used for x402 EVM payments on chains other than the primary, and for `loadAgent` when the agent is on another chain. Merged after built-in defaults and `rpcUrl`.

**TypeScript note:** `signer` is still accepted as a backwards-compatible alias for `privateKey`.

## Advanced: direct contract calls (TypeScript)

The TypeScript SDK no longer exposes legacy registry helpers. If you need direct on-chain access:

- Use `sdk.registries()` to get the registry addresses.
- Use [`viem`](https://viem.sh/) directly (recommended) with a minimal ABI for the function(s) you need.
- Alternatively, you can use the SDK’s exported `ViemChainClient` if you want a thin wrapper around common read/write operations.

## Agent Methods

### createAgent

Create a new agent.

<Tabs>
<TabItem label="Python">

```python
agent = sdk.createAgent(
    name: str,
    description: str,
    image: Optional[str] = None
) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK, Agent } from 'agent0-sdk';

const agent: Agent = sdk.createAgent(
  name: string,
  description: string,
  image?: string
);
```

</TabItem>
</Tabs>

### loadAgent

Load an existing agent by ID.

<Tabs>
<TabItem label="Python">

```python
agent = sdk.loadAgent(agentId: str) -> Agent
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK, Agent } from 'agent0-sdk';
import type { AgentId } from 'agent0-sdk';

const agent: Agent = await sdk.loadAgent(agentId: AgentId);
```

</TabItem>
</Tabs>

## Discovery Methods

### searchAgents

Search for agents with filters.

<Tabs>
<TabItem label="Python">

```python
results = sdk.searchAgents(
    filters: Union[SearchFilters, Dict, None] = None,
    options: Union[SearchOptions, Dict, None] = None,
    **kwargs
) -> List[AgentSummary]
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import type { SearchFilters, SearchOptions, AgentSummary } from 'agent0-sdk';

const results: AgentSummary[] = await sdk.searchAgents(
  filters?: SearchFilters,
  options?: SearchOptions
);
```

</TabItem>
</Tabs>

#### Parameters (exhaustive)

`searchAgents(filters, options)` is the unified entrypoint that blends agent discovery + reputation filtering.

**Multi-chain note:** `filters.chains` enables multi-chain execution. Results are returned as a flat `AgentSummary[]` containing agents from all queried chains.

**Default chains:** if you omit `filters.chains`, `searchAgents()` queries **chain `1` plus the SDK’s default `chainId`**, de-duplicated (so chain `1` is never queried twice). This applies **both** with and without `filters.keyword`.

##### `SearchFilters`

<Tabs>
<TabItem label="Python">

```python
DateLike = Union[datetime, str, int]

@dataclass
class SearchFilters:
    chains: Optional[Union[List[ChainId], Literal["all"]]] = None
    agentIds: Optional[List[AgentId]] = None

    name: Optional[str] = None
    description: Optional[str] = None

    owners: Optional[List[Address]] = None
    operators: Optional[List[Address]] = None

    hasRegistrationFile: Optional[bool] = None
    hasWeb: Optional[bool] = None
    hasMCP: Optional[bool] = None
    hasA2A: Optional[bool] = None
    hasOASF: Optional[bool] = None
    hasEndpoints: Optional[bool] = None

    webContains: Optional[str] = None
    mcpContains: Optional[str] = None
    a2aContains: Optional[str] = None
    ensContains: Optional[str] = None
    didContains: Optional[str] = None

    walletAddress: Optional[Address] = None

    supportedTrust: Optional[List[str]] = None
    a2aSkills: Optional[List[str]] = None
    mcpTools: Optional[List[str]] = None
    mcpPrompts: Optional[List[str]] = None
    mcpResources: Optional[List[str]] = None
    oasfSkills: Optional[List[str]] = None
    oasfDomains: Optional[List[str]] = None

    active: Optional[bool] = None
    x402support: Optional[bool] = None

    registeredAtFrom: Optional[DateLike] = None
    registeredAtTo: Optional[DateLike] = None
    updatedAtFrom: Optional[DateLike] = None
    updatedAtTo: Optional[DateLike] = None

    hasMetadataKey: Optional[str] = None
    metadataValue: Optional[Dict[str, str]] = None  # { key, value }

    keyword: Optional[str] = None
    feedback: Optional[FeedbackFilters] = None
```

</TabItem>
<TabItem label="TypeScript">

```ts
export interface SearchFilters {
  chains?: number[] | 'all';
  agentIds?: AgentId[];

  name?: string;
  description?: string;

  owners?: Address[];
  operators?: Address[];

  hasRegistrationFile?: boolean;
  hasWeb?: boolean;
  hasMCP?: boolean;
  hasA2A?: boolean;
  hasOASF?: boolean;
  hasEndpoints?: boolean;

  webContains?: string;
  mcpContains?: string;
  a2aContains?: string;
  ensContains?: string;
  didContains?: string;

  walletAddress?: Address;

  supportedTrust?: string[];
  a2aSkills?: string[];
  mcpTools?: string[];
  mcpPrompts?: string[];
  mcpResources?: string[];
  oasfSkills?: string[];
  oasfDomains?: string[];

  active?: boolean;
  x402support?: boolean;

  registeredAtFrom?: Date | string | number;
  registeredAtTo?: Date | string | number;
  updatedAtFrom?: Date | string | number;
  updatedAtTo?: Date | string | number;

  hasMetadataKey?: string;
  metadataValue?: { key: string; value: string };

  keyword?: string;
  feedback?: FeedbackFilters;
}
```

</TabItem>
</Tabs>

| Field | Semantics |
| --- | --- |
| `chains` | `undefined` queries **chain 1 + SDK default chainId** (de-duplicated); list queries those chains; `"all"` queries all configured chains |
| `agentIds` | Only these agent IDs (`"chainId:agentId"`) |
| `name` / `description` | Case-insensitive substring match |
| `owners` / `operators` | Match agent owner or any operator |
| `hasRegistrationFile` | Require a registration file |
| `hasWeb` / `hasMCP` / `hasA2A` / `hasOASF` | Require that endpoint type is present |
| `hasEndpoints` | Require at least one of {web, email, mcp, a2a, oasf} |
| `webContains` / `mcpContains` / `a2aContains` / `ensContains` / `didContains` | Case-insensitive substring match for those endpoint strings |
| `walletAddress` | Exact match for the agent wallet address (if set) |
| `supportedTrust` | ANY-of: agent supports at least one of these trust model strings |
| `a2aSkills` / `mcpTools` / `mcpPrompts` / `mcpResources` / `oasfSkills` / `oasfDomains` | ANY-of: matches at least one listed element |
| `active` / `x402support` | Boolean filters |
| `registeredAtFrom/To` | Inclusive timestamp range over agent `createdAt` |
| `updatedAtFrom/To` | Inclusive timestamp range over agent `updatedAt` |
| `hasMetadataKey` | Require an on-chain metadata entry with this key (two-phase prefilter) |
| `metadataValue` | Require metadata key/value exact match (two-phase prefilter) |
| `keyword` | Semantic keyword prefilter via external semantic-search endpoint |
| `feedback` | Unified reputation filtering (see `FeedbackFilters`) |

##### `FeedbackFilters`

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
    endpoint: Optional[str] = None
    hasResponse: Optional[bool] = None
    tag1: Optional[str] = None
    tag2: Optional[str] = None
    tag: Optional[str] = None
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
  endpoint?: string;
  hasResponse?: boolean;
  tag1?: string;
  tag2?: string;
  tag?: string;
}
```

</TabItem>
</Tabs>

| Field | Semantics |
| --- | --- |
| `hasFeedback` / `hasNoFeedback` | Filter by whether the agent has any feedback |
| `includeRevoked` | Include revoked feedback in the pool used for filtering |
| `minValue` / `maxValue` | Threshold on **average value** over feedback matching the other feedback constraints (inclusive) |
| `minCount` / `maxCount` | Threshold on **count** of feedback matching the other feedback constraints (inclusive) |
| `fromReviewers` | Only consider feedback from these reviewer wallets |
| `endpoint` | Only consider feedback whose `endpoint` contains this substring |
| `hasResponse` | Only consider feedback that has at least one response (if supported) |
| `tag1` / `tag2` | Only consider feedback matching tag1/tag2 |
| `tag` | Shorthand: match either tag1 OR tag2 |

##### `SearchOptions`

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
  sort?: string[];
  semanticMinScore?: number;
  semanticTopK?: number;
}
```

</TabItem>
</Tabs>

| Field | Semantics |
| --- | --- |
| `sort` | List of sort keys: `\"field:asc\"` or `\"field:desc\"` |
| `semanticMinScore` | Minimum semantic score cutoff (keyword searches only) |
| `semanticTopK` | Limits semantic prefilter size (semantic endpoint has no cursor) |

#### Returns

- `AgentSummary[]`

#### AgentSummary (returned values)

`searchAgents()` returns `AgentSummary` objects. Endpoint fields (`mcp`, `a2a`, `web`, `email`) are **endpoint strings** when present (not booleans).

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
    mcp: Optional[str] = None
    a2a: Optional[str] = None
    web: Optional[str] = None
    email: Optional[str] = None
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
    createdAt: Optional[int] = None
    updatedAt: Optional[int] = None
    lastActivity: Optional[int] = None
    agentURI: Optional[str] = None
    agentURIType: Optional[str] = None
    feedbackCount: Optional[int] = None
    averageValue: Optional[float] = None
    semanticScore: Optional[float] = None
    extras: Dict[str, Any] = field(default_factory=dict)
```

</TabItem>
<TabItem label="TypeScript">

```ts
export interface AgentSummary {
  chainId: number;
  agentId: AgentId;
  name: string;
  image?: URI;
  description: string;
  owners: Address[];
  operators: Address[];
  mcp?: string;
  a2a?: string;
  web?: string;
  email?: string;
  ens?: string;
  did?: string;
  walletAddress?: Address;
  supportedTrusts: string[];
  a2aSkills: string[];
  mcpTools: string[];
  mcpPrompts: string[];
  mcpResources: string[];
  oasfSkills: string[];
  oasfDomains: string[];
  active: boolean;
  x402support: boolean;
  createdAt?: number;
  updatedAt?: number;
  lastActivity?: number;
  agentURI?: string;
  agentURIType?: string;
  feedbackCount?: number;
  averageValue?: number;
  semanticScore?: number;
  extras: Record<string, any>;
}
```

</TabItem>
</Tabs>

### getAgent

Get a single agent summary.

<Tabs>
<TabItem label="Python">

```python
agent = sdk.getAgent(agentId: str) -> AgentSummary
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import type { AgentId, AgentSummary } from 'agent0-sdk';

const agent: AgentSummary | null = await sdk.getAgent(agentId: AgentId);
```

</TabItem>
</Tabs>

**Parameters:**

- `agentId` (str / AgentId): Agent ID in format `"agentId"` (uses SDK’s default chain) or `"chainId:agentId"` (explicit chain, e.g., `"11155111:1234"`)
**Examples:**

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

## Feedback Methods

### prepareFeedbackFile

Prepare an **off-chain** feedback file payload (optional).

<Tabs>
<TabItem label="Python">

```python
feedback_file = sdk.prepareFeedbackFile({
    "text": "Optional rich feedback text",
    "mcpTool": "financial_analyzer",
    "a2aSkills": ["financial_analysis"],
    "a2aTaskId": "analyze_balance_sheet",
    "a2aContextId": "session:abc",
    "proofOfPayment": {"txHash": "0x...", "amount": "0.01"},
})
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import type { FeedbackFileInput } from 'agent0-sdk';

const feedbackFile: FeedbackFileInput = sdk.prepareFeedbackFile({
  text: undefined,
  mcpTool: 'financial_analyzer',
  a2aSkills: ['financial_analysis'],
  a2aTaskId: 'analyze_balance_sheet',
  a2aContextId: 'session:abc',
  proofOfPayment: { txHash: '0x...', amount: '0.01' },
});
```

</TabItem>
</Tabs>

### giveFeedback

Give feedback on-chain (optionally with an off-chain feedback file).

<Tabs>
<TabItem label="Python">

```python
tx = sdk.giveFeedback(
    agentId="11155111:123",
    value=85,
    tag1="data_analyst",
    tag2="finance",
    endpoint="https://api.example.com/feedback",
    feedbackFile=feedback_file,  # optional
) -> TransactionHandle[Feedback]
feedback = tx.wait_confirmed(timeout=180).result
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import type { AgentId, Feedback, FeedbackFileInput, TransactionHandle } from 'agent0-sdk';

const tx: TransactionHandle<Feedback> = await sdk.giveFeedback(
  agentId,
  85,
  'data_analyst',
  'finance',
  'https://api.example.com/feedback',
  feedbackFile // optional: FeedbackFileInput
);
const { result: feedback } = await tx.waitConfirmed();
```

</TabItem>
</Tabs>

### getFeedback

Get single feedback.

<Tabs>
<TabItem label="Python">

```python
feedback = sdk.getFeedback(
    agentId="11155111:123",
    clientAddress="0xabc...",
    feedbackIndex=0
) -> Feedback
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import type { AgentId, Address, Feedback } from 'agent0-sdk';

const feedback: Feedback = await sdk.getFeedback(
  agentId: AgentId,
  clientAddress: Address,
  feedbackIndex: number
);
```

</TabItem>
</Tabs>

**Note:** `feedbackIndex` in the feedback ID is 0-based (first feedback = 0, second = 1, etc.)

**Note:** Both SDKs take separate parameters instead of a single `feedbackId` string.

### searchFeedback

Search feedback with filters.

**Important:** Some filter names are kept for backwards compatibility, but map to spec-aligned feedback file fields:

- `capabilities` → `feedbackFile.mcpTool`
- `skills` → `feedbackFile.a2aSkills`
- `tasks` → `feedbackFile.a2aTaskId` (best-effort)
- `names` → legacy (do not use; prefer `mcpTool` / `mcpPrompt` / `mcpResource`)

<Tabs>
<TabItem label="Python">

```python
results = sdk.searchFeedback(
    agentId="11155111:123",  # optional
    agents=None,             # optional: search across multiple agents
    reviewers=None,
    tags=["data_analyst"],
    capabilities=["financial_analyzer"],
    skills=["financial_analysis"],
    minValue=0,
    maxValue=100,
    include_revoked=False,
    first=100,
    skip=0,
) -> List[Feedback]
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import type { AgentId, Address, Feedback } from 'agent0-sdk';

const results: Feedback[] = await sdk.searchFeedback(
  filters: {
    agentId?: AgentId;
    agents?: AgentId[];
    tags?: string[];
    reviewers?: Address[];
    capabilities?: string[];
    skills?: string[];
    tasks?: string[];
    names?: string[]; // legacy (do not use; prefer mcpTool/mcpPrompt/mcpResource in feedbackFile)
    includeRevoked?: boolean;
  },
  options?: { minValue?: number; maxValue?: number }
);
```

</TabItem>
</Tabs>

**Parameters:**

- `agentId` (str / AgentId, optional): Agent ID in format `"agentId"` (uses SDK’s default chain) or `"chainId:agentId"` (explicit chain)
- `agents` (List[AgentId] / AgentId[], optional): Search across multiple agents (use `"chainId:agentId"` for cross-chain)
- `reviewers` (List[Address] / Address[], optional): Reviewer wallet addresses (enables “all feedback given by a wallet” when used without `agentId`)

**Notes:**

- You must provide **at least one** filter (`agentId`/`agents`/`reviewers`/`tags`/etc.). Empty searches are rejected to avoid accidental global queries.
- Reviewer-only searches require a configured **subgraph** (no on-chain fallback).
### searchAgents (feedback / reputation filters)

`searchAgentsByReputation` was removed. Use **`searchAgents()`** with `filters.feedback` instead.

<Tabs>
<TabItem label="Python">

```python
results = sdk.searchAgents(
    filters={
        "chains": "all",
        "feedback": {
            "minValue": 80,
            "tag": "enterprise",
            "includeRevoked": False,
        },
    },
)
```

</TabItem>
<TabItem label="TypeScript">

```ts
const results = await sdk.searchAgents(
  {
    chains: 'all',
    feedback: { minValue: 80, tag: 'enterprise', includeRevoked: false },
  }
);
```

</TabItem>
</Tabs>

### revokeFeedback

Revoke feedback.

<Tabs>
<TabItem label="Python">

```python
result = sdk.revokeFeedback(
    agentId: str,
    feedbackIndex: int
) -> Feedback
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import type { AgentId, TransactionHandle, Feedback } from 'agent0-sdk';

const tx: TransactionHandle<Feedback> = await sdk.revokeFeedback(
  agentId: AgentId,
  feedbackIndex: number
);
await tx.waitConfirmed();
```

</TabItem>
</Tabs>

**TypeScript Note:** Returns a `TransactionHandle<Feedback>`.

### appendResponse

Append response to feedback.

<Tabs>
<TabItem label="Python">

```python
feedback = sdk.appendResponse(
    agentId: str,
    clientAddress: str,
    feedbackIndex: int,
    response: Dict
) -> Feedback
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import type { AgentId, Address, URI, TransactionHandle, Feedback } from 'agent0-sdk';

const tx: TransactionHandle<Feedback> = await sdk.appendResponse(
  agentId: AgentId,
  clientAddress: Address,
  feedbackIndex: number,
  response: { uri: URI; hash: string }
);
await tx.waitConfirmed();
```

</TabItem>
</Tabs>

**TypeScript Note:** Returns a `TransactionHandle<Feedback>`. Response parameter is an object with `uri` and `hash` properties.

### getReputationSummary

Get reputation summary for an agent.

<Tabs>
<TabItem label="Python">

```python
summary = sdk.getReputationSummary(
    agentId: str
) -> Dict
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import type { AgentId } from 'agent0-sdk';

const summary: { count: number; averageValue: number } = await sdk.getReputationSummary(
  agentId: AgentId,
  tag1?: string,
  tag2?: string
);
```

</TabItem>
</Tabs>

**Parameters:**

- `agentId` (str / AgentId): Agent ID in format `"agentId"` (uses SDK’s default chain) or `"chainId:agentId"` (explicit chain)

## Request and x402

Perform HTTP requests with 402 (Payment Required) handling. See [Usage: x402](/2-usage/2-11-x402/).

### request (fetchWithX402)

Perform an HTTP request with x402 handling. On 2xx, returns the parsed response body. On 402, returns an object with `x402Required: true` and `x402Payment`; check `result.x402Required`, then `x402Payment.pay()` or `payFirst()` to pay and retry.

**Options (X402RequestOptions):** `url`, `method`, `headers?`, `body?`, `parseResponse?`, `payment?`.

<Tabs>
<TabItem label="Python">

```python
result = sdk.request(options)  # or sdk.fetchWithX402(options)
```

</TabItem>
<TabItem label="TypeScript">

```ts
const result = await sdk.request<T>(options);  // or sdk.fetchWithX402(options)
```

</TabItem>
</Tabs>

**Returns:** Parsed body `T` on success, or **X402RequiredResponse&lt;T&gt;** on 402 (with `x402Payment.pay()` / `payFirst()`).

### getX402RequestDeps

Returns the internal deps (fetch, buildPayment, checkBalance) used by `request` and by A2A when handling 402. Use when building a custom x402-aware request pipeline; most callers should use `sdk.request()` or agent A2A methods instead.

<Tabs>
<TabItem label="Python">

```python
deps = sdk.getX402RequestDeps()
```

</TabItem>
<TabItem label="TypeScript">

```ts
const deps = sdk.getX402RequestDeps();
```

</TabItem>
</Tabs>

### result.x402Required

On request/A2A results, the `x402Required` property is `true` when the server returned 402 Payment Required. Check it before calling `x402Payment.pay()`.

<Tabs>
<TabItem label="Python">

```python
if result.x402Required:
    paid = result.x402Payment.pay()
```

</TabItem>
<TabItem label="TypeScript">

```ts
if (result.x402Required) {
  const paid = await result.x402Payment.pay();
}
```

</TabItem>
</Tabs>

## Runtime Client Methods

Use runtime clients when you want to invoke live A2A/MCP endpoints. These methods accept loaded `Agent`, discovered `AgentSummary`, or direct URL input.

### createMCPClient

Create an MCP runtime client from an `Agent`, `AgentSummary`, or URL.

<Tabs>
<TabItem label="Python">

```python
mcp = sdk.createMCPClient(agent_or_summary_or_url, options=None)
```

</TabItem>
<TabItem label="TypeScript">

```ts
const mcp = sdk.createMCPClient(agentOrSummaryOrUrl, options?);
```

</TabItem>
</Tabs>

**Input modes:**

- `Agent` - returns the agent MCP handle (`agent.mcp`)
- `AgentSummary` - resolves endpoint from `summary.mcp`
- `URL string` - uses the URL as the strict direct MCP JSON-RPC endpoint (no `/.well-known` discovery)

**Returns:** MCP runtime handle exposing tools, prompts, and resources.

**Runtime MCP capabilities:**

- `mcp.tools.list()` and `mcp.tools.call(name, args?)`
- `mcp.prompts.list()` and `mcp.prompts.get(name, args?)`
- `mcp.resources.list()`, `mcp.resources.templates()`, and `mcp.resources.read(uri)`

**Auth/session note:** MCP auth/session negotiation is transport/server specific and handled by the MCP client stack.

**x402 note:** If an MCP endpoint enforces payment, use x402 handling in your runtime flow (see [Usage: x402](/2-usage/2-11-x402/)).

See [Usage: Configure Agents](/2-usage/2-2-configure-agents/#runtime-client-creation-mcp--a2a) for examples.
See [Usage: MCP](/2-usage/2-12-mcp/) for end-to-end runtime MCP usage.

## A2A

Call agents via A2A using an **Agent** (from `loadAgent`), an **AgentSummary** (e.g. from `searchAgents`), or a URL string. See [Usage: A2A](/2-usage/2-10-a2a/).

### createA2AClient

Get a callable A2A client from an `Agent`, `AgentSummary`, or URL string.

<Tabs>
<TabItem label="Python">

```python
client = sdk.createA2AClient(agent_or_summary_or_url)
```

</TabItem>
<TabItem label="TypeScript">

```ts
const client = sdk.createA2AClient(agentOrSummaryOrUrl);
```

</TabItem>
</Tabs>

**Input modes:**

- `Agent` - returns the agent itself (A2A methods available directly on Agent)
- `AgentSummary` - resolves from `summary.a2a`
- `URL string` - supports base URL discovery (`/.well-known/agent-card.json` then `/.well-known/agent.json`) or direct agent-card URL

**Returns:** The Agent (if passed) or an A2A client exposing `messageA2A`, `listTasks`, `loadTask`.

### messageA2A

Send a message to the agent’s A2A endpoint. Call on the client from `createA2AClient` or on an Agent.

<Tabs>
<TabItem label="Python">

```python
out = client.messageA2A(
    content: Union[str, Dict],
    options: Optional[MessageA2AOptions] = None
) -> Union[MessageResponse, TaskResponse, A2APaymentRequired]
```

</TabItem>
<TabItem label="TypeScript">

```ts
const out = await client.messageA2A(
  content: string | { parts: Part[] },
  options?: MessageA2AOptions
);
```

</TabItem>
</Tabs>

**Parameters:**

- `content` (str or dict): Plain text or `{ "parts": [Part] }`.
- `options` (optional): MessageA2AOptions (blocking, contextId, taskId, credential, payment, etc.).

**Returns:** **MessageResponse**, **TaskResponse** (with `task` handle), or **A2APaymentRequired** (402; use `x402Payment.pay()` then retry).

### listTasks

List tasks for the agent.

<Tabs>
<TabItem label="Python">

```python
tasks = client.listTasks(options: Optional[ListTasksOptions] = None)
```

</TabItem>
<TabItem label="TypeScript">

```ts
const tasks = await client.listTasks(options?: ListTasksOptions);
```

</TabItem>
</Tabs>

**Returns:** List of **TaskSummary**, or **A2APaymentRequired** on 402.

### loadTask

Load a task by ID.

<Tabs>
<TabItem label="Python">

```python
task = client.loadTask(
    task_id: str,
    options: Optional[LoadTaskOptions] = None
)
```

</TabItem>
<TabItem label="TypeScript">

```ts
const task = await client.loadTask(taskId: string, options?: LoadTaskOptions);
```

</TabItem>
</Tabs>

**Parameters:**

- `task_id` / `taskId` (str): Task ID.
- `options` (optional): LoadTaskOptions.

**Returns:** **AgentTask** (with `taskId`, `contextId`, `query()`, `message()`, `cancel()`), or **A2APaymentRequired** on 402.

### task.query()

Get the current task state, optional artifacts, and message history. Call on an **AgentTask** (from `loadTask` or from `response.task`).

<Tabs>
<TabItem label="Python">

```python
result = task.query(options: Optional[Dict] = None)
# -> TaskQueryResult | A2APaymentRequired[TaskQueryResult]
```

</TabItem>
<TabItem label="TypeScript">

```ts
const result = await task.query(options?: { historyLength?: number });
// TaskQueryResult | A2APaymentRequired<TaskQueryResult>
```

</TabItem>
</Tabs>

**Parameters:** `options` (optional): e.g. `historyLength` for message history.

**Returns:** **TaskQueryResult** (`taskId`, `contextId`, `status?`, `artifacts?`, `messages?`), or **A2APaymentRequired** on 402. `status` is server-specific (e.g. open, working, completed, failed, canceled, rejected).

### task.message()

Send a follow-up message in this task. Call on an **AgentTask**.

<Tabs>
<TabItem label="Python">

```python
out = task.message(content: Union[str, Dict])
# -> MessageResponse | TaskResponse | A2APaymentRequired
```

</TabItem>
<TabItem label="TypeScript">

```ts
const out = await task.message(content: string | { parts: Part[] });
// MessageResponse | TaskResponse | A2APaymentRequired<...>
```

</TabItem>
</Tabs>

**Returns:** **MessageResponse**, **TaskResponse** (with new `task` handle if the agent created a sub-task), or **A2APaymentRequired** on 402.

### task.cancel()

Cancel the task. Call on an **AgentTask**.

<Tabs>
<TabItem label="Python">

```python
result = task.cancel()
# -> TaskCancelResult | A2APaymentRequired[TaskCancelResult]
```

</TabItem>
<TabItem label="TypeScript">

```ts
const result = await task.cancel();
// TaskCancelResult | A2APaymentRequired<TaskCancelResult>
```

</TabItem>
</Tabs>

**Returns:** **TaskCancelResult** (`taskId`, `contextId`, `status?`), or **A2APaymentRequired** on 402.

## Transfer Methods

### transferAgent

Transfer agent ownership to a new address.

<Tabs>
<TabItem label="Python">

```python
tx = sdk.transferAgent(
    agentId: str,
    newOwnerAddress: str
) -> TransactionHandle[Dict[str, Any]]
result = tx.wait_confirmed(timeout=180).result
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import type { AgentId, Address, TransactionHandle } from 'agent0-sdk';

const tx: TransactionHandle<{
  txHash: string;
  from: Address;
  to: Address;
  agentId: AgentId;
}> = await sdk.transferAgent(
  agentId: AgentId,
  newOwner: Address
);
const { result } = await tx.waitConfirmed();
```

</TabItem>
</Tabs>

**Parameters:**

- `agentId` (str / AgentId): The agent ID to transfer
- `newOwnerAddress` / `newOwner` (str / Address): Ethereum address of the new owner
**Returns:**

- Python: `Dict[str, Any]` containing:

- `txHash` (str): Transaction hash
- `from` (str): Previous owner address
- `to` (str): New owner address
- `agentId` (str): Agent ID that was transferred

- TypeScript: Object with typed fields `{ txHash: string; from: Address; to: Address; agentId: AgentId }`
**Raises/Throws:**

- Python: `ValueError`: If agent not found or transfer not allowed
- TypeScript: `Error`: If agent not found or transfer not allowed
**Example:**

<Tabs>
<TabItem label="Python">

```python
# Transfer agent using SDK method
tx = sdk.transferAgent(
    agentId="11155111:123",
    newOwnerAddress="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
)
result = tx.wait_confirmed(timeout=180).result

print(f"Transfer successful: {result['txHash']}")
print(f"New owner: {result['to']}")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Transfer agent using SDK method
const tx = await sdk.transferAgent(
  "11155111:123",
  "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
);
const { result } = await tx.waitConfirmed();

console.log(`Transfer successful: ${result.txHash}`);
console.log(`New owner: ${result.to}`);
```

</TabItem>
</Tabs>

**Comparison with Agent.transfer():**

- `sdk.transferAgent()` is a convenience method that loads the agent first
- `agent.transfer()` works directly on an existing agent instance
- Both methods perform the same validation and transfer logic
- Use `sdk.transferAgent()` when you only have the agent ID
- Use `agent.transfer()` when you already have an agent instance
**Important Notes:**

- Only the current owner can transfer the agent
- Agent URI, metadata, and all other data remain unchanged
- Transfer is irreversible - ensure the new owner is correct
- Invalid addresses and self-transfers are automatically rejected
- Address validation includes checksum format verification
## Owner Utility Methods

### getAgentOwner

Get the current owner of an agent.

<Tabs>
<TabItem label="Python">

```python
owner = sdk.getAgentOwner(agentId: str) -> str
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import type { AgentId, Address } from 'agent0-sdk';

const owner: Address = await sdk.getAgentOwner(agentId: AgentId);
```

</TabItem>
</Tabs>

**Parameters:**

- `agentId` (str / AgentId): The agent ID to check
**Returns:**

- Python: `str` - The current owner’s Ethereum address
- TypeScript: `Address` - The current owner’s Ethereum address
**Raises/Throws:**

- Python: `ValueError`: If agent ID is invalid or agent doesn’t exist
- TypeScript: `Error`: If agent ID is invalid or agent doesn’t exist
**Example:**

<Tabs>
<TabItem label="Python">

```python
owner = sdk.getAgentOwner("11155111:123")
print(f"Current owner: {owner}")
```

</TabItem>
<TabItem label="TypeScript">

```ts
const owner = await sdk.getAgentOwner("11155111:123");
console.log(`Current owner: ${owner}`);
```

</TabItem>
</Tabs>

### isAgentOwner

Check if an address is the owner of an agent.

<Tabs>
<TabItem label="Python">

```python
is_owner = sdk.isAgentOwner(
    agentId: str,
    address: Optional[str] = None
) -> bool
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import type { AgentId, Address } from 'agent0-sdk';

const isOwner: boolean = await sdk.isAgentOwner(
  agentId: AgentId,
  address: Address
);
```

</TabItem>
</Tabs>

**Parameters:**

- `agentId` (str / AgentId): The agent ID to check
- `address` (str / Address, optional in Python, required in TypeScript): Address to check (Python defaults to SDK’s signer address)
**Returns:**

- `bool`: True if the address is the owner, False otherwise
**Raises/Throws:**

- Python: `ValueError`: If agent ID is invalid or agent doesn’t exist
- TypeScript: `Error`: If agent ID is invalid or agent doesn’t exist
**Example:**

<Tabs>
<TabItem label="Python">

```python
# Check if current signer is owner
is_owner = sdk.isAgentOwner("11155111:123")

# Check if specific address is owner
is_owner = sdk.isAgentOwner("11155111:123", "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Check if specific address is owner (address is required in TypeScript)
const isOwner = await sdk.isAgentOwner(
  "11155111:123",
  "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
);
```

</TabItem>
</Tabs>

### canTransferAgent

Check if an address can transfer an agent (i.e., is the owner).

<Tabs>
<TabItem label="Python">

```python
can_transfer = sdk.canTransferAgent(
    agentId: str,
    address: Optional[str] = None
) -> bool
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Note: This method is not available in TypeScript SDK
// Use isAgentOwner instead, which serves the same purpose
const canTransfer = await sdk.isAgentOwner(agentId, address);
```

</TabItem>
</Tabs>

**TypeScript Note:** This method is not available in the TypeScript SDK. Use `isAgentOwner()` instead, which serves the same purpose.

**Parameters:**

- `agentId` (str): The agent ID to check
- `address` (str, optional): Address to check (defaults to SDK’s signer address)
**Returns:**

- `bool`: True if the address can transfer the agent, False otherwise
**Example:**

<Tabs>
<TabItem label="Python">

```python
# Check if current signer can transfer
can_transfer = sdk.canTransferAgent("11155111:123")

# Check if specific address can transfer
can_transfer = sdk.canTransferAgent("11155111:123", "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Use isAgentOwner as equivalent
const canTransfer = await sdk.isAgentOwner(
  "11155111:123",
  "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
);
```

</TabItem>
</Tabs>

## Utility Methods

### chain_id / chainId

Get current chain ID.

<Tabs>
<TabItem label="Python">

```python
chain_id = sdk.chain_id() -> int
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import type { ChainId } from 'agent0-sdk';

const chainId: ChainId = await sdk.chainId();
```

</TabItem>
</Tabs>

**TypeScript Note:** Method is async and uses camelCase naming.

### registries

Get registry addresses.

<Tabs>
<TabItem label="Python">

```python
registries = sdk.registries() -> Dict[str, str]
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';
import type { Address } from 'agent0-sdk';

const registries: Record = sdk.registries();
```

</TabItem>
</Tabs>

### set_chain

Switch to a different chain.

<Tabs>
<TabItem label="Python">

```python
sdk.set_chain(chain_id: int) -> None
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Note: This method is not available in TypeScript SDK
// Create a new SDK instance with the desired chainId instead
const sdk = new SDK({
  chainId: newChainId,
  rpcUrl: newRpcUrl,
  // ... other config
});
```

</TabItem>
</Tabs>

**TypeScript Note:** This method is not available in the TypeScript SDK. Create a new SDK instance with the desired `chainId` instead.

### isReadOnly

Check if SDK is in read-only mode.

<Tabs>
<TabItem label="Python">

```python
is_readonly = sdk.isReadOnly -> bool
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';

const isReadOnly: boolean = sdk.isReadOnly;
```

</TabItem>
</Tabs>

**TypeScript Note:** Property access (not a method), uses camelCase naming.

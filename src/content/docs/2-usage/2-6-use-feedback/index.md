---
title: "Feedback"
description: "Give and manage feedback"
---
Complete guide to giving feedback, managing reputation, and using feedback data to evaluate agents.

## Feedback ID Format

Feedback IDs follow the format `"agentId:clientAddress:feedbackIndex"`:

- **agentId**: The agent’s ID in `"chainId:agentId"` format (e.g., `"11155111:123"`) or just `"agentId"` (uses SDK’s default chain)
- **clientAddress**: Ethereum address of the feedback giver (normalized to lowercase)
- **feedbackIndex**: Sequential index of feedback from this client to this agent (0-based)
- **Example**: `"11155111:123:0x742d35cc6634c0532925a3b844bc9e7595f0beb7:0"` = First feedback from client `0x742d...` to agent `11155111:123`
See [Models Reference](/5-reference/5-3-models/) for detailed ID format documentation.

## Give Feedback

Submit feedback on-chain. **Only `agentId` and `value` are required.**

Optionally, you can also include **additional on-chain fields** (`tag1`, `tag2`, `endpoint`).

Separately, if you want richer off-chain metadata (text + spec-aligned protocol fields), you can **optionally** attach an **off-chain** `feedbackFile` payload (see the next section).

### Feedback Parameters

**Mandatory on-chain fields:**

- `agentId` - The agent’s ID
- `value` - Signed decimal reputation/trust value

**Optional on-chain fields:**

- `tag1`, `tag2` - Optional on-chain tags (free-form strings)
- `endpoint` - Optional on-chain endpoint URI related to the feedback

**Optional off-chain field:**

- `feedbackFile` - Optional off-chain feedback file payload (create with `prepareFeedbackFile(...)`)

Common `feedbackFile` fields:

- `text` - Optional free-form text
- `mcpTool` - MCP tool identifier (string)
- `mcpPrompt` - MCP prompt identifier (string)
- `mcpResource` - MCP resource identifier (string)
- `a2aSkills` - A2A skills evaluated (string array)
- `a2aContextId` - A2A context identifier (string)
- `a2aTaskId` - A2A task identifier (string)
- `oasfSkills` - OASF skills evaluated (string array)
- `oasfDomains` - OASF domains evaluated (string array)
- `proofOfPayment` - Payment proof data for x402 payments

<Tabs>
<TabItem label="Python">

```python
# Minimal on-chain feedback (no file). Only agentId + value are required.
tx = sdk.giveFeedback(
    agentId="11155111:123",
    value=85,
    tag1="data_analyst",  # optional on-chain
    tag2="finance",       # optional on-chain
    endpoint="https://api.example.com/feedback",  # optional on-chain
)
feedback2 = tx.wait_confirmed(timeout=180).result
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Minimal on-chain feedback (no file). Only agentId + value are required.
const tx = await sdk.giveFeedback(
  '11155111:123',
  85,
  'data_analyst', // tag1 (optional on-chain)
  'finance', // tag2 (optional on-chain)
  'https://api.example.com/feedback' // endpoint (optional on-chain)
);
const { result: feedback2 } = await tx.waitConfirmed();
```

</TabItem>
</Tabs>

## Optional: Prepare a Feedback File (Rich Off-chain Fields)

Use `prepareFeedbackFile()` to build an **optional off-chain** feedback payload when you need rich fields (text + spec-aligned protocol fields).
On-chain fields like `value`, `tag1`, `tag2`, and `endpoint` are still passed directly to `giveFeedback(...)`.

<Tabs>
<TabItem label="Python">

```python
feedback_file = sdk.prepareFeedbackFile({
    "text": "Great agent, very helpful.",
    "mcpTool": "financial_analyzer",
    "a2aSkills": ["financial_analysis"],
    "a2aTaskId": "analyze_balance_sheet",
    "a2aContextId": "session:abc",
    "proofOfPayment": {"txHash": "0x...", "amount": "0.01"},
})

# Submit feedback (on-chain fields + optional feedbackFile)
tx = sdk.giveFeedback(
    agentId="11155111:123",
    value=85,
    tag1="data_analyst",
    tag2="finance",
    endpoint="https://api.example.com/feedback",
    feedbackFile=feedback_file,  # optional
)
feedback = tx.wait_confirmed(timeout=180).result
```

</TabItem>
<TabItem label="TypeScript">

```ts
const feedbackFile = sdk.prepareFeedbackFile({
  text: 'Great agent, very helpful.',
  mcpTool: 'financial_analyzer',
  a2aSkills: ['financial_analysis'],
  a2aTaskId: 'analyze_balance_sheet',
  a2aContextId: 'session:abc',
  proofOfPayment: { txHash: '0x...', amount: '0.01' },
});

// Submit feedback (on-chain fields + optional feedbackFile)
const tx = await sdk.giveFeedback(
  '11155111:123',
  85,
  'data_analyst',
  'finance',
  'https://api.example.com/feedback',
  feedbackFile
);
const { result: feedback } = await tx.waitConfirmed();
```

</TabItem>
</Tabs>

## Read Feedback

### Get Single Feedback

<Tabs>
<TabItem label="Python">

```python
# Read feedback by components (feedbackIndex is 0-based)
feedback = sdk.getFeedback("11155111:123", "0xClient", 0)
print(f"Value: {feedback.value}")
print(f"Tags: {feedback.tags}")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Read feedback by ID
// Note: In TypeScript, getFeedback requires separate params
const feedback = await sdk.getFeedback(
  '11155111:123',
  '0xClient', // clientAddress
  0 // feedbackIndex
);
console.log(`Value: ${feedback.value}`);
console.log(`Tags: ${feedback.tags}`);
```

</TabItem>
</Tabs>

### Search Feedback

**Important:** The filter parameter names `capabilities` and `skills` are kept for compatibility, but they map to the spec-aligned feedback file fields:

- `capabilities` → `feedbackFile.mcpTool`
- `skills` → `feedbackFile.a2aSkills`

<Tabs>
<TabItem label="Python">

```python
# Search feedback with filters
# Using default chain
results = sdk.searchFeedback(
    agentId="123",  # Uses SDK's default chain
    capabilities=["financial_analyzer"],  # filters by feedbackFile.mcpTool
    skills=["financial_analysis"],        # filters by feedbackFile.a2aSkills
    tags=["data_analyst"],
    minValue=0,
    maxValue=100
)

for fb in results:
    print(f"{fb.value}: {fb.tags}")

# NEW: search feedback given by a reviewer wallet (across all agents; subgraph required)
given = sdk.searchFeedback(
    reviewers=["0x742d35cc6634c0532925a3b844bc9e7595f0beb7"]
)

# NEW: search feedback across multiple agents at once
multi = sdk.searchFeedback(
    agents=["11155111:123", "11155111:456", "11155111:789"]
)
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Search feedback with filters (async in TypeScript)
// Using default chain
const results = await sdk.searchFeedback(
  {
    agentId: '123', // Uses SDK's default chain
    tags: ['data_analyst'],
    capabilities: ['financial_analyzer'], // filters by feedbackFile.mcpTool
    skills: ['financial_analysis'],       // filters by feedbackFile.a2aSkills
  },
  { minValue: 0, maxValue: 100 }
);

for (const fb of results) {
  console.log(`${fb.value}: ${fb.tags.join(', ')}`);
}

// NEW: search feedback given by a reviewer wallet (across all agents; subgraph required)
const given = await sdk.searchFeedback({
  reviewers: ['0x742d35cc6634c0532925a3b844bc9e7595f0beb7'],
});

// NEW: search feedback across multiple agents at once
const multi = await sdk.searchFeedback({
  agents: ['11155111:123', '11155111:456', '11155111:789'],
});
```

</TabItem>
</Tabs>

## Reputation Summary

<Tabs>
<TabItem label="Python">

```python
# Get aggregated reputation
# Using default chain
summary = sdk.getReputationSummary("123")  # Uses SDK's default chain

# Explicitly specify chain
summary = sdk.getReputationSummary("11155111:123")  # ETH Sepolia

print(f"Average value: {summary['averageValue']}")
print(f"Total feedback: {summary['totalFeedback']}")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Get aggregated reputation (async in TypeScript)
// Note: TypeScript version returns count and averageValue only
// Using default chain
const summary = await sdk.getReputationSummary('123');  // Uses SDK's default chain

// Explicitly specify chain
const summary = await sdk.getReputationSummary('11155111:123');  // ETH Sepolia

console.log(`Average value: ${summary.averageValue}`);
console.log(`Total feedback: ${summary.count}`);
```

</TabItem>
</Tabs>

## Agent Reputation Search

Find agents by reputation:

<Tabs>
<TabItem label="Python">

```python
# Optional: include revoked feedback entries in reputation filters
results = sdk.searchAgents(
    filters={"feedback": {"minValue": 80, "tag": "enterprise", "includeRevoked": True}},
)

# Find highly-rated agents (unified search)
# Single chain (uses SDK's default chain)
results = sdk.searchAgents(
    filters={"feedback": {"minValue": 80, "tag": "enterprise"}},
)

# Single specific chain
results = sdk.searchAgents(
    filters={"chains": [11155111], "feedback": {"minValue": 80, "tag": "enterprise"}},
)

# Multiple chains
results = sdk.searchAgents(
    filters={"chains": [11155111, 137], "feedback": {"minValue": 80, "tag": "enterprise"}},
)

# All supported chains
results = sdk.searchAgents(
    filters={"chains": "all", "feedback": {"minValue": 80, "tag": "enterprise"}},
)

for agent in results:
    print(f"{agent.name}: {agent.averageValue}")
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Find highly-rated agents (unified search)
// Single chain (uses SDK's default chain)
const singleChainResults = await sdk.searchAgents(
  { feedback: { minValue: 80, tag: 'enterprise' } }
);

// Single specific chain
const sepoliaResults = await sdk.searchAgents(
  { chains: [11155111], feedback: { minValue: 80, tag: 'enterprise' } }
);

// Multiple chains
const multiChainResults = await sdk.searchAgents(
  { chains: [11155111, 137], feedback: { minValue: 80, tag: 'enterprise' } }
);

// All supported chains
const allChainsResults = await sdk.searchAgents(
  { chains: 'all', feedback: { minValue: 80, tag: 'enterprise' } }
);

for (const agent of singleChainResults) {
  console.log(`${agent.name}: ${agent.averageValue}`);
}
```

</TabItem>
</Tabs>

### FeedbackFilters (exhaustive reference for unified agent search)

When you use `sdk.searchAgents()`, reputation filters live under `filters.feedback`.

**Semantics note:** `minValue/maxValue/minCount/maxCount` apply to the **average/count over feedback entries that match the other feedback constraints** (tags, endpoint, fromReviewers, hasResponse, includeRevoked).

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

| Field | Semantics |
| --- | --- |
| `hasFeedback` | Only agents with at least 1 feedback |
| `hasNoFeedback` | Only agents with 0 feedback |
| `includeRevoked` | Include revoked feedback entries in the pool used for filtering |
| `minValue` / `maxValue` | Threshold on **average value** (inclusive) |
| `minCount` / `maxCount` | Threshold on **count** (inclusive) |
| `fromReviewers` | Only consider feedback from these reviewer wallets |
| `endpoint` | Only consider feedback whose `endpoint` contains this substring |
| `hasResponse` | Only consider feedback that has at least one response (if supported) |
| `tag1` / `tag2` | Only consider feedback matching tag1/tag2 |
| `tag` | Shorthand: match either tag1 OR tag2 |

## Manage Feedback

### Append Response

<Tabs>
<TabItem label="Python">

```python
# Agent responds to feedback with refund acknowledgment
tx = sdk.appendResponse(
    agentId="11155111:123",
    clientAddress=client_address,
    feedbackIndex=0,
    response={
        "message": "We apologize for the poor service. A full refund has been processed.",
        "refundTxHash": "0x1234567890abcdef...",
        "refundAmount": "0.1 ETH",
        "timestamp": int(time.time())
    }
)
updated_feedback = tx.wait_confirmed(timeout=180).result
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Agent responds to feedback with refund acknowledgment (async in TypeScript)
// Note: In TypeScript, response is provided as uri and hash separately
const responseUri = 'ipfs://QmExampleResponse'; // IPFS URI of response file
const responseHash = '0x' + '00'.repeat(32); // Hash of response content

const tx = await sdk.appendResponse(
  '11155111:123',
  clientAddress,
  0, // feedbackIndex
  {
    uri: responseUri,
    hash: responseHash,
  }
);
await tx.waitConfirmed();
console.log(`Response appended. Tx: ${tx.hash}`);
```

</TabItem>
</Tabs>

### Revoke Feedback

<Tabs>
<TabItem label="Python">

```python
# Revoke feedback
tx = sdk.revokeFeedback(
    agentId="11155111:123",
    feedbackIndex=0
)
tx.wait_confirmed(timeout=180)
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Revoke feedback (async in TypeScript)
// Note: clientAddress is automatically determined from the signer
const tx = await sdk.revokeFeedback(
  '11155111:123',
  0 // feedbackIndex
);
await tx.waitConfirmed();
console.log(`Feedback revoked. Tx: ${tx.hash}`);
```

</TabItem>
</Tabs>

## Feedback Data Structure

```python
@dataclass
class Feedback:
    id: str                        # Unique feedback ID
    agentId: str                   # Agent identifier
    reviewer: str                  # Client address
    value: float                   # Signed decimal value (MANDATORY)
    tags: Optional[List[str]]      # Categorization tags (optional)
    # Spec-aligned FeedbackFile fields (populated when a feedback file exists)
    mcpTool: Optional[str]
    mcpPrompt: Optional[str]
    mcpResource: Optional[str]
    a2aSkills: Optional[List[str]]
    a2aContextId: Optional[str]
    a2aTaskId: Optional[str]
    oasfSkills: Optional[List[str]]
    oasfDomains: Optional[List[str]]
    fileURI: Optional[str]         # IPFS/HTTPS URI (if feedback file exists)
    createdAt: int                 # Timestamp
    answers: List[dict]            # Responses
    isRevoked: bool                # Revocation status
```

**Note:** Only `value` is mandatory when creating feedback. All other fields are optional and can be omitted for minimal on-chain-only feedback.

## Next Steps

- Explore [Examples](/3-examples/3-1-quick-start/)
- Learn about [Subgraph](/4-subgraph/4-1-intro/)

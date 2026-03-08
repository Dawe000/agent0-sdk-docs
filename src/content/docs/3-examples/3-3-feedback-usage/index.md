---
title: "Feedback Usage"
description: "Complete feedback workflow"
---
Full example of giving feedback and managing reputation.

<Tabs>
<TabItem label="Python">

```python
from agent0_sdk import SDK
import os

# Initialize SDKs
agent_sdk = SDK(
    chainId=11155111,
    rpcUrl=os.getenv("RPC_URL"),
    signer=os.getenv("AGENT_PRIVATE_KEY"),
    ipfs="pinata",
    pinataJwt=os.getenv("PINATA_JWT"),
)

client_sdk = SDK(
    chainId=11155111,
    rpcUrl=os.getenv("RPC_URL"),
    signer=os.getenv("CLIENT_PRIVATE_KEY"),
    ipfs="pinata",
    pinataJwt=os.getenv("PINATA_JWT"),
)

agent_id = "11155111:123"

# Client prepares an OPTIONAL off-chain feedback file (spec-aligned fields)
feedback_file = client_sdk.prepareFeedbackFile(
    {
        "text": "Great agent, very helpful.",
        "mcpTool": "financial_analyzer",
        "a2aSkills": ["financial_analysis"],
        "a2aTaskId": "analyze_balance_sheet",
        "a2aContextId": "session:abc",
    }
)

# Client submits feedback on-chain (and uploads feedback file if provided)
tx = client_sdk.giveFeedback(
    agentId=agent_id,
    value=90,
    tag1="data_analyst",
    tag2="finance",
    endpoint="https://api.example.com/feedback",
    feedbackFile=feedback_file,  # optional
)
feedback = tx.wait_confirmed(timeout=180).result

print(f"✅ Feedback submitted: {feedback.id}")  # (agentId, clientAddress, feedbackIndex)

# Read single feedback (separate params; feedbackIndex is 0-based)
agentId, clientAddress, feedbackIndex = feedback.id
retrieved = agent_sdk.getFeedback(agentId, clientAddress, feedbackIndex)
print(f"Value: {retrieved.value}")
print(f"Tags: {retrieved.tags}")

# Search feedback
all_feedback = agent_sdk.searchFeedback(
    agentId=agent_id,
    tags=["data_analyst"],
    minValue=80,
)
print(f"Found {len(all_feedback)} positive feedback entries")

# NEW: feedback given by a wallet (reviewer-only; across all agents; subgraph required)
given_feedback = agent_sdk.searchFeedback(
    reviewers=[clientAddress]
)
print(f"Found {len(given_feedback)} feedback entries written by {clientAddress}")

# Append a response (agent acknowledges the feedback)
tx = agent_sdk.appendResponse(
    agentId=agentId,
    clientAddress=clientAddress,
    feedbackIndex=feedbackIndex,
    response={"text": "Thanks for the feedback!", "timestamp": 0},
)
tx.wait_confirmed(timeout=180)

# Get reputation
summary = agent_sdk.getReputationSummary(agent_id)
print(f"Average: {summary['averageValue']}")
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';

async function main() {
  // Initialize SDKs
  const agentSdk = new SDK({
    chainId: 11155111,
    rpcUrl: process.env.RPC_URL || '',
    privateKey: process.env.AGENT_PRIVATE_KEY,
    ipfs: 'pinata',
    pinataJwt: process.env.PINATA_JWT,
  });

  const clientSdk = new SDK({
    chainId: 11155111,
    rpcUrl: process.env.RPC_URL || '',
    privateKey: process.env.CLIENT_PRIVATE_KEY,
    ipfs: 'pinata',
    pinataJwt: process.env.PINATA_JWT,
  });

  const agentId = '11155111:123';

  // Client prepares an OFF-CHAIN feedback file (optional).
  // This does NOT include on-chain fields like value/tag1/tag2/endpoint.
  const feedbackFile = clientSdk.prepareFeedbackFile({
    text: 'Great agent, very helpful.',
    mcpTool: 'financial_analyzer',
    a2aSkills: ['financial_analysis'],
    a2aTaskId: 'analyze_balance_sheet',
    a2aContextId: 'session:abc',
    proofOfPayment: { txHash: '0x...', amount: '0.01' },
  });

  // Submit feedback (async in TypeScript)
  const tx = await clientSdk.giveFeedback(
    agentId,
    90, // value
    'data_analyst',
    'finance',
    'https://api.example.com/feedback',
    feedbackFile
  );

  const { result: feedback } = await tx.waitConfirmed();
  console.log(`✅ Feedback submitted: ${feedback.id.join(':')}`);

  // Read single feedback (async in TypeScript)
  // Note: getFeedback requires separate params in TypeScript
  const [feedbackAgentId, clientAddress, feedbackIndex] = feedback.id;
  const retrieved = await agentSdk.getFeedback(
    feedbackAgentId,
    clientAddress,
    feedbackIndex
  );
  console.log(`Value: ${retrieved.value}`);
  console.log(`Tags: ${retrieved.tags}`);

  // Search feedback (async in TypeScript)
  const allFeedback = await agentSdk.searchFeedback(
    {
      agentId,
      tags: ['data_analyst'],
      capabilities: ['financial_analyzer'],
      skills: ['financial_analysis'],
    },
    { minValue: 80 }
  );
  console.log(`Found ${allFeedback.length} positive feedbacks`);

  // NEW: feedback given by a wallet (reviewer-only; across all agents; subgraph required)
  const givenFeedback = await agentSdk.searchFeedback({
    reviewers: ['0x742d35cc6634c0532925a3b844bc9e7595f0beb7'],
  });
  console.log(`Found ${givenFeedback.length} feedback entries written by that wallet`);

  // Get reputation (async in TypeScript)
  const summary = await agentSdk.getReputationSummary(agentId);
  console.log(`Average: ${summary.averageValue}`);
}

main().catch(console.error);
```

</TabItem>
</Tabs>

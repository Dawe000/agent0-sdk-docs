---
title: "Example Queries"
description: "GraphQL query examples"
---
Example GraphQL queries for the Agent0 subgraph.

## Get All Agents

```graphql
{
  agents(first: 20) {
    id
    agentId
    chainId
    owner
    agentURI
    totalFeedback
    lastActivity
    registrationFile {
      name
      description
      active
      mcpEndpoint
      a2aEndpoint
    }
  }
}
```

## Find Agent by ID

```graphql
{
  agent(id: "11155111:374") {
    id
    agentId
    chainId
    owner
    agentURI
    totalFeedback
    registrationFile {
      name
      description
    }
    feedback(first: 5) {
      value
      tag1
      tag2
      feedbackFile {
        text
      }
    }
  }
}
```

## Find MCP-Compatible Agents

```graphql
{
  agentRegistrationFiles(
    where: {
      mcpEndpoint_not: null
      active: true
    }
    first: 10
  ) {
    agentId
    name
    description
    mcpEndpoint
    mcpTools
  }
}
```

## Search by Capability

```graphql
{
  agentRegistrationFiles(
    where: { mcpTools_contains: ["code_generation"] }
    first: 10
  ) {
    agentId
    name
    mcpTools
  }
}
```

## High-Rated Agents

```graphql
{
  agentStats(
    where: { averageValue_gte: "80.0" }
    orderBy: averageValue
    orderDirection: desc
    first: 10
  ) {
    agent {
      id
      agentId
      registrationFile {
        name
      }
      totalFeedback
    }
    averageValue
    totalFeedback
  }
}
```

## Agent Feedback with Responses

```graphql
{
  feedbacks(
    where: { agent_: { id: "11155111:374" } }
    first: 10
  ) {
    value
    tag1
    tag2
    feedbackFile {
      text
    }
    responses {
      responder
      responseUri
      createdAt
    }
  }
}
```

## Global Statistics

```graphql
{
  globalStats(id: "global") {
    totalAgents
    totalFeedback
    totalProtocols
    tags
  }
}
```

## Complete Agent Profile

```graphql
{
  agent(id: "11155111:374") {
    id
    agentId
    chainId
    owner
    agentURI
    createdAt
    updatedAt
    totalFeedback
    lastActivity

    registrationFile {
      name
      description
      image
      active
      x402Support
      supportedTrusts
      mcpEndpoint
      mcpVersion
      mcpTools
      mcpPrompts
      mcpResources
      a2aEndpoint
      a2aVersion
      a2aSkills
      ens
      did
      agentWallet
      agentWalletChainId
    }

    feedback(
      where: { isRevoked: false }
      orderBy: createdAt
      orderDirection: desc
      first: 10
    ) {
      value
      tag1
      tag2
      clientAddress
      feedbackUri
      createdAt
      feedbackFile {
        text
        mcpTool
        mcpPrompt
        mcpResource
        a2aSkills
        a2aContextId
        a2aTaskId
        oasfSkills
        oasfDomains
      }
      responses {
        responder
        responseUri
        createdAt
      }
    }

    validations(
      orderBy: createdAt
      orderDirection: desc
      first: 10
    ) {
      validatorAddress
      response
      status
      tag
      createdAt
    }
  }
}
```

## Search Agents by Name

```graphql
{
  agentRegistrationFiles(
    where: { name_contains: "test", active: true }
    first: 50
  ) {
    agentId
    name
    description
    image
  }
}
```

## Find Agents by Trust Model

```graphql
{
  agentRegistrationFiles(
    where: { supportedTrusts_contains: ["reputation"], active: true }
    first: 50
  ) {
    agentId
    name
    description
    supportedTrusts
  }
}
```

## Agent search with nested `registrationFile_` filters (SDK-style pushdown)

The SDK typically queries `agents(where: { ... agent fields ..., registrationFile_: { ... } })` so it can combine on-chain fields (owner/operators/wallet/timestamps) with registration-file fields (endpoints/capabilities/trust models).

```graphql
{
  agents(
    where: {
      createdAt_gte: "1735689600" # 2025-01-01 (unix seconds)
      updatedAt_lte: "1798761600" # 2026-12-31 (unix seconds)
      registrationFile_: {
        active: true
        mcpEndpoint_not: null
        mcpEndpoint_contains_nocase: "mcp"
        webEndpoint_not: null
        hasOASF: true
      }
    }
    first: 20
    orderBy: updatedAt
    orderDirection: desc
  ) {
    id
    chainId
    agentId
    owner
    operators
    createdAt
    updatedAt
    totalFeedback
    registrationFile {
      name
      mcpEndpoint
      webEndpoint
      hasOASF
      oasfSkills
      oasfDomains
    }
  }
}
```

## Feedback prefilter query (used by unified reputation search)

Unified `searchAgents(filters.feedback=...)` can prefilter agents by scanning feedback entries and computing per-agent counts/averages for the current query.

```graphql
{
  feedbacks(
    where: {
      isRevoked: false
      endpoint_contains_nocase: "https://"
      or: [{ tag1: "enterprise" }, { tag2: "enterprise" }]
    }
    first: 1000
    skip: 0
    orderBy: createdAt
    orderDirection: desc
  ) {
    agent { id }
    clientAddress
    value
    tag1
    tag2
    endpoint
    responses { id }
  }
}
```

## Metadata prefilter query (SDK two-phase metadata filtering)

Metadata filters (`hasMetadataKey`, `metadataValue`) are implemented as a two-phase flow: first query metadata rows to get matching agent IDs, then constrain the agent search to that allowlist.

### Variant A: `agentMetadatas` (newer deployments)

```graphql
{
  agentMetadatas(where: { key: "category" }, first: 1000, skip: 0) {
    agent { id }
    key
    value
    updatedAt
  }
}
```

### Variant B: `agentMetadata_collection` (mainnet deployment compatibility)

```graphql
{
  agentMetadata_collection(where: { key: "category" }, first: 1000, skip: 0) {
    agent { id }
    key
    value
    updatedAt
  }
}
```

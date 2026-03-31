---
title: "MCP"
description: "Call agents via MCP tools, prompts, and resources"
---
Use the SDK to call MCP endpoints exposed by agents. You can create MCP clients from an `Agent`, an `AgentSummary`, or a URL string.

## Create an MCP client

<Tabs>
<TabItem label="Python">

```python
# From URL
mcp = sdk.createMCPClient("https://mcp.example.com/mcp")

# From AgentSummary (e.g. search result)
summary = sdk.searchAgents({"hasMCP": True})[0]
mcp2 = sdk.createMCPClient(summary)

# From loaded Agent
agent = sdk.loadAgent("84532:1298")
mcp3 = sdk.createMCPClient(agent)  # equivalent runtime handle to agent.mcp
```

</TabItem>
<TabItem label="TypeScript">

```ts
// From URL
const mcp = sdk.createMCPClient('https://mcp.example.com/mcp');

// From AgentSummary (e.g. search result)
const [summary] = await sdk.searchAgents({ hasMCP: true });
const mcp2 = sdk.createMCPClient(summary);

// From loaded Agent
const agent = await sdk.loadAgent('84532:1298');
const mcp3 = sdk.createMCPClient(agent); // equivalent runtime handle to agent.mcp
```

</TabItem>
</Tabs>

**URL semantics:** MCP URL is treated as the strict direct endpoint (no `/.well-known` discovery).

## Use tools, prompts, and resources

<Tabs>
<TabItem label="Python">

```python
tools = mcp.tools.list()
result = mcp.tools.call("weather_tool", {"city": "Lisbon"})

prompts = mcp.prompts.list()
prompt = mcp.prompts.get("daily_briefing", {"city": "Lisbon"})

resources = mcp.resources.list()
templates = mcp.resources.templates()
content = mcp.resources.read("resource://weather/lisbon")
```

</TabItem>
<TabItem label="TypeScript">

```ts
const tools = await mcp.tools.list();
const result = await mcp.tools.call('weather_tool', { city: 'Lisbon' });

const prompts = await mcp.prompts.list();
const prompt = await mcp.prompts.get('daily_briefing', { city: 'Lisbon' });

const resources = await mcp.resources.list();
const templates = await mcp.resources.templates();
const content = await mcp.resources.read('resource://weather/lisbon');
```

</TabItem>
</Tabs>

## When MCP returns 402

Some MCP servers may require payment for specific operations. In that case, use the x402 flow (`result.x402Required` then `x402Payment.pay()`/`payFirst()`) and retry with the paid request result.

<Tabs>
<TabItem label="Python">

```python
# Generic x402-aware request flow (useful when your MCP endpoint is payment-gated)
result = sdk.request({
    "url": "https://mcp.example.com/mcp",
    "method": "POST",
    "headers": {"content-type": "application/json"},
    "body": "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\"}"
})

if result.x402Required:
    paid = result.x402Payment.pay()  # pays and retries
    print(paid)
else:
    print(result)
```

</TabItem>
<TabItem label="TypeScript">

```ts
// Generic x402-aware request flow (useful when your MCP endpoint is payment-gated)
const result = await sdk.request({
  url: 'https://mcp.example.com/mcp',
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
});

if (result.x402Required) {
  const paid = await result.x402Payment.pay(); // pays and retries
  console.log(paid);
} else {
  console.log(result);
}
```

</TabItem>
</Tabs>

For full x402 options and helpers, see [x402 usage](/2-usage/2-11-x402/).

## Notes

- For loaded agents, you can use `agent.mcp` directly.
- Discovery metadata (`mcpTools`, `mcpPrompts`, `mcpResources`) helps routing/filtering; runtime calls are performed against live endpoints.
- If a runtime flow requires payment, use the x402 handling described in [x402 usage](/2-usage/2-11-x402/).

For method signatures and detailed return types, see [SDK API — Runtime Client Methods](/5-reference/5-1-sdk/#runtime-client-methods).

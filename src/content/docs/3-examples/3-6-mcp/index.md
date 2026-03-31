---
title: "MCP"
description: "Runtime MCP example: tools, prompts, resources, and x402 handling"
---
This example shows a complete MCP runtime flow: create a client, inspect capabilities, call a tool, and handle payment-gated endpoints with x402.

<Tabs>
<TabItem label="Python">

```python
from agent0_sdk import SDK
import os

sdk = SDK(
    chainId=84532,
    rpcUrl=os.getenv("RPC_URL"),
    signer=os.getenv("PRIVATE_KEY"),
)

# 1) Create MCP client (URL / summary / agent all supported)
mcp = sdk.createMCPClient("https://mcp.example.com/mcp")

# 2) Inspect server capabilities
tools = mcp.tools.list()
prompts = mcp.prompts.list()
resources = mcp.resources.list()

# 3) Call a tool
tool_result = mcp.tools.call("weather_tool", {"city": "Lisbon"})
print(tool_result)

# 4) x402-aware fallback for payment-gated MCP endpoints
result = sdk.request({
    "url": "https://mcp.example.com/mcp",
    "method": "POST",
    "headers": {"content-type": "application/json"},
    "body": "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\"}"
})
if result.x402Required:
    paid = result.x402Payment.pay()
    print(paid)
else:
    print(result)
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';

const sdk = new SDK({
  chainId: 84532,
  rpcUrl: process.env.RPC_URL ?? '',
  privateKey: process.env.PRIVATE_KEY,
});

// 1) Create MCP client (URL / summary / agent all supported)
const mcp = sdk.createMCPClient('https://mcp.example.com/mcp');

// 2) Inspect server capabilities
const tools = await mcp.tools.list();
const prompts = await mcp.prompts.list();
const resources = await mcp.resources.list();

// 3) Call a tool
const toolResult = await mcp.tools.call('weather_tool', { city: 'Lisbon' });
console.log(toolResult);

// 4) x402-aware fallback for payment-gated MCP endpoints
const result = await sdk.request({
  url: 'https://mcp.example.com/mcp',
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list' }),
});
if (result.x402Required) {
  const paid = await result.x402Payment.pay();
  console.log(paid);
} else {
  console.log(result);
}
```

</TabItem>
</Tabs>

Notes:

- MCP URL input is strict direct endpoint semantics.
- For loaded agents, `agent.mcp` is an equivalent runtime MCP handle.
- For full usage docs, see [Usage: MCP](/2-usage/2-12-mcp/).

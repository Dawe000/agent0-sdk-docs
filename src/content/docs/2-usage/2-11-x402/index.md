---
title: "x402"
description: "HTTP 402 Payment Required and paying for resources"
---
When a server returns **HTTP 402 Payment Required**, the response describes how to pay (token, amount, network, destination). The SDK can build an EVM payment (EIP-3009–style), retry the request with the payment header, and return the 2xx result. Use this for any HTTP call (`sdk.request`) and also when an A2A agent returns 402.

## Request and pay on 402

Call `sdk.request()` with a URL and method. If the server returns 402, the result has `x402Required` and an `x402Payment` object; call `pay()` to pay and receive the success body. The SDK must have a connected signer and RPC to build and send payments; the signer can be a private key, wallet provider, or other supported signer.

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

result = sdk.request({"url": "https://example.com/paid-api", "method": "GET"})
if result.x402Required:
    paid = result.x402Payment.pay()  # or pay(0) for first accept
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

const result = await sdk.request({ url: 'https://example.com/paid-api', method: 'GET' });
if (result.x402Required) {
  const paid = await result.x402Payment.pay(0);  // 0 = first accept
  console.log(paid);
} else {
  console.log(result);
}
```

</TabItem>
</Tabs>

## A2A and MCP

The same x402 flow applies to both protocol runtimes:

- **A2A:** handle `x402Required` from `messageA2A`, `listTasks`, `loadTask`, then call `x402Payment.pay()`.
- **MCP:** if an MCP endpoint is payment-gated, use the same pay-and-retry flow in your MCP runtime request pipeline.

See:

- [A2A usage](/2-usage/2-10-a2a/#when-the-agent-returns-402)
- [MCP usage](/2-usage/2-12-mcp/#when-mcp-returns-402)

## Result type

- **Success:** The return value is the parsed response body (e.g. JSON). No `x402Required` property.
- **402:** The return value is an **X402RequiredResponse** (generic over the success type) with `x402Required: true` and `x402Payment` (accepts, `pay()`, optional `payFirst()`).

Check **result.x402Required** to detect 402 before calling `x402Payment.pay()`.

## Payment

- **pay(accept?)** — Pay and retry the request. With no argument (or `pay(0)`), uses the first payment option. Pass an index or an **X402Accept** to choose another option. Resolves to the same shape as a successful request.
- **payFirst()** — Pays using the first accept for which the signer has sufficient token balance. Only present when the SDK has balance checking enabled (the default SDK provides it when initialized with a signer and RPC). If you use a custom x402 request pipeline without a balance checker, `payFirst` is omitted—use `pay(index)` or `pay(accept)` to choose an option explicitly.

Types: **X402Accept** (price, token, network, destination, etc.), **X402Payment**, **ResourceInfo** (when present on the 402 response). See the SDK reference for full definitions.

## Request options

**X402RequestOptions** (or the equivalent in Python) supports:

- **url**, **method**, **headers**, **body** — Standard HTTP fields.
- **parseResponse** — Optional custom parser for 2xx response body (default: parse as JSON).
- **payment** — Optional payment to send with the first request (e.g. pre-built PAYMENT-SIGNATURE). If the server returns 2xx, one round trip; if 402, the normal x402 flow applies.

## Chains and RPC

EVM payment uses the SDK’s chain client. For other chains or custom RPC endpoints, configure **overrideRpcUrls** (TypeScript) or **overrideRpcUrls** (Python) when creating the SDK so the correct RPC is used for the payment network (e.g. Base, Base Sepolia).

## Parsing 402 responses (advanced)

For custom clients or debugging, the SDK exposes parsers for 402 payloads: **parse402FromHeader**, **parse402FromBody**, **parse402FromWWWAuthenticate**, **parse402SettlementFromHeader** (TypeScript names; Python uses snake_case). Use these when you need to interpret 402 headers or body without using `sdk.request()`. See the SDK API reference for signatures and return types.

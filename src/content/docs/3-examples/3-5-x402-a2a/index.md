---
title: "x402 and A2A"
description: "Call payment-required APIs and A2A agents, with optional payment"
---
This example shows three flows: (1) **pure x402** — GET a paid API and pay; (2) **pure A2A** — message an agent, use tasks, list and load tasks; (3) **A2A + x402** — message an agent that returns 402, pay, then get the response. Same pattern in Python and TypeScript.

**Environment:** Set `PRIVATE_KEY` (or `AGENT_PRIVATE_KEY`) and `RPC_URL`. Optional: `CHAIN_ID` (default 84532), `BASE_MAINNET_RPC_URL`, agent IDs, `X402_DEMO_URL` for flow 1.

## Flow 1 — Pure x402

Call a payment-required HTTP API. On 402, pay with the first accept and use the response.

<Tabs>
<TabItem label="Python">

```python
from agent0_sdk import SDK, is_x402_required
import os

sdk = SDK(chainId=84532, rpcUrl=os.getenv("RPC_URL"), signer=os.getenv("PRIVATE_KEY"))
url = os.getenv("X402_DEMO_URL", "https://twitter.x402.agentbox.fyi/search?q=from:elonmusk+AI&type=Latest&limit=5")

result = sdk.request({"url": url, "method": "GET"})
if is_x402_required(result):
    paid = result.x402Payment.pay()
    print(paid)
else:
    print(result)
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK, isX402Required } from 'agent0-sdk';

const sdk = new SDK({
  chainId: 84532,
  rpcUrl: process.env.RPC_URL ?? '',
  privateKey: process.env.PRIVATE_KEY,
});
const url = process.env.X402_DEMO_URL ?? 'https://twitter.x402.agentbox.fyi/search?q=from:elonmusk+AI&type=Latest&limit=5';

const result = await sdk.request({ url, method: 'GET' });
if (isX402Required(result)) {
  const paid = await result.x402Payment.pay(0);
  console.log(paid);
} else {
  console.log(result);
}
```

</TabItem>
</Tabs>

## Flow 2 — Pure A2A

Load an agent, create an A2A client, send a message. If the response includes a task, query it, send a follow-up, and cancel. Then list tasks and load the first one.

<Tabs>
<TabItem label="Python">

```python
from agent0_sdk import SDK
import os

sdk = SDK(chainId=84532, rpcUrl=os.getenv("RPC_URL"), signer=os.getenv("PRIVATE_KEY"))
agent = sdk.loadAgent(os.getenv("AGENT_ID_PURE_A2A", "84532:1298"))
client = sdk.createA2AClient(agent)

out = client.messageA2A("Hello, this is a demo message.")
if not getattr(out, "x402Required", False):
    if hasattr(out, "task") and out.task:
        out.task.query()
        out.task.message("Follow-up message.")
        out.task.cancel()
    tasks = client.listTasks()
    if isinstance(tasks, list) and tasks:
        loaded = client.loadTask(tasks[0].taskId)
        loaded.query()
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
const agent = await sdk.loadAgent(process.env.AGENT_ID_PURE_A2A ?? '84532:1298');
const client = sdk.createA2AClient(agent);

const msg = await client.messageA2A('Hello, this is a demo message.');
if (!msg.x402Required) {
  if ('task' in msg) {
    await msg.task.query();
    await msg.task.message('Follow-up message.');
    await msg.task.cancel();
  }
  const tasks = await client.listTasks();
  if (Array.isArray(tasks) && tasks.length > 0) {
    const loaded = await client.loadTask(tasks[0].taskId);
    await loaded.query();
  }
}
```

</TabItem>
</Tabs>

## Flow 3 — A2A + x402

Message an agent that returns 402. Pay, then use the returned message or task response.

<Tabs>
<TabItem label="Python">

```python
from agent0_sdk import SDK
import os

sdk = SDK(chainId=84532, rpcUrl=os.getenv("RPC_URL"), signer=os.getenv("PRIVATE_KEY"))
agent = sdk.loadAgent(os.getenv("AGENT_ID_A2A_X402", "84532:1301"))
client = sdk.createA2AClient(agent)

result = client.messageA2A("Hello, please charge me once.")
if getattr(result, "x402Required", False):
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
const agent = await sdk.loadAgent(process.env.AGENT_ID_A2A_X402 ?? '84532:1301');
const client = sdk.createA2AClient(agent);

const result = await client.messageA2A('Hello, please charge me once.');
if (result.x402Required) {
  const paid = await result.x402Payment.pay();
  console.log(paid);
} else {
  console.log(result);
}
```

</TabItem>
</Tabs>

For more options and details, see the [x402](/2-usage/2-11-x402/) and [A2A](/2-usage/2-10-a2a/) usage guides. Full runnable demos: **agent0-ts** `examples/x402-a2a-demo.ts`, **agent0-py** `examples/x402_a2a_demo.py`.

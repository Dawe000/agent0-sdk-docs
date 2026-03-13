---
title: "x402 and A2A"
description: "Call payment-required APIs and A2A agents, with optional payment"
---
Examples for calling paid APIs (x402) and A2A agents, with and without payment. The SDK must have a connected signer and RPC when you need to sign or pay (e.g. x402); the signer can be a private key, wallet provider, or other supported signer.

## Call a payment-required API (x402)

GET a URL that returns 402; pay with the first accept and use the response.

<Tabs>
<TabItem label="Python">

```python
from agent0_sdk import SDK, isX402Required
import os

sdk = SDK(chainId=84532, rpcUrl=os.getenv("RPC_URL"), signer=os.getenv("PRIVATE_KEY"))
url = os.getenv("X402_DEMO_URL", "https://twitter.x402.agentbox.fyi/search?q=from:elonmusk+AI&type=Latest&limit=5")

result = sdk.request({"url": url, "method": "GET"})
if isX402Required(result):
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

## Message an A2A agent and use tasks

Load an agent and send a message. If the agent returns a task, query it, send a follow-up, cancel, then list and load tasks.

<Tabs>
<TabItem label="Python">

```python
from agent0_sdk import SDK, isX402Required
import os

sdk = SDK(chainId=84532, rpcUrl=os.getenv("RPC_URL"), signer=os.getenv("PRIVATE_KEY"))
agent = sdk.loadAgent(os.getenv("AGENT_ID_PURE_A2A", "84532:1298"))
out = agent.messageA2A("Hello, this is a demo message.")
if not isX402Required(out):
    if hasattr(out, "task") and out.task:
        out.task.query()
        out.task.message("Follow-up message.")
        out.task.cancel()
    tasks = agent.listTasks()
    if isinstance(tasks, list) and tasks:
        loaded = agent.loadTask(tasks[0].taskId)
        loaded.query()
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
const agent = await sdk.loadAgent(process.env.AGENT_ID_PURE_A2A ?? '84532:1298');
const msg = await agent.messageA2A('Hello, this is a demo message.');
if (!isX402Required(msg)) {
  if ('task' in msg) {
    await msg.task.query();
    await msg.task.message('Follow-up message.');
    await msg.task.cancel();
  }
  const tasks = await agent.listTasks();
  if (Array.isArray(tasks) && tasks.length > 0) {
    const loaded = await agent.loadTask(tasks[0].taskId);
    await loaded.query();
  }
}
```

</TabItem>
</Tabs>

## Message an A2A agent that requires payment

When the agent returns 402, pay then use the returned message or task response.

<Tabs>
<TabItem label="Python">

```python
from agent0_sdk import SDK, isX402Required
import os

sdk = SDK(chainId=84532, rpcUrl=os.getenv("RPC_URL"), signer=os.getenv("PRIVATE_KEY"))
agent = sdk.loadAgent(os.getenv("AGENT_ID_A2A_X402", "84532:1301"))
result = agent.messageA2A("Hello, please charge me once.")
if isX402Required(result):
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
const agent = await sdk.loadAgent(process.env.AGENT_ID_A2A_X402 ?? '84532:1301');
const result = await agent.messageA2A('Hello, please charge me once.');
if (isX402Required(result)) {
  const paid = await result.x402Payment.pay();
  console.log(paid);
} else {
  console.log(result);
}
```

</TabItem>
</Tabs>

See the [x402](/2-usage/2-11-x402/) and [A2A](/2-usage/2-10-a2a/) usage guides for more.

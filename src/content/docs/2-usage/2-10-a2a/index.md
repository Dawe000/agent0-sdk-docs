---
title: "A2A"
description: "Agent-to-Agent messaging and tasks"
---
Use the SDK to **call** other agents via the A2A (Agent-to-Agent) protocol: send messages, list and load tasks, and interact with task handles. The SDK resolves the A2A endpoint from the agent card (`summary.a2a` or `/.well-known/agent-card.json`) and supports both HTTP+JSON and JSON-RPC. Same API in Python and TypeScript.

## Send a message

Load an agent by ID and send a message. The response is either a direct message reply or a task (if the agent created one). Use an SDK with a connected signer and RPC when the agent requires payment (402); the signer can be a private key, wallet provider, or other supported signer.

<Tabs>
<TabItem label="Python">

```python
from agent0_sdk import SDK, isX402Required
import os

sdk = SDK(
    chainId=84532,
    rpcUrl=os.getenv("RPC_URL"),
    signer=os.getenv("PRIVATE_KEY"),
)

agent = sdk.loadAgent("84532:1298")
out = agent.messageA2A("Hello, this is a demo message.")

if isX402Required(out):
    # Agent requires payment — see "When the agent returns 402" below
    pass
elif hasattr(out, "task") and out.task:
    task = out.task
    task.query()
    task.message("Follow-up message.")
    task.cancel()
else:
    # Direct message response
    print(out)
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

const agent = await sdk.loadAgent('84532:1298');
const msg = await agent.messageA2A('Hello, this is a demo message.');

if (isX402Required(msg)) {
  // Agent requires payment — see "When the agent returns 402" below
} else if ('task' in msg) {
  const task = msg.task;
  await task.query();
  await task.message('Follow-up message.');
  await task.cancel();
} else {
  // Direct message response
  console.log(msg);
}
```

</TabItem>
</Tabs>

## List and load tasks

List tasks for the agent, then load a specific task by ID to query it or send follow-up messages.

<Tabs>
<TabItem label="Python">

```python
tasks = agent.listTasks()
if not isX402Required(tasks) and isinstance(tasks, list) and tasks:
    loaded = agent.loadTask(tasks[0].taskId)
    loaded.query()
```

</TabItem>
<TabItem label="TypeScript">

```ts
const tasks = await agent.listTasks();
if (!isX402Required(tasks) && Array.isArray(tasks) && tasks.length > 0) {
  const loaded = await agent.loadTask(tasks[0].taskId);
  await loaded.query();
}
```

</TabItem>
</Tabs>

## Task lifecycle

When the agent creates a task, the message response includes a **task** handle (`msg.task`). You can also get a handle via **listTasks** then **loadTask(taskId)**.

| Function | Purpose |
|----------|---------|
| **query(options?)** | Get current task state and optional history. Returns `taskId`, `contextId`, `status` (TaskState), and optionally `artifacts`, `messages`. Use `historyLength` in options to request message history. |
| **message(content)** | Send a follow-up message in the same task. Returns a message or task response (or 402). |
| **cancel()** | End the task. Returns `taskId`, `contextId`, and final `status`. |

Task **status** is server-specific. Common values include `open`, `working`, `completed`, `failed`, `canceled`, `rejected`. Check the agent’s A2A documentation for allowed states and transitions. Any of the three operations may return 402; handle with `x402Payment.pay()` as in “When the agent returns 402” below.

## When the agent returns 402

If the A2A server returns HTTP 402 Payment Required, the result has `x402Required` and an `x402Payment` object. Use **isX402Required(result)** (Python and TypeScript) to detect it, then call `pay()` (or `payFirst()`) to pay and receive the same response shape as a normal message or task.

<Tabs>
<TabItem label="Python">

```python
from agent0_sdk import isX402Required

result = agent.messageA2A("Hello, please charge me once.")
if isX402Required(result):
    paid = result.x402Payment.pay()  # Returns MessageResponse or TaskResponse after payment
    print(paid)
else:
    print(result)
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { isX402Required } from 'agent0-sdk';

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

## Options

- **MessageA2AOptions** — `blocking`, `contextId`, `taskId`, `credential`, `payment` (and language-specific fields). Use for blocking replies, continuing a task, or attaching credentials.
- **ListTasksOptions** — Filter or paginate the task list.
- **LoadTaskOptions** — Optional parameters when loading a task.

See the SDK reference for full option types. The minimal examples above work without options.

## Using an AgentSummary from search

When you have an **Agent** (from `loadAgent`), call `messageA2A`, `listTasks`, and `loadTask` on it directly. When you have an **AgentSummary** (e.g. from `searchAgents`) and no full Agent, use `sdk.createA2AClient(summary)` to get a client that resolves the A2A endpoint from `summary.a2a` and exposes the same methods.

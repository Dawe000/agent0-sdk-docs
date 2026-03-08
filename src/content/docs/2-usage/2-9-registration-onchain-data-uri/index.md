---
title: "Registration (On-chain data URI)"
description: "Register agents with fully on-chain ERC-8004 registration files (data:application/json;base64,...)"
---
Register your agent on-chain with a **fully on-chain ERC-8004 registration file** by storing the entire JSON directly in `agentURI` (ERC-721 `tokenURI`) as a base64 `data:` URI.

ERC-8004 explicitly allows this form (example: `data:application/json;base64,eyJ0eXBlIjoi...`) for fully on-chain metadata.

## Overview

This flow:

- Mints/updates the agent in the Identity Registry
- Writes `agentURI`/`tokenURI` as `data:application/json;base64,...`
- Allows `loadAgent()` to hydrate registration data **without IPFS or HTTP**

## When to use this

Use on-chain data URI registration when:

- You want **zero external dependencies** (no IPFS gateways, no web hosting)
- You want the registration file to be **self-contained and immutable per tx**

Prefer IPFS/HTTP registration when:

- You want to keep gas costs low
- Your registration file is large (many endpoints/metadata)

## Important notes (gas + size)

- **Gas cost**: writing large strings on-chain can be expensive. Keep the registration JSON compact.
- **Decoder size limit**: both SDKs enforce a max decoded JSON size for `data:` URIs by default (**256 KiB**).
  - TypeScript: `registrationDataUriMaxBytes` in `SDKConfig`
  - Python: `registrationDataUriMaxBytes` in `SDK(...)`

## Register agent on-chain (data URI)

<Tabs>
<TabItem label="Python">

```python
from agent0_sdk import SDK

sdk = SDK(
    chainId=11155111,
    rpcUrl="https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
    signer=private_key,
    # Optional override (bytes):
    # registrationDataUriMaxBytes=512 * 1024,
)

agent = sdk.createAgent(
    name="My On-chain Agent",
    description="Fully on-chain ERC-8004 registration",
)
agent.setMCP("https://mcp.example.com/")
agent.setTrust(reputation=True)
agent.setActive(True)

tx = agent.registerOnChain()
reg = tx.wait_confirmed(timeout=180).result
print(reg.agentId)
print(reg.agentURI)  # data:application/json;base64,...
```

</TabItem>
<TabItem label="TypeScript">

```ts
import { SDK } from 'agent0-sdk';

const sdk = new SDK({
  chainId: 11155111,
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
  privateKey,
  // Optional override (bytes):
  // registrationDataUriMaxBytes: 512 * 1024,
});

const agent = sdk.createAgent(
  'My On-chain Agent',
  'Fully on-chain ERC-8004 registration'
);
await agent.setMCP('https://mcp.example.com/');
agent.setTrust(true, false, false);
agent.setActive(true);

const tx = await agent.registerOnChain();
const { result: reg } = await tx.waitConfirmed();
console.log(reg.agentId);
console.log(reg.agentURI); // data:application/json;base64,...
```

</TabItem>
</Tabs>

## Read back with `loadAgent()`

<Tabs>
<TabItem label="Python">

```python
agent2 = sdk.loadAgent(reg.agentId)
print(agent2.name, agent2.description)
```

</TabItem>
<TabItem label="TypeScript">

```ts
const agent2 = await sdk.loadAgent(reg.agentId!);
console.log(agent2.name, agent2.description);
```

</TabItem>
</Tabs>

## Backwards compatibility

This feature is additive:

- `registerIPFS()` and HTTP registration (`registerHTTP(...)` / `register(...)`) continue to work unchanged.

## Next steps

- Prefer lower gas? Use [Registration (IPFS)](/2-usage/2-3-registration-ipfs/)
- Hosting your own JSON? Use [Registration (HTTP)](/2-usage/2-4-registration-http/)


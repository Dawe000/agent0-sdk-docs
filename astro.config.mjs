import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  site: "https://sdk.ag0.xyz",
  output: "static",
  // IMPORTANT:
  // Do NOT build directly into ../old_build by default, because that folder is also our "downloaded snapshot"
  // from S3. Use `npm run build:old-build` when you explicitly want to overwrite it.
  outDir: "./dist",
  integrations: [
    starlight({
      title: "Agent0 SDK",
      description:
        "Python and TypeScript SDKs for agent portability, discovery and trust based on ERC-8004",
      favicon: "/favicon.svg",
      customCss: ["./src/styles/custom.css"],
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/agent0lab/agent0-py" }],
      head: [
        // Social images
        {
          tag: "meta",
          attrs: { property: "og:image", content: "https://sdk.ag0.xyz/og-image.png" }
        },
        { tag: "meta", attrs: { property: "og:image:type", content: "image/png" } },
        { tag: "meta", attrs: { property: "og:image:width", content: "1200" } },
        { tag: "meta", attrs: { property: "og:image:height", content: "1200" } },
        { tag: "meta", attrs: { name: "twitter:image", content: "https://sdk.ag0.xyz/og-image.png" } },
        // Force og:title to always be "Agent0 SDK" (matches the old build behavior).
        { tag: "meta", attrs: { property: "og:title", content: "Agent0 SDK" } },
        // Enable tabs rendering for our Markdown <Tabs>/<TabItem> blocks (without MDX).
        { tag: "script", attrs: { src: "/ag0-tabs.js", type: "module" } }
      ],
      sidebar: [
        {
          label: "Welcome",
          items: [
            { label: "Intro", link: "/" },
            { label: "Key Concepts", link: "/1-welcome/1-2-key-concepts/" },
            { label: "Architecture", link: "/1-welcome/1-3-architecture/" },
            { label: "ERC-8004", link: "/1-welcome/1-4-erc-8004/" },
            { label: "Supported Networks", link: "/1-welcome/1-5-supported-networks/" }
          ]
        },
        {
          label: "Usage",
          items: [
            { label: "Install", link: "/2-usage/2-1-install/" },
            { label: "Configure Agents", link: "/2-usage/2-2-configure-agents/" },
            { label: "Registration (IPFS)", link: "/2-usage/2-3-registration-ipfs/" },
            { label: "Registration (HTTP)", link: "/2-usage/2-4-registration-http/" },
            { label: "Registration (On-chain data URI)", link: "/2-usage/2-9-registration-onchain-data-uri/" },
            { label: "Search", link: "/2-usage/2-5-search/" },
            { label: "x402", link: "/2-usage/2-11-x402/" },
            { label: "A2A", link: "/2-usage/2-10-a2a/" },
            { label: "Feedback", link: "/2-usage/2-6-use-feedback/" },
            { label: "Transfer", link: "/2-usage/2-7-transfer-agents/" },
            { label: "Client-side usage", link: "/2-usage/2-8-browser-wallets/" }
          ]
        },
        {
          label: "Examples",
          items: [
            { label: "Quick Start", link: "/3-examples/3-1-quick-start/" },
            { label: "Agent Update", link: "/3-examples/3-2-agent-update/" },
            { label: "Feedback Usage", link: "/3-examples/3-3-feedback-usage/" },
            { label: "Search Agents", link: "/3-examples/3-4-search-agents/" },
            { label: "x402 and A2A", link: "/3-examples/3-5-x402-a2a/" }
          ]
        },
        {
          label: "Subgraph",
          items: [
            { label: "Intro", link: "/4-subgraph/4-1-intro/" },
            { label: "Data Structures", link: "/4-subgraph/4-2-data-structures/" },
            { label: "Example Queries", link: "/4-subgraph/4-3-example-queries/" }
          ]
        },
        {
          label: "Reference",
          items: [
            { label: "SDK API", link: "/5-reference/5-1-sdk/" },
            { label: "Agent API", link: "/5-reference/5-2-agent/" },
            { label: "Models and Types", link: "/5-reference/5-3-models/" }
          ]
        }
      ]
    })
  ]
});


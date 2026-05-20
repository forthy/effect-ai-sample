# Architecture Design

## Overview

This is a minimal Bun/Effect-TS project demonstrating two ways to use AI tools:

1. **MCP Server** - HTTP endpoint exposing tools via the Model Context Protocol
2. **Direct LLM Tool-calling** - Calling tools directly from a language model

Both paths share the same `GreetingToolkit`, demonstrating code reuse across deployment models.

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Runtime Entry Points                     │
├─────────────────────────────┬───────────────────────────────────┤
│   src/index.ts              │   src/ai-tools.ts                 │
│   (MCP Server)              │   (Direct LLM)                    │
├──────────────┬──────────────┼───────────────┬───────────────────┤
│ McpServer    │ LanguageModel│ OpenAiClient  │ GreetingToolkit   │
│ .toolkit()   │ .streamText()│ .layerConfig()│ .toLayer()        │
└──────┬───────┴──────┬───────┴───────┬───────┴────────┬──────────┘
       │              │               │                │
       ▼              ▼               ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     src/tools.ts (Shared)                        │
├─────────────────────────────────────────────────────────────────┤
│  GreetingTool (contract)  →  GreetingToolkit (interface)        │
│  GreetingToolkitLive (implementation)                           │
└─────────────────────────────────────────────────────────────────┘
```

## Layer Composition

### MCP Server Path (src/index.ts)

```
Layer.mergeAll(
  McpServer.toolkit(GreetingToolkit) + GreetingToolkitLive,
  HttpRouter.Default.serve(),
).pipe(
  Layer.provide(McpServer.layerHttp({ path: "/mcp" })),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
)
```

### Direct LLM Path (src/ai-tools.ts)

```
LanguageModel.streamText({ toolkit: GreetingToolkit }).pipe(
  Effect.provide(Layer.merge(OpenAiLanguageModelLive, GreetingToolkitLive)),
)
```

## Data Flow

### MCP Request Flow

1. HTTP client sends request to `http://localhost:3000/mcp`
2. `McpServer.layerHttp` receives and parses the request
3. Tool call dispatched to `GreetingToolkitLive.Greeting` handler
4. Result returned via HTTP response

### Direct LLM Flow

1. `LanguageModel.streamText` sends prompt to OpenAI
2. Model decides to call `Greeting` tool
3. `GreetingToolkitLive.Greeting` handler executes
4. Tool result returned to model for response generation

## Dependencies

| Package                 | Purpose                                                   |
| ----------------------- | --------------------------------------------------------- |
| `effect`                | Core framework (layers, effects, schemas)                 |
| `@effect/ai`            | AI abstractions (Tool, Toolkit, LanguageModel, McpServer) |
| `@effect/ai-openai`     | OpenAI provider integration                               |
| `@effect/platform`      | Platform-agnostic HTTP client                             |
| `@effect/platform-node` | Node.js HTTP server                                       |
| `dotenv`                | Environment variable loading                              |

## Key Design Decisions

1. **Shared Toolkit** - `GreetingToolkit` is defined once in `src/tools.ts` and used by both entry points, ensuring consistent tool contracts.

2. **Layer-based DI** - All dependencies (HTTP client, LLM, tool implementations) are provided via Effect layers, enabling testability and composition.

3. **Pure Tool Handler** - `GreetingToolkitLive` is deterministic and side-effect free, requiring no additional services.

4. **Schema-based Contracts** - Tool parameters and success types use Effect `Schema` for compile-time validation.

## File Structure

```
src/
├── index.ts      # MCP HTTP server (port 3000, path /mcp)
├── tools.ts      # Tool definition, toolkit, and live implementation
└── ai-tools.ts   # Direct OpenAI tool-calling example
```

## Configuration

| Config         | Location             | Notes                      |
| -------------- | -------------------- | -------------------------- |
| MCP path       | `src/index.ts:28`    | Hard-coded as `/mcp`       |
| HTTP port      | `src/index.ts:31`    | Hard-coded as `3000`       |
| Model name     | `src/ai-tools.ts:19` | Hard-coded as `gpt-5.5`    |
| OpenAI API key | `.env`               | Loaded via `dotenv/config` |

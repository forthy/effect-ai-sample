# effect-ai-sample

Minimal Bun sample that exposes an MCP server with `@effect/ai` and Effect layers, plus a direct language-model tool-calling example using the same toolkit.

The server registers a single `Greeting` tool and serves MCP over HTTP at `http://localhost:3000/mcp`.

## Prerequisites

- Bun 1.3.14 or newer

## Setup

Install dependencies:

```bash
bun install
```

## Run

Start the HTTP MCP server:

```bash
bun run dev
```

The MCP endpoint is available at:

```text
http://localhost:3000/mcp
```

Run the direct `@effect/ai` tool-calling sample:

```bash
OPENAI_API_KEY=sk-... bun run ai-tools
```

The `ai-tools` script uses OpenAI with the shared `GreetingToolkit`, so it requires `OPENAI_API_KEY` and may incur API usage costs.

## MCP Tool

The server exposes one tool from `src/tools.ts`:

```text
Greeting
```

Input:

```json
{
  "name": "Ada Lovelace"
}
```

Result:

```text
Hello, Ada Lovelace!
```

The tool contract is defined with `Tool.make` and `Schema.String`, then reused in both runtime paths:

- `src/index.ts` registers the toolkit with the MCP server through `McpServer.toolkit`.
- `src/ai-tools.ts` passes the same toolkit to `LanguageModel.streamText` for model-driven tool calling.

## Architecture

- `src/tools.ts` defines `GreetingTool`, `GreetingToolkit`, and `GreetingToolkitLive`.
- `src/index.ts` registers the toolkit with `McpServer.toolkit` for HTTP MCP clients.
- `src/ai-tools.ts` uses the toolkit directly with an OpenAI language model.
- `McpServer.layerHttp` serves the MCP endpoint at `/mcp`.
- `NodeHttpServer.layer(createServer, { port: 3000 })` starts the HTTP server.

The MCP server does not require an OpenAI API key and does not make model provider requests. The `ai-tools` script does.

## Scripts

```bash
bun run dev       # Start the HTTP MCP server
bun run ai-tools  # Run direct OpenAI tool-calling sample
bun run fmt       # Format code with oxfmt
bun run fmt:check # Check formatting with oxfmt
bun run lint      # Check code with oxlint
bun run lint:fix  # Apply oxlint fixes
bun run check     # Type-check with tsgo
```

## Notes

- This project is intended as a minimal sample rather than a production application.
- The HTTP port and MCP path are hard-coded in `src/index.ts`.

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

import { createServer } from "node:http"

import { McpServer } from "@effect/ai"
import { HttpRouter } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Layer } from "effect"

import { GreetingToolkit, GreetingToolkitLive } from "./tools"

/**
 * Registers the greeting toolkit with the MCP server.
 */
const GreetingMcpToolsLive = McpServer.toolkit(GreetingToolkit).pipe(
  Layer.provide(GreetingToolkitLive),
)

/**
 * Runs the MCP server over HTTP at /mcp.
 */
const ServerLive = Layer.mergeAll(
  GreetingMcpToolsLive,
  HttpRouter.Default.serve(),
).pipe(
  Layer.provide(
    McpServer.layerHttp({
      name: "Greeting MCP Server",
      version: "1.0.0",
      path: "/mcp",
    }),
  ),
  Layer.provide(NodeHttpServer.layer(createServer, { port: 3000 })),
)

Layer.launch(ServerLive).pipe(NodeRuntime.runMain)

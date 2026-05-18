import { Tool, Toolkit } from "@effect/ai"
import { Effect, Schema } from "effect"

/**
 * Tool definition used by MCP clients and language-model tool calling.
 *
 * The schema describes both sides of the tool contract: callers must provide a
 * string `name`, and the handler returns the rendered greeting as a string.
 */
export const GreetingTool = Tool.make("Greeting", {
  description: "Greeting to a person by name",
  parameters: {
    name: Schema.String,
  },
  success: Schema.String,
})

/**
 * Toolkit shared by the MCP server and direct language-model calls.
 *
 * `Toolkit.make` preserves the tool names and handler types, so
 * `GreetingToolkitLive` must provide an implementation for the `Greeting` tool.
 */
export const GreetingToolkit = Toolkit.make(GreetingTool)

/**
 * Live implementation for {@link GreetingToolkit}.
 *
 * The handler is intentionally pure and deterministic for the sample: it
 * formats the provided name into a greeting without requiring any additional
 * services.
 */
export const GreetingToolkitLive = GreetingToolkit.toLayer({
  Greeting: ({ name }) => Effect.succeed(`Hello, ${name}!`),
})

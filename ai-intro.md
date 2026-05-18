# Effect AI Custom Tools

Effect AI supports custom tools through two main modules:

- `Tool`: describes what the model is allowed to call.
- `Toolkit`: groups tools and connects them to real Effect handlers.

A custom tool is not just a function. It is a typed contract with schemas for
inputs, success output, and failure output.

```ts
import { LanguageModel, Tool, Toolkit } from "@effect/ai"
import { Effect, Schema } from "effect"

const GetWeather = Tool.make("GetWeather", {
  description: "Get the current weather for a city",
  parameters: {
    city: Schema.String,
  },
  success: Schema.Struct({
    city: Schema.String,
    temperature: Schema.Number,
    condition: Schema.String,
  }),
})
```

Put tools into a toolkit and provide handlers:

```ts
const WeatherToolkit = Toolkit.make(GetWeather)

const WeatherToolkitLive = WeatherToolkit.toLayer({
  GetWeather: ({ city }) =>
    Effect.succeed({
      city,
      temperature: 72,
      condition: "sunny",
    }),
})
```

Then pass the toolkit to a model call:

```ts
const program = LanguageModel.generateText({
  prompt: "What is the weather in San Francisco?",
  toolkit: WeatherToolkit,
  toolChoice: "auto",
}).pipe(Effect.provide(WeatherToolkitLive))
```

The flow is:

1. Define the tool schema with `Tool.make`.
2. Effect AI sends the tool definition to the model.
3. The model decides whether to call the tool.
4. Effect AI validates the model-provided arguments using the schema.
5. Effect AI runs your handler as an `Effect`.
6. The tool result is sent back into the model conversation.
7. The model produces the final answer.

Tool handlers are ordinary Effect programs, so they can use services, config,
retries, logging, typed errors, tracing, and layers.

## Tool Failures

Tools can define a failure schema:

```ts
const LookupUser = Tool.make("LookupUser", {
  description: "Look up a user by id",
  parameters: {
    userId: Schema.String,
  },
  success: Schema.Struct({
    name: Schema.String,
    email: Schema.String,
  }),
  failure: Schema.Struct({
    reason: Schema.String,
  }),
})
```

By default, tool handler failures go into the Effect error channel. If you want
failures to become tool results sent back to the model, use
`failureMode: "return"`:

```ts
const LookupUser = Tool.make("LookupUser", {
  parameters: {
    userId: Schema.String,
  },
  success: Schema.Struct({
    name: Schema.String,
  }),
  failure: Schema.Struct({
    reason: Schema.String,
  }),
  failureMode: "return",
})
```

## Language Model Options

Useful options on `LanguageModel.generateText` and `LanguageModel.streamText`:

- `toolkit`: the tools plus handlers available to the model.
- `toolChoice: "auto"`: model may call tools.
- `toolChoice: "required"`: model must call a tool.
- `toolChoice: "none"`: model cannot call tools.
- `toolChoice: { tool: "ToolName" }`: force one specific tool.
- `concurrency`: controls concurrent tool call resolution.
- `disableToolCallResolution: true`: sends tool definitions to the model but
  lets you manually resolve tool calls.

For this project, the existing `streamText` call in `src/index.ts` can become
tool-enabled by importing `Tool`, `Toolkit`, and `Schema`, defining a toolkit,
adding `toolkit` to the `LanguageModel.streamText({ ... })` options, and
providing the toolkit layer alongside `OpenAiLanguageModelLive`.

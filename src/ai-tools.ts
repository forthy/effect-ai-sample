import { LanguageModel } from "@effect/ai"
import { OpenAiClient, OpenAiLanguageModel } from "@effect/ai-openai"
import { FetchHttpClient } from "@effect/platform"
import { Config, Console, Effect, Layer, Match, Stream } from "effect"
import "dotenv/config"

import { GreetingToolkit, GreetingToolkitLive } from "./tools"

/**
 * OpenAI client dependency for the direct language-model tool-calling sample.
 */
const OpenAiClientLive = OpenAiClient.layerConfig({
  apiKey: Config.redacted("OPENAI_API_KEY"),
}).pipe(Layer.provide(FetchHttpClient.layer))

/**
 * Language model dependency used by the tool-calling sample.
 */
const OpenAiLanguageModelLive = OpenAiLanguageModel.model("gpt-5.5").pipe(
  Layer.provide(OpenAiClientLive),
)

/** Combines the language model with the shared greeting toolkit handler. */
const MainLive = Layer.merge(OpenAiLanguageModelLive, GreetingToolkitLive)

/**
 * Uses the shared toolkit directly with `@effect/ai` language-model tool calls.
 */
const program = LanguageModel.streamText({
  prompt: "Use the Greeting tool to greet Ada Lovelace.",
  toolkit: GreetingToolkit,
  toolChoice: { mode: "auto", oneOf: ["Greeting"] },
}).pipe(
  Stream.runForEach((part) =>
    Match.value(part).pipe(
      Match.discriminator("type")("text-delta", (p) => Console.log(p.delta)),
      Match.discriminator("type")("tool-result", (p) =>
        Console.log(p.encodedResult),
      ),
      Match.orElse(() => Effect.void),
    ),
  ),
  Effect.catchAllCause((cause) =>
    Console.error(`An error occurred: ${cause.toString()}`),
  ),
)

Effect.runPromise(program.pipe(Effect.provide(MainLive)))

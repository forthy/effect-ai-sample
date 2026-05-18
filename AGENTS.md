# Agent Notes

## Commands

- Use Bun; `bun.lock` is the lockfile and `bun install` runs the `prepare` script that patches `@effect/language-service` and `@effect/tsgo`.
- Run checks with `bun run fmt:check`, `bun run lint`, and `bun run check` (`tsgo --noEmit`). There is no test script in this repo currently.
- `bun run dev` executes `src/index.ts`, loads `.env` through `dotenv/config`, and makes a real OpenAI request. It requires `OPENAI_API_KEY` and may incur API usage costs.

## Architecture

- This is a minimal Effect AI sample, not a multi-package app. Keep changes focused on the small sample shape.
- `src/index.ts` wires the live layers: `OpenAiClient.layerConfig`, `FetchHttpClient.layer`, `OpenAiLanguageModel.model("gpt-5.5")`, and `GreetingToolkitLive`.
- `src/tools.ts` owns the tool contract and implementation: `GreetingTool`, `GreetingToolkit`, and `GreetingToolkitLive`.
- The model name and prompt are hard-coded in `src/index.ts`; changing runtime behavior usually means editing that file.

## Conventions

- Use Effect patterns already present here: define dependencies as layers, keep API keys in `Config.redacted("OPENAI_API_KEY")`, and provide layers at the top-level `Effect.runPromise` boundary.
- Formatter/linter are `oxfmt` and `oxlint`; config ignores generated/vendor-like paths, so do not rely on them to check ignored artifacts.
- `.env` files are gitignored. Do not read or commit local API keys.

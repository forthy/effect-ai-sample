# Potential Improvements

## High Priority

1. Add at least one no-network test path.
   - There are no project test files outside `node_modules`.
   - The core sample calls an external model, so tests should avoid real OpenAI calls by validating configuration, layer wiring, or extracting the stream handler into a pure/testable unit.

2. Improve runtime error reporting.
   - `src/index.ts` currently catches all causes and logs `cause.toString()`.
   - Consider distinguishing expected configuration/API failures from defects and preserving structured cause details for easier debugging.

3. Add a runnable custom-tool example.
   - `ai-intro.md` explains `Tool` and `Toolkit`, but the sample app still only streams plain text.
   - A small opt-in example, such as a local time or weather stub tool, would make the documentation easier to validate and extend.

## Medium Priority

4. Add an `.env.example` file.
   - `.env` is ignored, but there is no checked-in template documenting required variables.
   - A minimal `.env.example` with `OPENAI_API_KEY=` and optional model/prompt settings would improve onboarding.

5. Make the model configurable.
   - The model is hard-coded in `src/index.ts`.
   - Reading a `OPENAI_MODEL` config value with a default would make the sample easier to experiment with and would reduce README/code drift.

6. Make the prompt configurable.
   - The prompt is hard-coded in `src/index.ts`.
   - Accepting a CLI argument or environment config would make the sample more useful as a runnable example.

7. Add CI for install, linting, and type checking.
   - There is no `.github` workflow.
   - A small workflow running `bun install --frozen-lockfile`, `bun run lint`, and the type-check script would catch broken dependency, lint, or TypeScript changes early.

8. Link `ai-intro.md` from the README.
   - The custom tools guide is currently a standalone document.
   - Linking it from `README.md` would make the guide discoverable for new readers.

9. Consider moving the main program into smaller named functions once the sample grows.
   - `src/index.ts` is currently small enough to keep inline.
   - If model selection, prompt input, or output handling expands, extracting config loading and stream rendering will keep the entrypoint readable.

## Low Priority

10. Tighten TypeScript defaults if this becomes more than a demo.
    - `tsconfig.json` leaves `noUnusedLocals` and `noUnusedParameters` disabled.
    - Enabling them later can reduce dead code, but it may be noisy during experimentation.

11. Add package metadata if the repository is shared publicly.
    - `package.json` is private, which is appropriate for a sample, but public sharing could benefit from a short description and repository/license fields.

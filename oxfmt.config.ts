import { defineConfig } from "oxfmt"

/**
 * Formatter configuration for project-owned source files.
 *
 * Generated output and agent metadata are excluded so formatting runs only on
 * code maintained in this repository.
 */
export default defineConfig({
  printWidth: 80,
  semi: false,
  sortImports: true,
  ignorePatterns: ["dist/**", "*.min.js", ".agents/*"],
})

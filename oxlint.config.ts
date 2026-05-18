import { defineConfig } from "oxlint"

/**
 * Linter configuration for project-owned source files.
 *
 * Build artifacts, coverage output, vendored code, and snapshots are ignored to
 * keep lint results focused on files maintained by this repository.
 */
export default defineConfig({
  ignorePatterns: ["dist/**", "coverage/**", "vendor/**", "test/snapshots/**"],
})

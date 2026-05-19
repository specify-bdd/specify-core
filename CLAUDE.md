# CLAUDE.md

## Commands

```bash
# Setup (first time)
pnpm dev:install        # install deps + generate types + build all packages

# Build
pnpm build              # build all workspace packages

# Tests
pnpm test               # unit tests + BDD integration tests
pnpm test:unit          # Vitest unit tests only
pnpm test:unit:watch    # unit tests in watch mode
vitest run --reporter=verbose <path>   # single unit test file

# Run specific BDD feature
pnpm specify ./features/test/basic.feature
pnpm specify --tags '@tagname'

# Lint & type-check
pnpm lint               # check formatting and lint errors
pnpm lint:fix           # auto-fix formatting and lint issues
pnpm type-check         # TypeScript type checking (tsc)

# Development
pnpm dev:watch          # watch mode - auto-rebuild on file changes
```

## Architecture

PNPM monorepo with four workspace packages under `modules/@specify-bdd/`:

### Packages

- **`specify`** – Core BDD framework CLI. Entry point: `src/exec.ts` (CLI) and `src/index.ts` (public API). Wraps Cucumber.js with enhanced step pattern parsing, plugin loading, and test lifecycle management.
- **`plugin-cli`** – Optional plugin providing Cucumber step definitions for shell/file system interaction. Used in feature tests that exercise CLI behavior.
- **`quick-ref`** – Utility for storing/retrieving test data by dot-notation address (`"foo.bar"`) with template string interpolation (`${foo.bar}`). Integrated into `SpecifyWorld`.
- **`eslint-plugin`** – Private package with custom alignment ESLint rules used across the codebase.

### Core Classes (in `specify/src/lib/`)

- **`CucumberManager`** – Singleton that wraps Cucumber step/hook registration. Parses optional notation `[...]` in Gherkin patterns, supporting alternates (`[create/update]`) and subject substitution.
- **`SpecifyWorld`** – Custom Cucumber World (per-scenario instance) with an integrated `QuickRef` instance for parameter storage.
- **`TestCommand`** / **`TestCommandWatcher`** – Orchestrate test execution; watcher triggers reruns on file changes.
- **`CucumberAPI`** – Thin interface to Cucumber's programmatic runner.

### Configuration System

Config is modular, loaded from `src/config/` submodules (paths, cucumber, content, plugins, debug, watch) and merged via deepmerge. User overrides come from `./specify.config.json` in the process working directory. The merged config is managed by `src/config/all.ts`.

### Test Structure

- `modules/@specify-bdd/specify/src/lib/tests/` – Vitest unit tests for core classes
- `features/test/` – Gherkin feature files describing how the `specify test` command should behave (self-hosted BDD tests)
- `features/plugin-*/steps/` – Gherkin feature files describing the step definitions provided by each plugin (e.g. `features/plugin-cli/steps/`)
- `test/gherkin/` – Fixture feature files used as test inputs (passing/failing scenarios for testing retry, parallel, rerun, etc.)

### Plugin System

External plugins export a `{ cucumber: {...} }` object. Paths are configured in `specify.config.json` under `plugins`. The framework merges plugin cucumber configs (steps, hooks, world) before execution.

### Data Flow

```
specify test [paths] [options]
  → exec.ts: parse args + load config
  → load plugins (merge cucumber config)
  → TestCommand.execute()
  → CucumberAPI.run()
  → CucumberManager dispatches hooks/steps
  → SpecifyWorld (with QuickRef) created per scenario
```

## Development Workflow

For any ticket involving user-facing behavior changes, follow this BDD process:

1. **Write Gherkin behavior specs first.** Document the intended behavior in the appropriate `features/` subdirectory:
   - `features/test/` — behavior of the `specify test` command
   - `features/plugin-*/steps/` — behavior of plugin-provided step definitions (e.g. `features/plugin-browser/steps/`)

   Focus on the "golden path" use cases. Also capture important corner cases and foreseeable fail states. If working with a human operator, share these scenarios and iterate until they are approved before proceeding to step 2. This step may be skipped if no user-facing behavior is changing.

2. **Write any missing step definitions.** For each step in the Gherkin specs that does not yet have a matching step definition, write one now. Step definitions should be thin — they wire Gherkin language to the application code but contain no logic themselves. The underlying application code does not need to exist yet; stubs or placeholder implementations are fine at this stage.

3. **Write unit tests before the implementation.** Write Vitest unit tests covering the code units that will be added or modified. Tests should be more comprehensive than the Gherkin specs — exercise a variety of inputs and edge cases. For each test, write the simplest assertion the code will fail. **Run the tests and confirm they fail before proceeding.**

4. **Write the application code.** Implement changes that cause the failing unit tests to pass. Rerun and iterate until all tests pass. Then verify that the running code also fulfills the letter and spirit of the Gherkin behavior specs from step 1. If gaps remain, tighten the unit tests and repeat.

5. **Verify before committing.** Run the following commands in order and fix any failures before opening a PR:
   ```bash
   pnpm lint:fix   # auto-fix formatting and lint issues
   pnpm build      # ensure all packages compile cleanly
   pnpm test       # unit tests + BDD integration tests
   ```

## Contributing

**Issue tracker:** https://github.com/specify-bdd/specify-core/issues

ALWAYS perform any actions under the bot account; NEVER use the user's account to take action in the Github repo.

**Commit messages:**
```
[#<github-issue-id>] <explanation of why the change was needed>
```
Focus on *why*, not *what* — the diff covers what changed. Omit the ticket prefix only when there is genuinely no associated issue.

**GitHub CLI authentication:**
The bot token for `gh` expires periodically. If `gh` commands fail with a credentials error, run:
```bash
bash scripts/bot-auth.sh
```
This re-authenticates the `gh` CLI and prints the new token expiry time. Run it at the start of any session that will open or modify PRs.

**Pull requests:**
- Always open a PR; never push directly to `main` or `develop`
- Target `develop` by default. If the ticket has a GitHub milestone, target the corresponding `rel/<milestone-slug>` branch instead (e.g. milestone "Browser Plugin" → `rel/browser-plugin`). If that branch doesn't exist yet, create it based on `origin/main`
- Open PRs as drafts, add inline diff comments to annotate anything a reviewer might need explained, then mark as ready for review
- Assign `specify-bdd/devs` as reviewer
- PR description should include `Resolves #<issue>.` where applicable

IMPORTANT: if you get an authorization error while trying to use `gh`, run `./scripts/bot-auth.sh` from the project root to get a 10-minute authorization

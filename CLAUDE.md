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
- `features/test/` – Gherkin feature files + step definitions that test Specify itself (self-hosted BDD tests)
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

## Contributing

**Issue tracker:** https://github.com/specify-bdd/specify-core/issues

ALWAYS perform any actions under the bot account; NEVER use the user's account to take action in the Github repo.

**Commit messages:**
```
[#<github-issue-id>] <explanation of why the change was needed>
```
Focus on *why*, not *what* — the diff covers what changed. Omit the ticket prefix only when there is genuinely no associated issue.

**Pull requests:**
- Always open a PR; never push directly to `main` or `develop`
- Target `develop` by default. If the ticket has a GitHub milestone, target the corresponding `rel/<milestone-slug>` branch instead (e.g. milestone "Browser Plugin" → `rel/browser-plugin`). If that branch doesn't exist yet, create it based on `origin/main`
- Open PRs as drafts, add inline diff comments to annotate anything a reviewer might need explained, then mark as ready for review
- Assign `specify-bdd/devs` as reviewer
- PR description should include `Resolves #<issue>.` where applicable

IMPORTANT: if you get an authorization error while trying to use `gh`, run `./scripts/bot-auth.sh` from the project root to get a 10-minute authorization

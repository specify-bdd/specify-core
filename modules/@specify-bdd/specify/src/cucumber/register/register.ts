/**
 * Register Module
 *
 * Loaded by Cucumber as the sole entry point under this package's `cucumber/`
 * directory. Globs every sibling `support/*` and `step_definitions/*` module
 * and invokes each one's `register()` export, in that order. Modules in this
 * package perform their Cucumber-side registrations only when invoked through
 * this module, so that there are no import-time side effects.
 */

import { registerSupportCode } from "@specify-bdd/specify";

await registerSupportCode(import.meta.dirname);

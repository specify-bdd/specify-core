/**
 * Package Step Definitions Module
 *
 * Cucumber step definitions covering Node.js package management.
 */

import { defineStep } from "@specify-bdd/specify";
import assert         from "node:assert/strict";
import npmValidate    from "validate-npm-package-name";

export function register(): void {
    defineStep("Given (that )the {refstr} NPM package is installed", verifyNPMPackage);
}

/**
 * Assert NPM package installed
 *
 * Verifies that the given name is a valid NPM package identifier and that the
 * package is resolvable in the current environment.
 *
 * @param packageName - The name of the package to verify
 */
export function verifyNPMPackage(packageName: string): void {
    assert.ok(npmValidate(packageName));
    assert.ok(import.meta.resolve(packageName));
}

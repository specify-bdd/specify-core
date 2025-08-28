/**
 * Package Step Definitions Module
 *
 * Cucumber step definitions covering Node.js package management.
 */
import { Given   } from "@cucumber/cucumber";
import assert      from "node:assert/strict";
import npmValidate from "validate-npm-package-name";

Given("(that )the {string} NPM package is installed", verifyNPMPackage);

/**
 * Verify that an NPM package is installed
 *
 * @param packageName - The name of the package to verify
 */
function verifyNPMPackage(packageName: string): void {
    assert.ok(npmValidate(packageName));
    assert.ok(import.meta.resolve(packageName));
}

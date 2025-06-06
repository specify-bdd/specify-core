/**
 * Package Step Definitions Module
 *
 * Cucumber step definitions covering Node.js package management.
 */
import { Given } from "@cucumber/cucumber";
import assert from "node:assert/strict";
import npmValidate from "validate-npm-package-name";

Given('that the {string} NPM package is installed', verifyNodePackage);

function verifyNodePackage(packageName: string): void {
    assert.ok(npmValidate(packageName));
    assert.ok(import.meta.resolve(packageName));
}

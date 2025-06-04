/**
 * Package Step Definitions Module
 *
 * Cucumber step definitions covering Node.js package management.
 */
import { Given } from "@cucumber/cucumber";

const internalPackages = [
    "@specify/quick-ref",
    "@specify/core",
    "@specify/plugin-cli",
];

Given("that the {string} NPM package is installed", verifyOrInstallNodePackage);

function verifyOrInstallNodePackage(packageName: string): void {
    if (internalPackages.includes(packageName)) {
        // TODO verify internal installation
        return;
    } else {
        // install the package
        throw Error(`Package ${packageName} is not installed`);
    }
}

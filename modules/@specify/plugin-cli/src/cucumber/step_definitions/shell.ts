/**
 * Shell Step Definitions Module
 *
 * Cucumber step definitions covering the provisioning of an OS shell for
 * testing purposes.
 */

import { Given, Then, When } from "@cucumber/cucumber";
import { Commander } from "@/commander";
import assert from "node:assert/strict";

Given("that a command line prompt is available", setupCLI);

When("a/the user runs the command {string}", runCommand);

Then(
    'the command should exit with a(n)/the "{ref:statusCode}" status code',
    verifyCLIStatusCode,
);

Then(
    'the console output should be a(n)/the "{ref:consoleOutput}"',
    verifyCLIOutput,
);

async function runCommand(command: string) {
    await this.cli.shell.run(command);
}

function setupCLI(): void {
    this.cli.shell = new Commander(this.userPath);
}

function verifyCLIOutput(consoleOutput: RegExp) {
    assert.ok(consoleOutput.test(this.cli.shell.output));
}

function verifyCLIStatusCode(statusCode: string) {
    assert.equal(this.cli.shell.statusCode, statusCode);
}

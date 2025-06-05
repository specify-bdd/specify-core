/**
 * Shell Step Definitions Module
 *
 * Cucumber step definitions covering the provisioning of an OS shell for
 * testing purposes.
 */

import { Given, Then, When } from "@cucumber/cucumber";
import { Commander } from "@/commander";
import assert from "assert";

Given("that a command line prompt is available", setupCLI);

When("a/the user runs the command {string}", executeCommand);

Then(
    'the command should exit with a(n)/the "{ref:statusCode}" status code',
    verifyCLIStatusCode,
);

Then(
    'the console output should be a(n)/the "{ref:consoleOutput}"',
    verifyCLIOutput,
);

async function executeCommand(command: string) {
    await this.cli.run(command);
}

function setupCLI(): void {
    this.cli = new Commander(this.userPath);
}

function verifyCLIOutput(consoleOutput: RegExp) {
    assert.ok(consoleOutput.test(this.cli.output));
}

function verifyCLIStatusCode(statusCode: string) {
    assert.strictEqual(this.cli.statusCode, statusCode);
}

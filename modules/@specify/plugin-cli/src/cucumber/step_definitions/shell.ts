/**
 * Shell Step Definitions Module
 *
 * Cucumber step definitions covering the provisioning of an OS shell for
 * testing purposes.
 */

import { Given, Then, When } from "@cucumber/cucumber";
import { Commander } from "@/commander";
import { assert } from "console";

Given("that a command line prompt is available", setupCLI);

When("a/the user runs the command {string}", executeCommand);

Then(
    'the command should exit with a(n)/the "{ref:statusCode}" status code',
    verifyCLIStatusCode,
);

// Then(
//     "the command should exit with a {string} status code",
//     verifyCLIStatusCode,
// );

// Then(
//     `the console output should be a(n)/the {ref:consoleOutput}`,
//     verifyCLIOutput,
// );

async function executeCommand(command: string) {
    await this.cli.run(command);
}

function setupCLI(): void {
    this.cli = new Commander(this.userPath);
}

function verifyCLIOutput(consoleOutput: string) {
    // resolve the output ref and compare against CLI
}

function verifyCLIStatusCode(statusCode: string) {
    assert(statusCode === this.cli.statusCode);
}

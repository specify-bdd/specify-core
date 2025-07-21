/**
 * Shell Step Definitions Module
 *
 * Cucumber step definitions covering the provisioning of an OS shell for
 * testing purposes.
 */

import assert, { AssertionError } from "node:assert/strict";
import { Given, Then, When      } from "@cucumber/cucumber";
import { SessionManager         } from "@/lib/SessionManager";
import { ShellSession           } from "@/lib/ShellSession";

Given(" a shell", startDefaultShell);

When("a user starts a shell", startDefaultShell);

When("a/the user runs the command {string}", { "timeout": 60000 }, runCommand);

Then('the command should exit with a(n)/the "{ref:statusCode}" status code', verifyCLIStatusCode);

Then('the console output should be a(n)/the "{ref:consoleOutput}"', verifyCLIOutput);

/**
 * Run the given command via the CLI
 *
 * @param command - the command to run
 */
async function runCommand(command: string) {
    await this.cli.manager.run(command);
}

/**
 * Start a default shell
 *
 * @param name - The name of the shell (optional)
 */
async function startDefaultShell(name: string) {
    const shell = new ShellSession(this.parameters.userPath);

    this.cli.manager = SessionManager.getInstance();
    this.cli.manager.addSession(shell, name, true);
}

/**
 * Verify that the CLI output for the last completed command matches the given
 * regexp
 *
 * @param consoleOutput - the matcher to use for the output
 *
 * @throws if the matcher regexp wasnt found
 */
function verifyCLIOutput(consoleOutput: RegExp) {
    assert.ok(
        consoleOutput.test(this.cli.manager.output),
        new AssertionError({
            "message": `Command output did not match expectations. Output:\n${this.cli.manager.output}`,
        }),
    );
}

/**
 * Verify that the CLI status code for the last completed command is as expected
 *
 * @param statusCode - the status code expected from the last command
 *
 * @throws if the actual status code is different
 */
function verifyCLIStatusCode(statusCode: number) {
    assert.equal(
        this.cli.manager.statusCode,
        statusCode,
        "The command's status code did not match expectations.",
    );
}

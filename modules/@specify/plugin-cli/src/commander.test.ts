import { Commander } from "./Commander";
import { FakeShellSession } from "./FakeShellSession";

describe("Commander", () => {
    let session: FakeShellSession;
    let commander: Commander;

    beforeEach(() => {
        session = new FakeShellSession();
        commander = new Commander(session);
    });

    it("writes command to session and resolves after delimiter", async () => {
        const output = "test";
        const command = `echo ${output}`;
        const promise = commander.run(command);

        session.emitOutput(output);
        session.emitDelimiter(0);

        await promise;

        expect(session.write).toHaveBeenCalledWith(
            expect.stringContaining(command),
        );
    });

    it("resolves run() when delimiter output is received", async () => {
        let resolved = false;

        const promise = commander
            .run("echo test")
            .then(() => (resolved = true));

        session.emitOutput("test");

        // wait arbitrary time to ensure promise hasn't resolved
        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(resolved).toBeFalsy();

        session.emitDelimiter(0);

        await promise;

        expect(resolved).toBeTruthy();
    });

    it("captures command output", async () => {
        const output = "test";
        const command = `echo ${output}`;
        const promise = commander.run(command);

        session.emitOutput(output);
        session.emitDelimiter(0);

        await promise;

        expect(commander.output).toBe(output);
    });

    it("captures multiple lines of command output", async () => {
        const output = ["test 1", "test 2"];
        const promise = commander.run("some-command");

        session.emitOutput(output[0]);
        session.emitOutput(output[1]);
        session.emitDelimiter(0);

        await promise;

        expect(commander.output).toBe(`${output[0]}\n${output[1]}`);
    });

    it("captures command's status code", async () => {
        const promise = commander.run("echo test");

        session.emitDelimiter(0);

        await promise;

        expect(commander.statusCode).toBe(0);
    });

    it("resolves kill() on session close", async () => {
        let resolved = false;

        const promise = commander.kill().then(() => (resolved = true));

        // wait arbitrary time to ensure promise hasn't resolved
        await new Promise((resolve) => setTimeout(resolve, 100));

        expect(resolved).toBeFalsy();

        session.emitClose();

        await promise;

        expect(session.kill).toHaveBeenCalled();
        expect(resolved).toBeTruthy();
    });

    it("ignores delimiter-only output", async () => {
        const promise = commander.run("no output");

        session.emitDelimiter(0);

        await promise;

        expect(commander.output).toBe("");
    });

    it("throws if output contains malformed delimiter", async () => {
        // this promise will never resolve because malformed delimiter doesn't trigger resolution
        const promise = commander.run("echo bad");

        let error: Error | null;

        try {
            session.emitDelimiter(0, true);
        } catch (err) {
            error = err;
        }

        expect(error!.message).toMatch(
            /^Output does not contain a value for ".+"$/,
        );
    });

    it("throws if run() is called while another command is in progress", async () => {
        const command = "long-running command";
        // this promise will never resolve due to the throw
        const promise = commander.run("long-running command");

        await expect(commander.run("overlapping command")).rejects.toThrow(
            `A command is already running: ${command}`,
        );
    });
});

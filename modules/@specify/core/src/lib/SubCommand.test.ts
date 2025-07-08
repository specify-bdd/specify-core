import { SubCommand, SUBCOMMAND_DEFAULT_OPTS } from "./SubCommand";

describe("SubCommand", () => {
    const emptyArgs = { "_": [] };
    const emptyOpts = {};

    describe("constructor()", () => {
        describe("iniitializes options...", () => {
            it("...with defaults when no user options are provided", () => {
                const cmd = new SubCommand(emptyOpts);

                expect(cmd.debug).toBe(SUBCOMMAND_DEFAULT_OPTS.debug);
                expect(cmd.logPath).toBe(SUBCOMMAND_DEFAULT_OPTS.logPath);
            });

            it("...with merged values when user options are provided", () => {
                const userOpts = { "debug": true };
                const cmd      = new SubCommand(userOpts);

                expect(cmd.debug).toBe(userOpts.debug);
            });
        });
    });

    describe("execute()", () => {
        it("returns an error result when called", async () => {
            const cmd = new SubCommand(emptyOpts);
            const res = await cmd.execute(emptyArgs);

            expect(res.ok).toBe(false);
            expect(res.status).toBe(2);
            expect(res.error).toBeTruthy();
            expect(res.result).toBeUndefined();
        });
    });
});

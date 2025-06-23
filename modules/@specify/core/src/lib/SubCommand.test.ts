import { SubCommand, DEFAULT_OPTS } from "./SubCommand";

const emptyArgs = { "_": [] };
const emptyOpts = {};

describe("SubCommand", () => {
    describe("constructor()", () => {
        it("initializes arguments", () => {
            const args = { "foo": "bar", "_": [ "baz" ] };
            const cmd  = new SubCommand(args, emptyOpts);

            expect(cmd.args).toEqual(args);
        });

        describe("iniitializes options...", () => {
            it("...with defaults when no user options are provided", () => {
                const cmd = new SubCommand(emptyArgs, emptyOpts);

                expect(cmd.opts).toEqual(DEFAULT_OPTS);
            });

            it("...with merged values when user options are provided", () => {
                const userOpts   = { "debug": true };
                const mergedOpts = { ...DEFAULT_OPTS, ...userOpts };
                const cmd        = new SubCommand(emptyArgs, userOpts);

                expect(cmd.opts).toEqual(mergedOpts);
            });
        });
    });

    describe("execute()", () => {
        it("returns an error result when called", async () => {
            const cmd = new SubCommand(emptyArgs, emptyOpts);
            const res = await cmd.execute();

            expect(res)
                .toEqual({
                    "ok": false,
                    "status": 2,
                    "error": {},
                });
        });
    });
});

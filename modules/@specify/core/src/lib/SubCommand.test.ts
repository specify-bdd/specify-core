import { SubCommand, DEFAULT_OPTS } from "./SubCommand";

import merge from "deepmerge";

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
                const userOpts = { "debug": true };
                const expOpts  = merge.all([ {}, DEFAULT_OPTS, userOpts ]);
                const cmd      = new SubCommand(emptyArgs, userOpts);

                expect(cmd.opts).toEqual(expOpts);
            });
        });
    });

    describe("execute()", () => {
        it("returns an error result when called", async () => {
            const cmd = new SubCommand(emptyArgs, emptyOpts);
            const res = await cmd.execute();

            expect(res.ok).toBe(false);
            expect(res.status).toBe(2);
            expect(res.error).toBeTruthy();
            expect(res.result).toBeUndefined();
        });
    });
});

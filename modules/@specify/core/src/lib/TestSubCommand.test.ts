import { TestSubCommand, TEST_DEFAULT_OPTS } from "./TestSubCommand";

import fs from "node:fs";
import url from "node:url";

const emptyArgs = { "_": [] };
const emptyOpts = {};

describe("TestSubCommand", () => {
    describe("constructor()", () => {
        describe("iniitializes options...", () => {
            it("...with defaults when no user options are provided", () => {
                const cmd = new TestSubCommand(emptyArgs, emptyOpts);

                expect(cmd.opts).toEqual(TEST_DEFAULT_OPTS);
            });

            it("...with merged values when user options are provided", () => {
                const userOpts   = { "debug": true };
                const mergedOpts = { ...TEST_DEFAULT_OPTS, ...userOpts };
                const cmd        = new TestSubCommand(emptyArgs, userOpts);

                expect(cmd.opts).toEqual(mergedOpts);
            });
        });

        describe("parses command arguments", () => {
            describe("paths", () => {
                it("valid", () => {
                    const userArgs = { "_": [ "./assets/gherkin/binary/passing.feature" ] };
                    const cmd      = new TestSubCommand(userArgs, emptyOpts);

                    expect(cmd.opts?.cucumber?.paths).toEqual(userArgs._);
                });

                it("invalid", () => {
                    const userArgs = { "_": [ "./path/that/doesnt/exist/" ] };

                    expect(() => new TestSubCommand(userArgs, emptyOpts)).toThrow(/Invalid path:/);
                });
            });

            it("tags", () => {
                const userArgs = { "tags": [ "@foo", "not @bar" ], ...emptyArgs };
                const cmd      = new TestSubCommand(userArgs, emptyOpts);

                expect(cmd.opts?.cucumber?.tags).toBe("@foo and not @bar");
                expect(cmd.args).toEqual(emptyArgs);
            });
        });

        describe("resolves plugins", () => {
            it("valid", async () => {
                const jestPath = url.fileURLToPath(import.meta.resolve("jest"));
                const corePath = url.fileURLToPath(import.meta.resolve("@specify/core"));
                const userOpts = { "plugins": [ "jest", corePath ] };
                const cmd      = new TestSubCommand(emptyArgs, userOpts);

                expect(cmd.opts?.cucumber?.import).toEqual([ jestPath, corePath ]);
            });

            it("invalid", () => {
                const userOpts = { "plugins": [ "name-that-is-neither-valid-package-nor-path" ] };

                expect(() => new TestSubCommand(emptyArgs, userOpts)).toThrow();
            });
        });

        it("sets a log path", () => {
            const cmd = new TestSubCommand(emptyArgs, emptyOpts);

            expect(cmd.opts?.cucumber?.format).toEqual([ [ "json", cmd.opts?.logPath ] ]);
        });
    });

    describe("execute()", () => {
        it("runs a test", () => {
            const userArgs = { "_": [ "./assets/gherkin/binary/passing.feature" ] };
            const cmd      = new TestSubCommand(userArgs, emptyOpts);
            const res      = await cmd.execute();

            expect(fs.existsSync(cmd.opts.logPath)).toBe(true);

            const logFileText = fs.readFileSync(cmd.opts.logPath, { "encoding": "utf8" });
            const logFileJSON = JSON.parse(logFileStr);

            expect(res.ok).toBe(true);
            expect(res.status).toBe(0);
            expect(res.result).toEqual(logFileJSON);
        });
    });
});

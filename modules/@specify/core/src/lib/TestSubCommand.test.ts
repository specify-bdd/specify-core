import { TestSubCommand, TEST_DEFAULT_OPTS } from "./TestSubCommand";
import { createRequire } from "module"; 

import merge from "deepmerge";
import fs from "node:fs";
import path from "node:path";

const require   = createRequire(import.meta.url);
const emptyArgs = { "_": [] };
const emptyOpts = {};


describe("TestSubCommand", () => {
    describe("constructor()", () => {
        describe("iniitializes options...", () => {
            it("...with defaults when no user options are provided", () => {
                const expOpts = merge({}, TEST_DEFAULT_OPTS);
                const cmd        = new TestSubCommand(emptyArgs, emptyOpts);

                // default options get augmented with a cucumber formatter for the log path
                expOpts.cucumber.format.push([ "json", cmd.opts.logPath ]);

                expect(cmd.opts).toEqual(expOpts);
            });

            it("...with merged values when user options are provided", () => {
                const userOpts = { "debug": true };
                const expOpts  = merge.all([ {}, TEST_DEFAULT_OPTS, userOpts ]);
                const cmd      = new TestSubCommand(emptyArgs, userOpts);

                // default options get augmented with a cucumber formatter for the log path
                expOpts.cucumber.format.push([ "json", cmd.opts.logPath ]);

                expect(cmd.opts).toEqual(expOpts);
            });
        });

        describe("parses command arguments", () => {
            describe("paths", () => {
                it("valid", () => {
                    const featPath = "./assets/gherkin/binary/passing.feature";
                    const userArgs = { "_": [ featPath ] };
                    const cmd      = new TestSubCommand(userArgs, emptyOpts);

                    expect(cmd.opts?.cucumber?.paths).toEqual([ path.resolve(featPath) ]);
                    expect(cmd.args).toEqual(emptyArgs);
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
                const vitestPath = path.dirname(require.resolve("vitest"));
                const corePath   = path.dirname(require.resolve("@specify/core"));
                const userOpts   = { "plugins": [ "vitest", corePath ] };
                const cmd        = new TestSubCommand(emptyArgs, userOpts);

                expect(cmd.opts?.cucumber?.import).toEqual([ vitestPath, corePath ]);
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
        describe("runs tests", () => {
            const userOpts = {
                // "cucumber": {
                //     "format": [
                //         [ "progress", "/dev/null" ]
                //     ]
                // },
                "plugins": [
                    path.resolve(import.meta.dirname, "../../dist/cucumber"),
                    "@specify/plugin-cli"
                ]
            };

            it("pass", async () => {
                const userArgs = { "_": [ "./assets/gherkin/binary/passing.feature" ] };
                const cmd      = new TestSubCommand(userArgs, userOpts);
                const res      = await cmd.execute();

                expect(fs.existsSync(cmd.opts.logPath)).toBe(true);

                const logFileText = fs.readFileSync(cmd.opts.logPath, { "encoding": "utf8" });
                const logFileJSON = JSON.parse(logFileText);

                expect(res.ok).toBe(true);
                expect(res.status).toBe(0);
                expect(res.result).toEqual(logFileJSON);
            });

            it("fail", async () => {
                const userArgs = { "_": [ "./assets/gherkin/binary/failing.feature" ] };
                const cmd      = new TestSubCommand(userArgs, userOpts);
                const res      = await cmd.execute();

                expect(fs.existsSync(cmd.opts.logPath)).toBe(true);

                const logFileText = fs.readFileSync(cmd.opts.logPath, { "encoding": "utf8" });
                const logFileJSON = JSON.parse(logFileText);

                expect(res.ok).toBe(false);
                expect(res.status).toBe(1);
                expect(res.result).toEqual(logFileJSON);
            });

            it("error", async () => {
                const userArgs = { "_": [ "./assets/gherkin/empty" ] };
                const cmd      = new TestSubCommand(userArgs, userOpts);
                const res      = await cmd.execute();

                expect(fs.existsSync(cmd.opts.logPath)).toBe(true);

                const logFileText = fs.readFileSync(cmd.opts.logPath, { "encoding": "utf8" });
                const logFileJSON = JSON.parse(logFileText);

                expect(res.ok).toBe(false);
                expect(res.status).toBe(2);
                expect(res.error).toBeTruthy();
                expect(res.result).toEqual(logFileJSON);
            });
        });
    });
});

import { createRequire } from "module"; 

import {
    TestSubCommand,
    ITestSubCommandOptions,
    TEST_SUBCOMMAND_DEFAULT_OPTS
} from "./TestSubCommand";

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
                const expOpts = merge({}, TEST_SUBCOMMAND_DEFAULT_OPTS);
                const cmd     = new TestSubCommand(emptyOpts);

                // default options get augmented with a cucumber formatter for the log path
                expOpts.cucumber.format.push([ "json", cmd.logPath ]);

                expect(cmd.cucumber).toEqual(expOpts.cucumber);
                expect(cmd.gherkinPaths).toEqual(expOpts.gherkinPaths);
                expect(cmd.plugins).toEqual(expOpts.plugins);
            });

            it("...with merged values when user options are provided", () => {
                const userOpts = { "gherkinPaths": [ "./fake/path" ] };
                const cmd      = new TestSubCommand(userOpts);

                expect(cmd.gherkinPaths).toEqual(userOpts.gherkinPaths);
            });
        });

        describe("resolves plugins", () => {
            it("valid", async () => {
                const vitestPath = path.dirname(require.resolve("vitest"));
                const corePath   = path.dirname(require.resolve("@specify/core"));
                const userOpts   = { "plugins": [ "vitest", corePath ] };
                const cmd        = new TestSubCommand(userOpts);

                expect(cmd.cucumber?.import).toEqual([ vitestPath, corePath ]);
            });

            it("invalid", () => {
                const userOpts = { "plugins": [ "name-that-is-neither-valid-package-nor-path" ] };

                expect(() => new TestSubCommand(userOpts)).toThrow();
            });
        });
    });

    // these tests run Cucumber and are best understood as integration tests until the underlying code has been
    // refactored
    describe("execute()", () => {
        describe("parses command arguments", () => {
            describe("paths", () => {
                it("valid", async () => {
                    const featPath = "./assets/gherkin/binary/passing.feature:3";
                    const userArgs = { "_": [ featPath ] };
                    const userOpts = { "debug": true };
                    const cmd      = new TestSubCommand(userOpts);
                    const res      = await cmd.execute(userArgs);

                    expect(res.status).toBe(1); // no support code imported, so steps are undefined
                    expect(res.debug?.args).toBe(userArgs);
                    expect(res.debug?.cucumber?.runConfiguration?.sources?.paths).toEqual([ path.resolve(featPath) ]);
                });

                it("invalid", async () => {
                    const userArgs = { "_": [ "./path/that/doesnt/exist/" ] };
                    const cmd      = new TestSubCommand(emptyOpts);
                    const res      = await cmd.execute(userArgs);

                    expect(res.error.message).toMatch(/Invalid path:/);
                });
            });

            it("tags", async () => {
                const userArgs = { "tags": [ "@foo", "not @bar" ], ...emptyArgs };
                const userOpts = { "debug": true };
                const cmd      = new TestSubCommand(userOpts);
                const res      = await cmd.execute(userArgs);

                expect(res.status).toBe(2); // no scenarios should match these tags
                expect(res.debug?.args).toBe(userArgs);
                expect(res.debug?.cucumber?.runConfiguration?.sources?.tagExpression).toBe("(@foo) and (not @bar)");
            });
        });

        describe("runs tests", () => {
            let userOpts: Partial<ITestSubCommandOptions> = {};

            beforeAll(() => {
                userOpts = {
                    "logPath": path.resolve(`./logs/specify-test-vitest-log-${Date.now()}.json`),
                    "plugins": [
                        path.resolve(import.meta.dirname, "../../dist/cucumber"),
                    ],
                };
            });

            it("pass", async () => {
                const userArgs = { "_": [ "./assets/gherkin/binary/passing.feature" ] };
                const cmd      = new TestSubCommand(userOpts);
                const res      = await cmd.execute(userArgs);

                expect(fs.existsSync(cmd.logPath)).toBe(true);

                const logFileText = fs.readFileSync(cmd.logPath, { "encoding": "utf8" });
                const logFileJSON = JSON.parse(logFileText);

                expect(res.ok).toBe(true);
                expect(res.status).toBe(0);
                expect(res.result).toEqual(logFileJSON);
            });

            it("fail", async () => {
                const userArgs = { "_": [ "./assets/gherkin/binary/failing.feature" ] };
                const cmd      = new TestSubCommand(userOpts);
                const res      = await cmd.execute(userArgs);

                expect(fs.existsSync(cmd.logPath)).toBe(true);

                const logFileText = fs.readFileSync(cmd.logPath, { "encoding": "utf8" });
                const logFileJSON = JSON.parse(logFileText);

                expect(res.ok).toBe(false);
                expect(res.status).toBe(1);
                expect(res.result).toEqual(logFileJSON);
            });

            it("error", async () => {
                const userArgs = { "_": [ "./assets/gherkin/empty" ] };
                const cmd      = new TestSubCommand(userOpts);
                const res      = await cmd.execute(userArgs);

                expect(fs.existsSync(cmd.logPath)).toBe(true);

                const logFileText = fs.readFileSync(cmd.logPath, { "encoding": "utf8" });
                const logFileJSON = JSON.parse(logFileText);

                expect(res.ok).toBe(false);
                expect(res.status).toBe(2);
                expect(res.error).toBeTruthy();
                expect(res.result).toEqual(logFileJSON);
            });
        });
    });
});

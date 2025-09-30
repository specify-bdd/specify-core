import path                 from "node:path";
import { deserializeError } from "serialize-error";

import { TestCommand, TestCommandOptions } from "../TestCommand";
import { CucumberTool                    } from "../CucumberTool";
import { RerunFile                       } from "../RerunFile";

const { mockRunCucumber, mockLoadConfiguration, mockLoadSupport } = vi.hoisted(() => {
    return {
        "mockRunCucumber":       vi.fn(),
        "mockLoadConfiguration": vi.fn(async (config) => ({
            "sources": config,
        })),
        "mockLoadSupport": vi.fn(),
    };
});

vi.mock("../CucumberTool", () => ({
    "CucumberTool": {
        "loadConfiguration": mockLoadConfiguration,
        "loadSupport":       mockLoadSupport,
        "runCucumber":       mockRunCucumber,
    },
}));

vi.mock("../RerunFile");

describe("TestCommand", () => {
    const emptyArgs = { "paths": [] };

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe("execute()", () => {
        describe("parses command arguments", () => {
            it("parallel", async () => {
                const userArgs = { "parallel": 2, ...emptyArgs };
                const userOpts = { "debug": true };
                const cmd      = new TestCommand(userOpts);

                await cmd.execute(userArgs);

                expect(CucumberTool.loadConfiguration).toHaveBeenCalledWith(
                    expect.objectContaining({
                        "parallel": 2,
                    }),
                );
            });

            it("paths", async () => {
                const featPath = "./assets/gherkin/binary/passing.feature";
                const userArgs = { "paths": [featPath] };
                const cmd      = new TestCommand();

                await cmd.execute(userArgs);

                expect(CucumberTool.loadConfiguration).toHaveBeenCalledWith(
                    expect.objectContaining({
                        "paths": [path.resolve(featPath)],
                    }),
                );
            });

            describe("rerun", () => {
                it("uses the file provided with the --rerun-file option", async () => {
                    vi.mocked(RerunFile).read.mockResolvedValueOnce(["test.feature:123"]);

                    const userArgs = { "rerun": "true", "rerunFile": "/test/rerun.txt" };
                    const cmd      = new TestCommand();

                    await cmd.execute(userArgs);

                    expect(CucumberTool.loadConfiguration).toHaveBeenCalledWith(
                        expect.objectContaining({
                            "paths": ["test.feature:123"],
                        }),
                    );
                });
            });

            describe("rerun-file", () => {
                it("adds a rerun formatter entry if none exists", async () => {
                    const userArgs = { "rerunFile": "/test/rerun.txt" };
                    const cmd      = new TestCommand();

                    await cmd.execute(userArgs);

                    expect(CucumberTool.loadConfiguration).toHaveBeenCalledWith(
                        expect.objectContaining({
                            "format": expect.arrayContaining(["rerun:/test/rerun.txt"]),
                        }),
                    );
                });

                it("overrides an existing rerun formatter entry", async () => {
                    const userArgs = { "rerunFile": "/test/new.txt" };
                    const cmd      = new TestCommand({
                        "cucumber": { "format": ["rerun:old.txt"] },
                    });

                    await cmd.execute(userArgs);

                    expect(CucumberTool.loadConfiguration).toHaveBeenCalledWith(
                        expect.objectContaining({
                            "format": expect.arrayContaining(["rerun:/test/new.txt"]),
                        }),
                    );
                });
            });

            describe("retry", () => {
                it("accepts a positive integer", async () => {
                    const userArgs = { "retry": 2, ...emptyArgs };
                    const cmd      = new TestCommand();

                    await cmd.execute(userArgs);

                    expect(CucumberTool.loadConfiguration).toHaveBeenCalledWith(
                        expect.objectContaining({
                            "retry": 2,
                        }),
                    );
                });

                it("deletes the retryTagFilter from config when retry is 0", async () => {
                    const userArgs = { "retry": 0, ...emptyArgs };
                    const cmd      = new TestCommand({ "cucumber": { "retryTagFilter": "@test" } });

                    await cmd.execute(userArgs);

                    expect(CucumberTool.loadConfiguration).toHaveBeenCalledWith(
                        expect.not.objectContaining({
                            "retryTagFilter": "@test",
                        }),
                    );
                });
            });

            it("retry-tag", async () => {
                const userArgs = { "retryTag": "@test", ...emptyArgs };
                const cmd      = new TestCommand({
                    "cucumber": { "retryTagFilter": "@should-override" },
                });

                await cmd.execute(userArgs);

                expect(CucumberTool.loadConfiguration).toHaveBeenCalledWith(
                    expect.objectContaining({
                        "retryTagFilter": "@test",
                    }),
                );
            });

            it("tags", async () => {
                const userArgs = { "tags": ["@foo", "not @bar"], ...emptyArgs };
                const userOpts = { "debug": true };
                const cmd      = new TestCommand(userOpts);

                await cmd.execute(userArgs);

                expect(CucumberTool.loadConfiguration).toHaveBeenCalledWith(
                    expect.objectContaining({
                        "tags": "(@foo) and (not @bar)",
                    }),
                );
            });
        });

        describe("returns", () => {
            const userOpts: Partial<TestCommandOptions> = {
                "cucumber": {
                    "import": [path.resolve(import.meta.dirname, "../../dist/cucumber")],
                    "format": ["rerun:/test/rerun.txt"],
                },
                "logPath": path.resolve(`./logs/specify-test-vitest-log-${Date.now()}.json`),
            };

            describe("test results", () => {
                it("passing", async () => {
                    const userArgs = { "paths": ["./assets/gherkin/binary/passing.feature"] };
                    const cmd      = new TestCommand(userOpts);

                    mockRunCucumber.mockResolvedValueOnce({
                        "success": true,
                    });

                    const res = await cmd.execute(userArgs);

                    expect(res.ok).toBe(true);
                    expect(res.status).toBe(0);
                });

                it("failing", async () => {
                    const userArgs = { "paths": ["./assets/gherkin/binary/failing.feature"] };
                    const cmd      = new TestCommand(userOpts);

                    mockRunCucumber.mockResolvedValueOnce({
                        "success": false,
                    });

                    const res = await cmd.execute(userArgs);

                    expect(res.ok).toBe(false);
                    expect(res.status).toBe(1);
                });
            });

            describe("errors", () => {
                it("any error reports error status", async () => {
                    mockRunCucumber.mockRejectedValueOnce(Error("test"));

                    const res = await new TestCommand().execute(emptyArgs);

                    expect(res.ok).toBe(false);
                    expect(res.status).toBe(2);
                });

                it("no executed tests", async () => {
                    const error    = Error("No tests were executed.");
                    const userArgs = { "paths": ["./assets/gherkin/empty"] };

                    mockRunCucumber.mockRejectedValueOnce(error);

                    const res = await new TestCommand().execute(userArgs);

                    expect(deserializeError(res.error)).toEqual(error);
                });

                it("unsupported command option", async () => {
                    const error    = Error('Option "--bad" not being used to configure Cucumber');
                    const userArgs = { ...emptyArgs, "bad": "test" };

                    const res = await new TestCommand().execute(userArgs);

                    expect(deserializeError(res.error)).toEqual(error);
                });

                it("invalid test file path", async () => {
                    const error    = Error("Invalid path: ./path/that/doesnt/exist/");
                    const userArgs = { "paths": ["./path/that/doesnt/exist/"] };

                    const res = await new TestCommand().execute(userArgs);

                    expect(deserializeError(res.error)).toEqual(error);
                });
            });
        });
    });
});

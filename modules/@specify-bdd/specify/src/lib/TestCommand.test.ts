import path                 from "node:path";
import { deserializeError } from "serialize-error";

import { TestCommand, TestCommandOptions } from "./TestCommand";
import { CucumberTool                    } from "./CucumberTool";

const { mockRunCucumber, mockLoadConfiguration, mockLoadSupport } = vi.hoisted(() => {
    return {
        "mockRunCucumber":       vi.fn(),
        "mockLoadConfiguration": vi.fn(async (config) => ({
            "sources": config,
        })),
        "mockLoadSupport": vi.fn(),
    };
});

vi.mock("./CucumberTool", () => ({
    "CucumberTool": {
        "loadConfiguration": mockLoadConfiguration,
        "loadSupport":       mockLoadSupport,
        "runCucumber":       mockRunCucumber,
    },
}));

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

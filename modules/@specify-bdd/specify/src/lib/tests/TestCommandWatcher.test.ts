import { watch } from "chokidar";
import path      from "node:path";
import os        from "node:os";

import { TestCommand, TestCommandArguments } from "../TestCommand";
import { TestCommandWatcher                } from "../TestCommandWatcher";

// mock TestCommand class completely
vi.mock("../TestCommand", () => ({
    "TestCommand": vi.fn().mockImplementation(() => ({
        "execute": vi.fn().mockImplementation(
            async () =>
                new Promise((resolve) => {
                    setTimeout(() => resolve({ "ok": true, "status": 0 }), 100);
                }),
        ),
    })),
}));

// test constants
const MOCK_ARGS        = { "paths": [] };
const TEST_FILE_PATH   = "/some/file.ts";
const CONFIG_FILE_NAME = "specify.config.json";

const createMockConfig = (paths: string[] = ["./src", "./features"]) => ({
    "config": {
        "cucumber": {
            "format": [],
            "import": [],
            "paths":  [],
            "tags":   "",
        },
        "debug":        false,
        "gherkinPaths": [],
        "logPath":      path.join(os.tmpdir(), `specify-test-log-${Date.now()}.json`),
        "watch":        {
            "debug":  false,
            "events": ["add", "change", "unlink"],
            "ignore": ["node_modules", ".git"],

            paths,
        },
    },
});

// mocks
const mockWatch = vi.mocked(watch);

vi.mock("chokidar");
vi.mock("node:fs");
vi.mock("node:console", () => ({
    "clear": vi.fn(),
    "log":   vi.fn(),
}));
vi.mock("@/config/all", () => ({
    "config": {
        "cucumber": {
            "format": [],
            "import": [],
            "paths":  [],
            "tags":   "",
        },
        "debug":        false,
        "gherkinPaths": [],
        "logPath":      path.join(os.tmpdir(), `specify-test-log-${Date.now()}.json`),
        "watch":        {
            "debug":  false,
            "events": ["add", "change", "unlink"],
            "ignore": ["node_modules", ".git"],
            "paths":  ["./src", "./features"],
        },
    },
}));

async function startWatcher(watcher: TestCommandWatcher, args: TestCommandArguments) {
    const promise = watcher.start(args);
    vi.runAllTimers();
    return promise;
}

describe("TestCommandWatcher", () => {
    let mockCommand: TestCommand;
    let watcher: TestCommandWatcher;
    let mockWatcherInstance: { on: ReturnType<typeof vi.fn> };

    // helper functions for tests
    const getFileChangeHandler = () => {
        const calls   = mockWatcherInstance.on.mock.calls;
        const allCall = calls.find((call: [string, unknown]) => call[0] === "all");
        return allCall?.[1] as (event: string, filePath: string) => Promise<void>;
    };

    beforeEach(() => {
        const { config } = createMockConfig();

        vi.clearAllMocks();

        // create mock command instance using the mocked constructor
        mockCommand = new TestCommand(config);

        mockWatcherInstance = {
            "on": vi.fn().mockReturnThis(),
        };

        mockWatch.mockReturnValue(mockWatcherInstance as unknown as ReturnType<typeof watch>);

        watcher = new TestCommandWatcher(mockCommand);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe("start()", () => {
        it("clears console and starts watching configured paths", async () => {
            const { clear } = await import("node:console");

            await startWatcher(watcher, MOCK_ARGS);

            expect(clear).toHaveBeenCalled();
            expect(mockWatch).toHaveBeenCalledWith(
                [path.resolve("./src"), path.resolve("./features")],
                expect.objectContaining({
                    "ignored":    expect.any(Array),
                    "persistent": true,
                }),
            );
        });

        it("defaults to current working directory if no watch paths are specified", async () => {
            vi.doMock("@/config/all", () => createMockConfig([]));

            // clear modules to force reimport with new mock
            vi.resetModules();

            const { "TestCommandWatcher": emptyPathWatcher } = await import(
                "../TestCommandWatcher"
            );

            const emptyWatcher = new emptyPathWatcher(mockCommand);

            await startWatcher(emptyWatcher, MOCK_ARGS);

            expect(mockWatch).toHaveBeenCalledWith(
                [process.cwd()],
                expect.objectContaining({
                    "ignored":    expect.any(Array),
                    "persistent": true,
                }),
            );
        });

        it("sets up file system watcher with correct event handler", async () => {
            await startWatcher(watcher, MOCK_ARGS);

            expect(mockWatcherInstance.on).toHaveBeenCalledWith("all", expect.any(Function));
        });

        it("executes the command immediately upon starting", async () => {
            expect(mockCommand.execute).not.toHaveBeenCalled();

            await startWatcher(watcher, MOCK_ARGS);

            expect(mockCommand.execute).toHaveBeenCalledWith(MOCK_ARGS);
        });
    });

    describe("file change handling", () => {
        let changeHandler: (event: string, filePath: string) => Promise<void>;

        beforeEach(async () => {
            await startWatcher(watcher, MOCK_ARGS);

            vi.mocked(mockCommand).execute.mockClear();

            changeHandler = getFileChangeHandler();
        });

        it("executes command on valid file change event", async () => {
            await changeHandler("change", TEST_FILE_PATH);

            expect(mockCommand.execute).toHaveBeenCalledWith(MOCK_ARGS);
        });

        it("ignores events not in watchEvents list", async () => {
            await changeHandler("addDir", "/some/directory");

            expect(mockCommand.execute).not.toHaveBeenCalled();
        });

        it("handles config file changes", async () => {
            const configPath = path.join(process.cwd(), CONFIG_FILE_NAME);
            const { log } = await import("node:console");

            await changeHandler("change", configPath);

            expect(log).toHaveBeenCalledWith(
                expect.stringContaining(`${CONFIG_FILE_NAME} has been modified`),
            );
        });

        it("queues execution when the watcher is already executing the command", async () => {
            await changeHandler("change", "/path/one.js");
            await changeHandler("change", "/path/two.js");

            expect(mockCommand.execute).toHaveBeenCalledOnce();

            await vi.waitFor(() => {
                expect(mockCommand.execute).toHaveBeenCalledTimes(2);
            });
        });
    });
});

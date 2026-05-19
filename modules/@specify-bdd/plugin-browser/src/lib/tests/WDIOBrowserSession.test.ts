import { vi } from "vitest";

import { WDIOBrowserSession } from "@/lib/WDIOBrowserSession";

vi.mock("webdriverio");

const mockDriver = {
    "deleteSession":   vi.fn(),
    "getWindowHandle": vi.fn(),
    "newWindow":       vi.fn(),
};

beforeEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();

    // default stub so start() can always resolve a handle without per-test setup
    mockDriver.getWindowHandle.mockResolvedValue("handle-0");
});

/**
 * Create and start a WDIOBrowserSession backed by mockDriver.
 * Use this in tests that need a live session but don't require custom
 * pre-start mock configuration.
 */
async function startedSession(): Promise<WDIOBrowserSession> {
    const { remote } = await import("webdriverio");

    vi.mocked(remote).mockResolvedValue(mockDriver as never);

    const session = new WDIOBrowserSession();

    await session.start({ "browser": "chrome" });

    return session;
}

describe("WDIOBrowserSession", () => {
    describe("driver", () => {
        it("is null before start() is called", () => {
            const session = new WDIOBrowserSession();

            expect(session.driver).toBeNull();
        });

        it("is set after start() is called", async () => {
            const session = await startedSession();

            expect(session.driver).toBe(mockDriver);
        });

        it("is null after end() is called", async () => {
            const session = await startedSession();

            await session.end();

            expect(session.driver).toBeNull();
        });
    });

    describe("start()", () => {
        it("calls remote() with headless Chrome args by default", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });

            expect(remote).toHaveBeenCalledWith(
                expect.objectContaining({
                    "capabilities": expect.objectContaining({
                        "browserName": "chrome",
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        "goog:chromeOptions": expect.objectContaining({
                            "args": expect.arrayContaining(["--headless", "--no-sandbox"]),
                        }),
                    }),
                }),
            );
        });

        it("forwards the browser name to the browserName capability", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });

            expect(remote).toHaveBeenCalledWith(
                expect.objectContaining({
                    "capabilities": expect.objectContaining({
                        "browserName": "chrome",
                    }),
                }),
            );
        });

        it("calls remote() with headless Chrome args when mode is 'headless'", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome", "mode": "headless" });

            expect(remote).toHaveBeenCalledWith(
                expect.objectContaining({
                    "capabilities": expect.objectContaining({
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        "goog:chromeOptions": expect.objectContaining({
                            "args": expect.arrayContaining(["--headless", "--no-sandbox"]),
                        }),
                    }),
                }),
            );
        });

        it("throws for unsupported browsers", async () => {
            const session = new WDIOBrowserSession();

            for (const browser of ["firefox", "edge", "safari"]) {
                await expect(
                    session.start({ "browser": browser, "mode": "headless" }),
                ).rejects.toThrow(`Browser "${browser}" is not yet supported.`);
            }
        });

        it("calls remote() without goog:chromeOptions when mode is 'visual'", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome", "mode": "visual" });

            const call = vi.mocked(remote).mock.calls[0][0] as {
                capabilities: Record<string, unknown>;
            };

            expect(call.capabilities["goog:chromeOptions"]).toBeUndefined();
        });

        it("sets wdio:chromedriverOptions.binary to CHROMEDRIVER_PATH when that env var is set", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);
            vi.stubEnv("CHROMEDRIVER_PATH", "/usr/bin/chromedriver");

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });

            expect(remote).toHaveBeenCalledWith(
                expect.objectContaining({
                    "capabilities": expect.objectContaining({
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        "wdio:chromedriverOptions": expect.objectContaining({
                            "binary": "/usr/bin/chromedriver",
                        }),
                    }),
                }),
            );
        });

        it("does not set wdio:chromedriverOptions when CHROMEDRIVER_PATH is not set", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);
            vi.stubEnv("CHROMEDRIVER_PATH", "");

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });

            const call = vi.mocked(remote).mock.calls[0][0] as {
                capabilities: Record<string, unknown>;
            };

            expect(call.capabilities["wdio:chromedriverOptions"]).toBeUndefined();
        });

        it("sets goog:chromeOptions.binary to CHROME_PATH when that env var is set", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);
            vi.stubEnv("CHROME_PATH", "/usr/bin/google-chrome-stable");

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });

            expect(remote).toHaveBeenCalledWith(
                expect.objectContaining({
                    "capabilities": expect.objectContaining({
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        "goog:chromeOptions": expect.objectContaining({
                            "binary": "/usr/bin/google-chrome-stable",
                        }),
                    }),
                }),
            );
        });

        it("does not set goog:chromeOptions.binary when CHROME_PATH is not set", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);
            vi.stubEnv("CHROME_PATH", "");

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome", "mode": "visual" });

            const call = vi.mocked(remote).mock.calls[0][0] as {
                capabilities: Record<string, unknown>;
            };

            // visual mode + no CHROME_PATH → no goog:chromeOptions at all
            expect(call.capabilities["goog:chromeOptions"]).toBeUndefined();
        });

        it("throws when mode is 'grid' but gridUrl is not provided", async () => {
            const session = new WDIOBrowserSession();

            await expect(session.start({ "browser": "chrome", "mode": "grid" })).rejects.toThrow(
                'gridUrl is required when mode is "grid".',
            );
        });

        it("calls remote() with hostname, port, and path when mode is 'grid'", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);

            const session = new WDIOBrowserSession();

            await session.start({
                "browser": "chrome",
                "mode":    "grid",
                "gridUrl": "http://grid.example.com:4444/wd/hub",
            });

            expect(remote).toHaveBeenCalledWith(
                expect.objectContaining({
                    "hostname": "grid.example.com",
                    "port":     4444,
                    "path":     "/wd/hub",
                }),
            );
        });
    });

    describe("end()", () => {
        it("calls deleteSession() on the driver", async () => {
            const session = await startedSession();

            await session.end();

            expect(mockDriver.deleteSession).toHaveBeenCalledOnce();
        });

        it("nulls driver even when deleteSession() rejects", async () => {
            const session = await startedSession();

            mockDriver.deleteSession.mockRejectedValue(new Error("Session closed unexpectedly"));

            await expect(session.end()).rejects.toThrow("Session closed unexpectedly");
            expect(session.driver).toBeNull();
        });

        it("does not throw if called before start()", async () => {
            const session = new WDIOBrowserSession();

            await expect(session.end()).resolves.not.toThrow();
        });

        it("clears tabs after end()", async () => {
            const session = await startedSession();

            await session.end();

            expect(session.tabs).toHaveLength(0);
        });

        it("sets activeTab to null after end()", async () => {
            const session = await startedSession();

            await session.end();

            expect(session.activeTab).toBeNull();
        });
    });

    describe("tabs and activeTab", () => {
        it("has one tab and a non-null activeTab after start()", async () => {
            const session = await startedSession();

            expect(session.tabs).toHaveLength(1);
            expect(session.activeTab).not.toBeNull();
        });

        it("activeTab has the handle returned by getWindowHandle() after start()", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);
            mockDriver.getWindowHandle.mockResolvedValue("initial-handle");

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });

            expect(session.activeTab?.handle).toBe("initial-handle");
        });
    });

    describe("openTab()", () => {
        let session: WDIOBrowserSession;

        beforeEach(async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);
            mockDriver.getWindowHandle
                .mockResolvedValueOnce("handle-0")
                .mockResolvedValueOnce("handle-1");

            session = new WDIOBrowserSession();
            await session.start({ "browser": "chrome" });
        });

        it("increases tabs.length by one", async () => {
            await session.openTab();

            expect(session.tabs).toHaveLength(2);
        });

        it("makes the new tab active", async () => {
            await session.openTab();

            expect(session.activeTab?.handle).toBe("handle-1");
        });

        it("stores the name when one is provided", async () => {
            await session.openTab("my-tab");

            expect(session.activeTab?.name).toBe("my-tab");
        });

        it("stores no name property when none is provided", async () => {
            await session.openTab();

            expect(session.activeTab).not.toHaveProperty("name");
        });
    });
});

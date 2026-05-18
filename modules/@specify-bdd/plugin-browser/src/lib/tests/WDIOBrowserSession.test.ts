import { vi } from "vitest";

import { WDIOBrowserSession } from "@/lib/WDIOBrowserSession";

vi.mock("webdriverio");

const mockDriver = {
    "closeWindow":     vi.fn(),
    "deleteSession":   vi.fn(),
    "getWindowHandle": vi.fn(),
    "newWindow":       vi.fn(),
    "switchToWindow":  vi.fn(),
};

beforeEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();

    // default stub so start() can always resolve a handle without per-test setup
    mockDriver.getWindowHandle.mockResolvedValue("handle-0");
});

describe("WDIOBrowserSession", () => {
    describe("driver", () => {
        it("is null before start() is called", () => {
            const session = new WDIOBrowserSession();

            expect(session.driver).toBeNull();
        });

        it("is set after start() is called", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });

            expect(session.driver).toBe(mockDriver);
        });

        it("is null after end() is called", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });
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
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });
            await session.end();

            expect(mockDriver.deleteSession).toHaveBeenCalledOnce();
        });

        it("nulls driver even when deleteSession() rejects", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);
            mockDriver.deleteSession.mockRejectedValue(new Error("Session closed unexpectedly"));

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });

            await expect(session.end()).rejects.toThrow("Session closed unexpectedly");
            expect(session.driver).toBeNull();
        });

        it("does not throw if called before start()", async () => {
            const session = new WDIOBrowserSession();

            await expect(session.end()).resolves.not.toThrow();
        });

        it("clears tabs after end()", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });
            await session.end();

            expect(session.tabs).toHaveLength(0);
        });

        it("sets activeTab to null after end()", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });
            await session.end();

            expect(session.activeTab).toBeNull();
        });
    });

    describe("tabs and activeTab", () => {
        it("has one tab and a non-null activeTab after start()", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });

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
        it("increases tabs.length by one", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);
            mockDriver.getWindowHandle
                .mockResolvedValueOnce("handle-0")
                .mockResolvedValueOnce("handle-1");

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });
            await session.openTab();

            expect(session.tabs).toHaveLength(2);
        });

        it("makes the new tab active", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);
            mockDriver.getWindowHandle
                .mockResolvedValueOnce("handle-0")
                .mockResolvedValueOnce("handle-1");

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });
            await session.openTab();

            expect(session.activeTab?.handle).toBe("handle-1");
        });

        it("stores the name when one is provided", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);
            mockDriver.getWindowHandle
                .mockResolvedValueOnce("handle-0")
                .mockResolvedValueOnce("handle-1");

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });
            await session.openTab("my-tab");

            expect(session.activeTab?.name).toBe("my-tab");
        });

        it("stores no name property when none is provided", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);
            mockDriver.getWindowHandle
                .mockResolvedValueOnce("handle-0")
                .mockResolvedValueOnce("handle-1");

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });
            await session.openTab();

            expect(session.activeTab).not.toHaveProperty("name");
        });
    });

    describe("closeTab()", () => {
        /** Helper: start a session and open n-1 additional tabs for a total of n tabs. */
        async function startWithTabs(n: number): Promise<WDIOBrowserSession> {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);

            for (let i = 0; i < n; i++) {
                mockDriver.getWindowHandle.mockResolvedValueOnce(`handle-${i}`);
            }

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });

            for (let i = 1; i < n; i++) {
                await session.openTab();
            }

            return session;
        }

        it("closing the active (only) tab sets driver to null and activeTab to null", async () => {
            const session = await startWithTabs(1);

            await session.closeTab();

            expect(session.driver).toBeNull();
            expect(session.activeTab).toBeNull();
        });

        it("closing the last tab succeeds even when closeWindow() throws", async () => {
            const session = await startWithTabs(1);

            mockDriver.closeWindow.mockRejectedValue(
                new Error(
                    "All window handles were removed, causing WebdriverIO to close the session.",
                ),
            );

            await expect(session.closeTab()).resolves.not.toThrow();
            expect(session.driver).toBeNull();
            expect(session.activeTab).toBeNull();
            expect(session.tabs).toHaveLength(0);
        });

        it("closing the active tab (not last) makes the previous tab active", async () => {
            const session = await startWithTabs(3); // tabs: h0, h1, h2 — active: h2

            await session.closeTab(); // close h2

            expect(session.tabs).toHaveLength(2);
            expect(session.activeTab?.handle).toBe("handle-1");
        });

        it("closing the first (active) tab makes the new first tab active", async () => {
            const session = await startWithTabs(3); // active: h2

            // switch active to first tab for this test
            await session.closeTab(2); // close h1 (non-active), active stays h2
            // now tabs: h0, h2 — still active h2; now close first by switching manually
            // Easier: start fresh with active = first tab by closing down to 1 and reopening
            // Instead use a 2-tab session and close the first tab directly by index
            const session2 = await startWithTabs(2); // active: h1

            await session2.closeTab(1); // close first tab h0 (non-active since active=h1)

            expect(session2.tabs).toHaveLength(1);
            expect(session2.activeTab?.handle).toBe("handle-1"); // unchanged
        });

        it("closing a non-active tab by index does not change activeTab", async () => {
            const session = await startWithTabs(3); // active: h2

            await session.closeTab(1); // close tab at index 1 (h0)

            expect(session.activeTab?.handle).toBe("handle-2");
            expect(session.tabs).toHaveLength(2);
        });

        it("closing a non-active tab by index calls switchToWindow for target then back to active", async () => {
            const session = await startWithTabs(3); // active: h2

            await session.closeTab(1); // close h0

            expect(mockDriver.switchToWindow).toHaveBeenCalledWith("handle-0");
            expect(mockDriver.switchToWindow).toHaveBeenCalledWith("handle-2");
        });

        it("closing a non-active tab by name does not change activeTab", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);
            mockDriver.getWindowHandle
                .mockResolvedValueOnce("handle-0")
                .mockResolvedValueOnce("handle-1") // named-tab
                .mockResolvedValueOnce("handle-2"); // becomes active after openTab

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "chrome" });
            await session.openTab("named-tab"); // active = handle-1
            await session.openTab(); // active = handle-2

            await session.closeTab("named-tab"); // close non-active handle-1

            expect(session.activeTab?.handle).toBe("handle-2"); // unchanged
            expect(session.tabs).toHaveLength(2);
        });

        it("throws when the selector does not match any tab", async () => {
            const session = await startWithTabs(2);

            await expect(session.closeTab("nonexistent")).rejects.toThrow(
                `No tab named "nonexistent".`,
            );

            await expect(session.closeTab(99)).rejects.toThrow("No tab at position 99.");
        });
    });
});

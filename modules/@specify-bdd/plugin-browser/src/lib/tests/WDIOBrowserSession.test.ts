import { vi } from "vitest";

import { WDIOBrowserSession } from "@/lib/WDIOBrowserSession";

vi.mock("webdriverio");

const mockDriver = {
    "deleteSession": vi.fn(),
};

beforeEach(() => {
    vi.resetAllMocks();
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
                            "args": expect.arrayContaining(["--headless"]),
                        }),
                    }),
                }),
            );
        });

        it("forwards the browser name to the browserName capability", async () => {
            const { remote } = await import("webdriverio");

            vi.mocked(remote).mockResolvedValue(mockDriver as never);

            const session = new WDIOBrowserSession();

            await session.start({ "browser": "firefox" });

            expect(remote).toHaveBeenCalledWith(
                expect.objectContaining({
                    "capabilities": expect.objectContaining({
                        "browserName": "firefox",
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
                            "args": expect.arrayContaining(["--headless"]),
                        }),
                    }),
                }),
            );
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

        it("does not throw if called before start()", async () => {
            const session = new WDIOBrowserSession();

            await expect(session.end()).resolves.not.toThrow();
        });
    });
});

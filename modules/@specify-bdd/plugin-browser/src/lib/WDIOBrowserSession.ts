/**
 * WDIO Browser Session Module
 *
 * A WebdriverIO-backed implementation of the BrowserSession interface,
 * using WDIO's standalone mode to manage browser lifecycle.
 */

import assert from "node:assert/strict";

import { remote            } from "webdriverio";
import type { Capabilities } from "@wdio/types";

import type { BrowserSession, BrowserSessionStartOptions } from "@/lib/BrowserSession";

/**
 * A browser session managed via WebdriverIO in standalone mode.
 */
export class WDIOBrowserSession implements BrowserSession {
    /**
     * The underlying WebdriverIO browser instance, or null if the session
     * has not been started (or has already been ended).
     */
    #driver: WebdriverIO.Browser | null = null;

    /**
     * The underlying WebdriverIO browser instance.
     *
     * @returns The browser instance, or `null` if not active.
     */
    get driver(): WebdriverIO.Browser | null {
        return this.#driver;
    }

    /**
     * Start the browser session.
     *
     * @param opts - Options controlling how the session is started
     */
    async start(opts: BrowserSessionStartOptions = {}): Promise<void> {
        this.#driver = await remote(this.#buildOptions(opts));
    }

    /**
     * End the browser session and release all associated resources.
     */
    async end(): Promise<void> {
        try {
            await this.#driver?.deleteSession();
        } finally {
            this.#driver = null;
        }
    }

    /**
     * Navigate the active browser tab to the given URL.
     *
     * @param url - The URL to navigate to
     */
    async navigateTo(url: URL): Promise<void> {
        await this.#driver!.url(url.href);
    }

    /**
     * Return the current URL of the active browser tab.
     */
    async getURL(): Promise<string> {
        return this.#driver!.getUrl();
    }

    /**
     * Build a WDIO RemoteOptions object from the given session start options.
     *
     * @param opts - The session start options
     *
     * @returns The WDIO RemoteOptions
     */
    #buildOptions({
        browser = "chrome",
        mode = "headless",
        gridUrl,
    }: BrowserSessionStartOptions): Capabilities.WebdriverIOConfig {
        const capabilities: WebdriverIO.Capabilities = { "browserName": browser };

        switch (browser) {
            case "chrome":
                this.#buildChromeCapabilities(capabilities, mode);
                break;

            case "firefox":
            case "edge":
            case "safari":
                throw new Error(`Browser "${browser}" is not yet supported.`);
        }

        const opts: Capabilities.WebdriverIOConfig = { capabilities, "logLevel": "error" };

        if (mode === "grid") {
            assert.ok(gridUrl, 'gridUrl is required when mode is "grid".');

            const url = new URL(gridUrl);
            opts.hostname = url.hostname;
            opts.port = parseInt(url.port, 10) || (url.protocol === "https:" ? 443 : 80);
            opts.path = url.pathname;
        }

        return opts;
    }

    /**
     * Populate Chrome-specific capability keys on the given capabilities object.
     *
     * Sets `wdio:chromedriverOptions.binary` when `CHROMEDRIVER_PATH` is set,
     * and builds `goog:chromeOptions` (args for headless mode, binary for
     * `CHROME_PATH`) when either condition applies.
     *
     * @param capabilities - The capabilities object to mutate
     * @param mode         - The session mode controlling headless args
     */
    #buildChromeCapabilities(
        capabilities: WebdriverIO.Capabilities,
        mode: BrowserSessionStartOptions["mode"],
    ): void {
        const chromedriverPath = process.env["CHROMEDRIVER_PATH"];
        const chromePath       = process.env["CHROME_PATH"];

        if (chromedriverPath) {
            capabilities["wdio:chromedriverOptions"] = { "binary": chromedriverPath };
        }

        const chromeOptions: Record<string, unknown> = {};

        if (mode === "headless") {
            chromeOptions["args"] = ["--headless", "--disable-gpu", "--no-sandbox"];
        }

        if (chromePath) {
            chromeOptions["binary"] = chromePath;
        }

        if (Object.keys(chromeOptions).length > 0) {
            capabilities["goog:chromeOptions"] = chromeOptions;
        }
    }
}

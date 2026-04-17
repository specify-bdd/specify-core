/**
 * WDIO Browser Session Module
 *
 * A WebdriverIO-backed implementation of the BrowserSession interface,
 * using WDIO's standalone mode to manage browser lifecycle.
 */

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
        await this.#driver?.deleteSession();
        this.#driver = null;
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
            case "chrome": {
                const chromedriverPath = process.env["CHROMEDRIVER_PATH"];

                if (chromedriverPath) {
                    capabilities["wdio:chromedriverOptions"] = { "binary": chromedriverPath };
                }

                if (mode === "headless") {
                    capabilities["goog:chromeOptions"] = {
                        "args": ["--headless", "--disable-gpu", "--no-sandbox"],
                    };
                }

                break;
            }
        }

        const opts: Capabilities.WebdriverIOConfig = { capabilities, "logLevel": "error" };

        if (mode === "grid" && gridUrl) {
            const url = new URL(gridUrl);
            opts.hostname = url.hostname;
            opts.port = parseInt(url.port, 10) || (url.protocol === "https:" ? 443 : 80);
            opts.path = url.pathname;
        }

        return opts;
    }
}

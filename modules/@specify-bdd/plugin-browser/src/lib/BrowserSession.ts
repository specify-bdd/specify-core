/**
 * Browser Session Interface Module
 *
 * Defines the interface for a managed browser session, providing a
 * webdriver-agnostic abstraction for browser lifecycle management.
 */

/**
 * The browser execution mode.
 */
export type BrowserMode = "headless" | "visual" | "grid";

/**
 * Options for starting a browser session.
 */
export interface BrowserSessionStartOptions {
    /**
     * The name of the browser to launch (e.g. `"chrome"`, `"firefox"`).
     */
    browser?: string;

    /**
     * The browser execution mode.
     */
    mode?: BrowserMode;

    /**
     * The URL of the Selenium Grid to connect to. Only applicable when
     * `mode` is `"grid"`.
     */
    gridUrl?: string;
}

/**
 * A managed browser session.
 */
export interface BrowserSession {
    /**
     * Start the browser session.
     *
     * @param opts - Options controlling how the session is started
     */
    start(opts?: BrowserSessionStartOptions): Promise<void>;

    /**
     * End the browser session and release all associated resources.
     */
    end(): Promise<void>;

    /**
     * Set the browser window size.
     *
     * @param width  - The desired window width in pixels
     * @param height - The desired window height in pixels
     */
    setWindowSize(width: number, height: number): Promise<void>;

    /**
     * Get the current browser window size.
     *
     * @returns The current window dimensions in pixels
     */
    getWindowSize(): Promise<{ width: number; height: number }>;
}

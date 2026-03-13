import { QuickRef } from "@specify-bdd/quick-ref";

import { World } from "@cucumber/cucumber";
import waitFor   from "@/lib/waitFor";

import type { IWorldOptions  } from "@cucumber/cucumber";
import type { WaitForOptions } from "@/lib/waitFor";
import type { CoreConfig     } from "~/types";

/**
 * Specify's custom Cucumber World class
 */
export class SpecifyWorld extends World {
    #quickRef: QuickRef;

    config: CoreConfig;

    /**
     * Constructor override which adds a QuickRef handle to the world instance.
     *
     * @param opts - Options to pass through to the base World class constructor
     */
    constructor(opts: IWorldOptions) {
        super(opts);

        this.#quickRef = new QuickRef();
    }

    /**
     * Read-only property storing the QuickRef instance
     */
    get quickRef(): QuickRef {
        return this.#quickRef;
    }

    /**
     * Wrapper for waitFor() with project-specific defaults.
     * See {@link waitFor} for details
     */
    async waitFor(
        predicate: () => boolean | Promise<boolean>,
        options?: WaitForOptions,
    ): Promise<void> {
        return waitFor(predicate, { "timeout": this.config.time.implicitWait, ...options });
    }
}

export default SpecifyWorld;

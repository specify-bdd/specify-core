import { setWorldConstructor, World } from "@cucumber/cucumber";
import quickRef from "@specify/quick-ref";

import type { IWorldOptions } from "@cucumber/cucumber";
import type { QuickRef } from "@specify/quick-ref";

/**
 * Specify's custom Cucumber World class
 */
class SpecifyWorld extends World {
    #quickRef: QuickRef;

    /**
     * Constructor override which adds a QuickRef handle to the world instance.
     *
     * @param opts - Options to pass through to the base World class constructor
     */
    constructor(opts: IWorldOptions) {
        super(opts);

        this.#quickRef = quickRef;
    }

    get quickRef(): QuickRef {
        return this.#quickRef;
    }
}

setWorldConstructor(SpecifyWorld);

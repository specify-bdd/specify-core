import { setWorldConstructor, World } from "@cucumber/cucumber";
import { QuickRef                   } from "@specify/quick-ref";

import type { IWorldOptions } from "@cucumber/cucumber";

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

        this.#quickRef = new QuickRef();
    }

    get quickRef(): QuickRef {
        return this.#quickRef;
    }
}

setWorldConstructor(SpecifyWorld);

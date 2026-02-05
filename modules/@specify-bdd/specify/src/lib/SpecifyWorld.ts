import { QuickRef } from "@specify-bdd/quick-ref";

import { World } from "@cucumber/cucumber";

import type { IWorldOptions } from "@cucumber/cucumber";

/**
 * Specify's custom Cucumber World class
 */
export class SpecifyWorld extends World {
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

    /**
     * Read-only property storing the QuickRef instance
     */
    get quickRef(): QuickRef {
        return this.#quickRef;
    }
}

export default SpecifyWorld;

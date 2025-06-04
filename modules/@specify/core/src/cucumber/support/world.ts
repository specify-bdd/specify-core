import { setWorldConstructor, World } from "@cucumber/cucumber";
import * as refs from "@specify/quick-ref";

import type { IWorldOptions } from "@cucumber/cucumber";
import type { QuickRef } from "@specify/quick-ref";

/**
 * Specify's custom Cucumber World class
 */
class SpecifyWorld extends World {
    #quickRef: QuickRef;
    #userPath: string;

    /**
     * Constructor override which adds a QuickRef handle to the world instance.
     *
     * @param opts - Options to pass through to the base World class constructor
     */
    constructor(opts: IWorldOptions) {
        super(opts);

        this.#quickRef = refs;
        this.#userPath = opts.parameters.userPath;
    }

    public get quickRef(): QuickRef {
        return this.#quickRef;
    }

    public get userPath(): string {
        return this.#userPath;
    }
}

setWorldConstructor(SpecifyWorld);

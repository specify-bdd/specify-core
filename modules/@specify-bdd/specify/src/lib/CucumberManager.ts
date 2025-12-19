import assert from "node:assert";

import type { Given, When, Then } from "@cucumber/cucumber";

export interface CucumberLike {
    Given: typeof Given;
    When: typeof When;
    Then: typeof Then;
}

export interface StepDefOptions {
    timeout?: number;
}

export type StepDefPattern = RegExp | string;

let instance: CucumberManager;

/**
 * A wrapper for Cucumber which streamlines, enhances, and enforces consistency
 * of Cucumber usage throughout Specify.
 */
export class CucumberManager {
    /**
     * The managed Cucumber object.
     */
    cucumber: CucumberLike;

    /**
     * Accept a Cucumber object and store it for easy access.
     *
     * @param cucumber - The Cucumber object to manage
     */
    constructor(cucumber: CucumberLike) {
        this.cucumber = cucumber;
    }

    /**
     * Register a new step definition with the managed Cucumber instance.
     *
     * @param pattern - The pattern(s) to match steps against
     * @param handler - A handler function containing code to execute when a
     *                  pattern matches a step
     * @param options - Options for Cucumber
     *
     * @returns This cucumber manager
     */
    defineStep(
        pattern: Array<StepDefPattern> | StepDefPattern,
        handler: () => void,
        options: StepDefOptions = {},
    ): CucumberManager {
        const patternList = Array.isArray(pattern) ? pattern : [pattern];

        for (let i = 0; i < patternList.length; i++) {
            let patternKey, patternParsed;

            if (typeof patternList[i] === "string") {
                const raw   = patternList[i] as string;
                const match = raw.match(/^(Given|When|Then) /);
                assert(match, `Invalid pattern expression: ${raw}`);

                patternKey = match[1];
                patternParsed = raw.slice(match[0].length);
            } else {
                const raw   = patternList[i].toString();
                const match = raw.match(/^\/\^?(Given|When|Then) /);
                assert(match, `Invalid pattern expression: ${raw}`);

                const endIndex = raw.lastIndexOf("/");
                const trimmed  = raw.slice(match[0].length, endIndex);

                patternKey = match[1];
                patternParsed = new RegExp(trimmed, raw.slice(endIndex + 1));
            }

            switch (patternKey) {
                case "Given":
                    this.cucumber.Given(patternParsed, options, handler);
                    break;
                case "When":
                    this.cucumber.When(patternParsed, options, handler);
                    break;
                case "Then":
                    this.cucumber.Then(patternParsed, options, handler);
                    break;
            }
        }

        return this;
    }

    /**
     * Get the singleton instance of CucumberManager.
     *
     * @param cucumber - The Cucumber object to manage
     *
     * @returns The CucumberManager instance
     */
    static getInstance(cucumber: CucumberLike): CucumberManager {
        if (!instance) {
            instance = new CucumberManager(cucumber);
        }

        return instance;
    }
}

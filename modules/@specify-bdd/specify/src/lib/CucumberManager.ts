import assert from "node:assert";

import type { Given, When, Then } from "@cucumber/cucumber";

export interface CucumberLike {
    Given: typeof Given;
    When: typeof When;
    Then: typeof Then;
}

interface ExpressionVariant {
    keyword: string;
    pattern: RegExp | string;
}

interface ManagerOptions {
    subjects?: string[];
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
     * A list of step definition subjects which may be used.
     */
    subjects: string[];

    /**
     * Accept a Cucumber object and store it for easy access.
     *
     * @param cucumber - The Cucumber object to manage
     */
    constructor(cucumber: CucumberLike, options: ManagerOptions = {}) {
        this.cucumber = cucumber;
        this.subjects = options.subjects ?? [];
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
            const variants = [];

            if (typeof patternList[i] === "string") {
                variants.push(...this.#parseEnhancedExpressionVariants(patternList[i] as string));
            } else {
                variants.push(...this.#parseRegularExpressionVariants(patternList[i] as RegExp));
            }

            for (const variant of variants) {
                switch (variant.keyword) {
                    case "Given":
                        this.cucumber.Given(variant.pattern, options, handler);
                        break;
                    case "When":
                        this.cucumber.When(variant.pattern, options, handler);
                        break;
                    case "Then":
                        this.cucumber.Then(variant.pattern, options, handler);
                        break;
                    default:
                        assert.fail(`Invalid pattern keyword: ${variant.keyword}.`);
                }
            }
        }

        return this;
    }

    /**
     * Parse a string as an enhanced expression and return a list of pattern
     * variants to feed into Cucumber.
     *
     * @param expression - The enhanced expression to parse.
     *
     * @returns The list of parsed pattern variants.
     */
    #parseEnhancedExpressionVariants(expression: string): ExpressionVariant[] {
        const match = expression.match(/^(Given|When|Then) /);
        assert(match, `Invalid pattern expression: ${expression}`);

        const keyword = match[1];
        const trimmed = expression.slice(match[0].length);

        return this.#parseEnhancedNotation(trimmed).map((variant) => {
            return { keyword, "pattern": variant };
        });
    }

    /**
     * Recursively process enhanced expression notation denoted by brackets.
     *
     * @param phrase - The phrase to parse for enhanced notation
     *
     * @returns A list of variants derived from the parsed phrase.
     */
    #parseEnhancedNotation(phrase: string): string[] {
        const match = phrase.match(/\[(.*)\]/);

        // if no enhanced notation is found, just return the phrase
        if (!match) {
            return [phrase];
        }

        // enhanced notation was found, now we need to parse it
        const enhanced  = match[0];
        const subphrase = match[1];

        // first, ensure that the enhanced syntax isn't being nested
        if (subphrase.match(/\[(.*)\]/)) {
            assert.fail("Enhanced expression brackets can't be nested.");
        }

        let variants = [subphrase];

        // next, process alternates (/)
        variants = variants.flatMap((variant) => variant.split("/"));

        // then, look for known subjects and make them optional
        variants = variants.flatMap((variant) => {
            // TODO: what should we do to make these subjects more manageable/configurable?
            for (const subject of this.subjects) {
                variant = variant.replace(`${subject} `, `(${subject} )`);
            }

            return variant;
        });

        // finally, substitute every variant back into the original phrase
        return variants.map((variant) => phrase.replace(enhanced, variant));
    }

    /**
     * Parse a regular expression and return a list of pattern variants to feed
     * into Cucumber.  (This will always be a list with one item, but doing this
     * keeps consistency with the enhanced expression parser.)
     *
     * @param expression - The regular expression to parse.
     *
     * @returns The list of parsed pattern variants.
     */
    #parseRegularExpressionVariants(expression: RegExp): ExpressionVariant[] {
        const raw   = expression.toString();
        const match = raw.match(/^\/\^?(Given|When|Then) /);
        assert(match, `Invalid pattern expression: ${raw}`);

        const endIndex = raw.lastIndexOf("/");
        const trimmed  = raw.slice(match[0].length, endIndex);

        return [
            {
                "keyword": match[1],
                "pattern": new RegExp(trimmed, raw.slice(endIndex + 1)),
            },
        ];
    }

    /**
     * Get the singleton instance of CucumberManager.
     *
     * @param cucumber - The Cucumber object to manage
     *
     * @returns The CucumberManager instance
     */
    static getInstance(cucumber: CucumberLike, options: ManagerOptions): CucumberManager {
        if (!instance) {
            instance = new CucumberManager(cucumber, options);
        }

        return instance;
    }
}

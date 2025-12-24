import Cucumber from "@cucumber/cucumber";

import { config          } from "@/config/all";
import { CucumberManager } from "@/lib/CucumberManager";

import type { StepDefOptions, StepDefPattern } from "@/lib/CucumberManager";

const cm = CucumberManager.getInstance(Cucumber, {
    "subjects": config.content.specifications.subjects,
});

/**
 * Register a new step definition with Specify.
 *
 * @param pattern - The pattern(s) to match steps against
 * @param handler - A handler function containing code to execute when a pattern
 *                  matches a step
 * @param options - Options for Cucumber
 */
export function defineStep(
    pattern: Array<StepDefPattern> | StepDefPattern,
    handler: () => void,
    options: StepDefOptions = {},
): void {
    cm.defineStep(pattern, handler, options);
}

export default { defineStep };

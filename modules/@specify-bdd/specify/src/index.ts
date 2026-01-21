import * as Cucumber from "@cucumber/cucumber";

import { config          } from "@/config/all";
import { CucumberManager } from "@/lib/CucumberManager";

import type {
    ParamTypeOptions,
    StepDefOptions,
    StepDefPattern,
    WorldLike,
} from "@/lib/CucumberManager";

const cm = CucumberManager.getInstance(Cucumber, {
    "subjects": config.content.specifications.subjects,
});

/**
 * Register a new parameter type with Specify.
 *
 * @param options - The param options
 */
export function defineParamType(options: ParamTypeOptions): void {
    cm.defineParamType(options);
}

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

/**
 * Register a custom world constructor with Specify.
 *
 * @remarks
 * It is STRONGLY recommended that your custom world extends the default Specify
 * world and calls super() in its constructor.
 *
 * @param world - A custom world
 */
export function defineWorld(world: WorldLike): void {
    cm.defineWorld(world);
}

export default { defineParamType, defineStep, defineWorld };

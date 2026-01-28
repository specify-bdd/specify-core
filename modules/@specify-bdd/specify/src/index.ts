import * as Cucumber from "@cucumber/cucumber";

import { config } from "@/config/all";

import { CucumberManager, Hook } from "@/lib/CucumberManager";

import type {
    HookHandler,
    HookOptions,
    ParamTypeOptions,
    StepDefHandler,
    StepDefOptions,
    StepDefPattern,
    WorldLike,
} from "@/lib/CucumberManager";

export { Hook } from "@/lib/CucumberManager";

const cm = CucumberManager.getInstance(Cucumber, {
    "subjects": config.content.specifications.subjects,
});

/**
 * Register an AfterAll hook script with Specify.
 *
 * @see {@link CucumberManager.addAfterAllHook}
 *
 * @param handler - The handler function containing code to execute when the
 *                  hook triggers
 * @param options - Options for Cucumber
 */
export function addAfterAllHook(handler: HookHandler, options: HookOptions = {}): void {
    cm.addAfterAllHook(handler, options);
}

/**
 * Register an AfterScenario hook script with Specify.
 *
 * @see {@link CucumberManager.addAfterScenarioHook}
 *
 * @param handler - The handler function containing code to execute when the
 *                  hook triggers
 * @param options - Options for Cucumber
 */
export function addAfterScenarioHook(handler: HookHandler, options: HookOptions = {}): void {
    cm.addAfterScenarioHook(handler, options);
}

/**
 * Register an AfterStep hook script with Specify.
 *
 * @see {@link CucumberManager.addAfterStepHook}
 *
 * @param handler - The handler function containing code to execute when the
 *                  hook triggers
 * @param options - Options for Cucumber
 */
export function addAfterStepHook(handler: HookHandler, options: HookOptions = {}): void {
    cm.addAfterStepHook(handler, options);
}

/**
 * Register a BeforeAll hook script with Specify.
 *
 * @see {@link CucumberManager.addBeforeAllHook}
 *
 * @param handler - The handler function containing code to execute when the
 *                  hook triggers
 * @param options - Options for Cucumber
 */
export function addBeforeAllHook(handler: HookHandler, options: HookOptions = {}): void {
    cm.addBeforeAllHook(handler, options);
}

/**
 * Register a BeforeScenario hook script with Specify.
 *
 * @see {@link CucumberManager.addBeforeScenarioHook}
 *
 * @param handler - The handler function containing code to execute when the
 *                  hook triggers
 * @param options - Options for Cucumber
 */
export function addBeforeScenarioHook(handler: HookHandler, options: HookOptions = {}): void {
    cm.addBeforeScenarioHook(handler, options);
}

/**
 * Register a BeforeStep hook script with Specify.
 *
 * @see {@link CucumberManager.addBeforeStepHook}
 *
 * @param handler - The handler function containing code to execute when the
 *                  hook triggers
 * @param options - Options for Cucumber
 */
export function addBeforeStepHook(handler: HookHandler, options: HookOptions = {}): void {
    cm.addBeforeStepHook(handler, options);
}

/**
 * Register a hook script with Specify.
 *
 * @see {@link CucumberManager.addHook}
 *
 * @param stage   - The stage to hook into; valid values are available under the
 *                  named export `Hook`
 * @param handler - The handler function containing code to execute when the
 *                  hook triggers
 * @param options - Options for Cucumber
 */
export function addHook(stage: Hook, handler: HookHandler, options: HookOptions = {}): void {
    cm.addHook(stage, handler, options);
}

/**
 * Register a new parameter type with Specify.
 *
 * @see {@link CucumberManager.defineParamType}
 *
 * @param options - The param options
 */
export function defineParamType(options: ParamTypeOptions): void {
    cm.defineParamType(options);
}

/**
 * Register a new step definition with Specify.
 *
 * @see {@link CucumberManager.defineStep}
 *
 * @param pattern - The pattern(s) to match steps against
 * @param handler - A handler function containing code to execute when a pattern
 *                  matches a step
 * @param options - Options for Cucumber
 */
export function defineStep(
    pattern: Array<StepDefPattern> | StepDefPattern,
    handler: StepDefHandler,
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
 * @see {@link CucumberManager.defineWorld}
 *
 * @param world - A custom world
 */
export function setWorld(world: WorldLike): void {
    cm.setWorld(world);
}

export default { defineParamType, defineStep, Hook, setWorld };

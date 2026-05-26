import path              from "node:path";
import { pathToFileURL } from "node:url";

import { globby } from "globby";

const MODULE_GLOB = "**/*.{js,ts,mjs,cjs}";

const defaultLoader: ModuleLoader = {
    "glob": (pattern) =>
        globby(pattern, {
            "absolute":  true,
            "ignore":    ["**/*.d.{ts,mts,cts}", "**/register/**"],
            "onlyFiles": true,
        }),
    "loadModule": (modulePath) => import(pathToFileURL(modulePath).href),
};

/**
 * Shape every cucumber module under `cucumber/` must conform to.
 */
interface RegisterableModule {
    register: () => void | Promise<void>;
}

/**
 * Injection point for {@link registerSupportCode} so tests can avoid disk I/O.
 */
export interface ModuleLoader {
    glob: (pattern: string) => Promise<string[]>;
    loadModule: (modulePath: string) => Promise<unknown>;
}

/**
 * Glob and invoke `register()` on every cucumber module under the package's
 * `cucumber/` directory, except modules under `cucumber/register/`.
 *
 * @remarks
 * Modules are imported and registered in sorted path order to guarantee
 * a consistent, deterministic registration sequence.  This is critical for
 * Cucumber's parallel mode: workers assign step-definition IDs by index
 * position, so every process (main + workers) must produce the same ordering
 * or IDs will be mismatched and expression matching will fail.
 *
 * @param registerScriptDir - The absolute path of the directory containing
 *                            the package's `register` script (typically passed
 *                            as `import.meta.dirname`).
 * @param loader            - Optional injection point for the glob and module
 *                            loader. Defaults to real-filesystem implementations.
 *                            Tests pass a fake to avoid touching disk.
 *
 * @throws Error
 * If any module under `cucumber/` (outside `cucumber/register/`) lacks an
 * exported `register` function.
 */
export async function registerSupportCode(
    registerScriptDir: string,
    loader: ModuleLoader = defaultLoader,
): Promise<void> {
    const cucumberDir = path.dirname(registerScriptDir);

    const modulePaths = (await loader.glob(path.join(cucumberDir, MODULE_GLOB))).sort();

    for (const modulePath of modulePaths) {
        const mod = (await loader.loadModule(modulePath)) as Partial<RegisterableModule>;

        if (typeof mod.register !== "function") {
            throw new Error(
                `Cucumber module at ${modulePath} does not export a register() function.`,
            );
        }

        await mod.register();
    }
}

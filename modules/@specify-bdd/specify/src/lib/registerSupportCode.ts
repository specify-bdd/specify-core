import path              from "node:path";
import { pathToFileURL } from "node:url";

import { globby } from "globby";

const MODULE_GLOB   = "*.{js,ts,mjs,cjs}";
const SUPPORT_DIR   = "support";
const STEP_DEFS_DIR = "step_definitions";

const defaultLoader: ModuleLoader = {
    "glob":       (pattern) => globby(pattern, { "absolute": true, "onlyFiles": true }),
    "loadModule": (modulePath) => import(pathToFileURL(modulePath).href),
};

/**
 * Shape every cucumber module under `support/` or `step_definitions/` must
 * conform to.
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
 * Glob and invoke `register()` on every cucumber module sibling in
 * the given register-script directory.
 *
 * @remarks
 * Loads `support/*` first (so parameter types exist before any step pattern
 * references them), then `step_definitions/*`. Within each directory, modules
 * are imported and registered in parallel; order is not significant within a
 * single directory.
 *
 * @param registerScriptDir - The absolute path of the directory containing
 *                            the package's `register` script (typically passed
 *                            as `import.meta.dirname`).
 * @param loader            - Optional injection point for the glob and module
 *                            loader. Defaults to real-filesystem implementations.
 *                            Tests pass a fake to avoid touching disk.
 *
 * @throws Error
 * If any sibling module under `support/` or `step_definitions/` lacks an
 * exported `register` function.
 */
export async function registerSupportCode(
    registerScriptDir: string,
    loader: ModuleLoader = defaultLoader,
): Promise<void> {
    const cucumberDir = path.dirname(registerScriptDir);

    await registerModules(path.join(cucumberDir, SUPPORT_DIR), loader);
    await registerModules(path.join(cucumberDir, STEP_DEFS_DIR), loader);
}

/**
 * Glob directory for registerable modules, then dynamically import each module
 * and invoke its `register()` export.
 * 
 * @remarks
 * Modules within `dir` are loaded and registered in parallel via `Promise.all`.
 *
 * @param dir    - The absolute path of the directory to scan.
 * @param loader - The glob and module-import implementations to use.
 *
 * @throws Error
 * If any module under `dir` lacks an exported `register` function.
 */
async function registerModules(dir: string, loader: ModuleLoader): Promise<void> {
    const modulePaths = await loader.glob(path.join(dir, MODULE_GLOB));

    await Promise.all(
        modulePaths.map(async (modulePath) => {
            const mod = (await loader.loadModule(modulePath)) as Partial<RegisterableModule>;

            if (typeof mod.register !== "function") {
                throw new Error(
                    `Cucumber module at ${modulePath} does not export a register() function.`,
                );
            }

            await mod.register();
        }),
    );
}

import path from "node:path";

import { registerSupportCode } from "@/lib/CucumberRegistrar";

import type { ModuleLoader } from "@/lib/CucumberRegistrar";

const REGISTER_DIR = "/fake/cucumber/register";
const SUPPORT_DIR  = "/fake/cucumber/support";
const STEPDEFS_DIR = "/fake/cucumber/step_definitions";

describe("registerSupportCode", () => {
    let calls: string[];
    let modules: Map<string, unknown>;
    let loader: ModuleLoader;

    beforeEach(() => {
        calls = [];
        modules = new Map();

        loader = {
            "glob": vi.fn(async (pattern: string) => {
                const base = pattern.split("/**/")[0];

                return [...modules.keys()].filter((p) => p.startsWith(`${base}${path.sep}`));
            }),
            "loadModule": vi.fn(async (modulePath: string) => modules.get(modulePath) ?? {}),
        };
    });

    function addModule(dir: string, name: string, mod: unknown): string {
        const filePath = path.join(dir, `${name}.mjs`);

        modules.set(filePath, mod);

        return filePath;
    }

    function fakeModule(label: string) {
        return {
            "register": async () => {
                await Promise.resolve();
                calls.push(label);
            },
        };
    }

    test("invokes register() on every module in the cucumber directory", async () => {
        addModule(SUPPORT_DIR, "params", fakeModule("support"));
        addModule(STEPDEFS_DIR, "steps", fakeModule("stepdefs"));

        await registerSupportCode(REGISTER_DIR, loader);

        // step_definitions sorts before support, so "stepdefs" is called first
        expect(calls).toEqual(["stepdefs", "support"]);
    });

    test("invokes multiple modules within a single directory", async () => {
        addModule(SUPPORT_DIR, "first", fakeModule("first"));
        addModule(SUPPORT_DIR, "second", fakeModule("second"));

        await registerSupportCode(REGISTER_DIR, loader);

        expect(calls).toEqual(["first", "second"]);
    });

    test("invokes modules in sorted path order regardless of glob return order", async () => {
        // Add z_module first (so the glob mock returns it first), then a_module
        addModule(SUPPORT_DIR, "z_module", fakeModule("z_module"));
        addModule(SUPPORT_DIR, "a_module", fakeModule("a_module"));

        await registerSupportCode(REGISTER_DIR, loader);

        // a_module has a lower sorted path so it must be registered first
        expect(calls).toEqual(["a_module", "z_module"]);
    });

    test("throws when a module is missing a register export", async () => {
        const filePath = addModule(SUPPORT_DIR, "broken", { "notRegister": null });

        await expect(registerSupportCode(REGISTER_DIR, loader)).rejects.toThrow(
            `Cucumber module at ${filePath} does not export a register() function`,
        );
    });

    test("propagates errors thrown from register()", async () => {
        addModule(SUPPORT_DIR, "broken", {
            "register": () => {
                throw new Error("inner error");
            },
        });

        await expect(registerSupportCode(REGISTER_DIR, loader)).rejects.toThrow("inner error");
    });

    test("resolves cleanly when no modules are present", async () => {
        await expect(registerSupportCode(REGISTER_DIR, loader)).resolves.toBeUndefined();

        expect(calls).toEqual([]);
        expect(loader.loadModule).not.toHaveBeenCalled();
    });
});

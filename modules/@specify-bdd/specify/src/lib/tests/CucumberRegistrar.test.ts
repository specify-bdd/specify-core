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

        expect(calls.sort()).toEqual(["stepdefs", "support"]);
    });

    test("invokes multiple modules within a single directory", async () => {
        addModule(SUPPORT_DIR, "first", fakeModule("first"));
        addModule(SUPPORT_DIR, "second", fakeModule("second"));

        await registerSupportCode(REGISTER_DIR, loader);

        expect(calls.sort()).toEqual(["first", "second"]);
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

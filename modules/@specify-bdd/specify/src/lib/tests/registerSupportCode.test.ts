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
                const dir = path.dirname(pattern);

                return [...modules.keys()].filter((p) => path.dirname(p) === dir);
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

    test("invokes register() on every sibling support and step-definition module", async () => {
        addModule(SUPPORT_DIR, "params", fakeModule("support"));
        addModule(STEPDEFS_DIR, "steps", fakeModule("stepdefs"));

        await registerSupportCode(REGISTER_DIR, loader);

        expect(calls).toEqual(["support", "stepdefs"]);
    });

    test("awaits support modules before invoking step_definitions", async () => {
        addModule(SUPPORT_DIR, "params", fakeModule("support"));
        addModule(STEPDEFS_DIR, "steps", {
            "register": () => calls.push("stepdefs"),
        });

        await registerSupportCode(REGISTER_DIR, loader);

        expect(calls).toEqual(["support", "stepdefs"]);
    });

    test("invokes multiple modules within a single directory", async () => {
        addModule(SUPPORT_DIR, "first", fakeModule("first"));
        addModule(SUPPORT_DIR, "second", fakeModule("second"));

        await registerSupportCode(REGISTER_DIR, loader);

        expect(calls).toEqual(["first", "second"]);
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

    test("does not invoke step_definitions when a support module fails", async () => {
        addModule(SUPPORT_DIR, "broken", {
            "register": () => {
                throw new Error("nope");
            },
        });

        addModule(STEPDEFS_DIR, "steps", fakeModule("stepdefs"));

        await expect(registerSupportCode(REGISTER_DIR, loader)).rejects.toThrow();

        expect(calls).not.toContain("stepdefs");
    });

    test("resolves cleanly when no modules are present", async () => {
        await expect(registerSupportCode(REGISTER_DIR, loader)).resolves.toBeUndefined();

        expect(calls).toEqual([]);
        expect(loader.loadModule).not.toHaveBeenCalled();
    });
});

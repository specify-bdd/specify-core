import { CucumberManager } from "../CucumberManager";

import type { CucumberLike } from "../CucumberManager";

const cucumber: CucumberLike = {};

describe("CucumberManager", () => {
    describe("cucumber property", () => {
        it("returns a Cucumber-like object", () => {
            const cm = new CucumberManager(cucumber);

            expect(cm.cucumber).toBe(cucumber);
        });
    });

    describe("getInstance() static method", () => {
        it("returns a CucumberManager instance", () => {
            const cm = CucumberManager.getInstance();

            expect(cm).toBeInstanceOf(CucumberManager);
        });

        it("returns the same singleton when called more than once", () => {
            const cm1 = CucumberManager.getInstance();
            const cm2 = CucumberManager.getInstance();

            expect(cm2).toBe(cm1);
        });
    });
});

import { CucumberManager } from "../CucumberManager";

import type { CucumberLike } from "../CucumberManager";

const cucumber: CucumberLike = {
    Given(pattern, options = {}, handler = () => {}) {},
    Then(pattern, options = {}, handler = () => {}) {},
    When(pattern, options = {}, handler = () => {}) {},
};

// const notCucumber = null;

describe("CucumberManager", () => {
    // describe("constructor", () => {
    //     it("accepts a Cucumber-like object", () => {
    //         let cm = new CucumberManager(cucumber);
    //     });

    //     it("rejects an object unlike Cucumber", () => {
    //         expect(() => new CucumberManager(notCucumber)).toThrow("Invalid input.");
    //     });
    // });

    describe("cucumber property", () => {
        it("returns a Cucumber-like object", () => {
            const cm = new CucumberManager(cucumber);

            expect(cm.cucumber).toBe(cucumber);
        });
    });

    describe("defineStep method", () => {
        const handler = (param): void => {};

        let cm;

        beforeEach(() => {
            cm = new CucumberManager(cucumber);

            vi.spyOn(cm.cucumber, "When");
            // vi.resetAllMocks();
        });

        describe("registers step def patterns with Cucumber using...", () => {
            it("a single string expression", () => {
                const noKeyPat = "I do something with {param}";
                const keyPat   = `When ${noKeyPat}`;

                cm.defineStep(keyPat, handler);

                expect(cm.cucumber.When).toHaveBeenCalledTimes(1);
                expect(cm.cucumber.When).toHaveBeenCalledWith(noKeyPat, {}, handler);
            });

            it("a single regular expression", () => {
                const noKeyPatStr    = "I do something with {param}";
                const noKeyPatRegExp = new RegExp(noKeyPatStr, "i");
                const keyPatStr      = `When ${noKeyPatStr}`;
                const keyPatRegExp   = new RegExp(keyPatStr, "i");

                cm.defineStep(keyPatRegExp, handler);

                expect(cm.cucumber.When).toHaveBeenCalledTimes(1);
                expect(cm.cucumber.When).toHaveBeenCalledWith(noKeyPatRegExp, {}, handler);
            });

            it("multiple mixed expressions", () => {
                const noKeyPat  = "I do something with {param}";
                const noKeyPats = [noKeyPat, new RegExp(noKeyPat, "i")];
                const keyPat    = `When ${noKeyPat}`;
                const keyPats   = [keyPat, new RegExp(keyPat, "i")];

                cm.defineStep(keyPats, handler);

                expect(cm.cucumber.When).toHaveBeenCalledTimes(noKeyPats.length);
                for (let i = 0; i < noKeyPats.length; i++) {
                    expect(cm.cucumber.When).toHaveBeenCalledWith(noKeyPats[i], {}, handler);
                }
            });
        });

        // it("accepts an optional third param for Cucumber step def options", () => {});

        // describe("throws for malformed patterns like...", () => {
        //     it("Invalid initial keywords", () => {});
        // });
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

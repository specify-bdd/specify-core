import { CucumberManager } from "../CucumberManager";

import type { CucumberLike } from "../CucumberManager";

function fakeDefineStep(pattern, options = {}, handler = () => {}) {
    if (pattern && options) {
        handler();
    }
}

function fakeHandler(param) {
    return param;
}

const cucumber: CucumberLike = {
    "Given": fakeDefineStep,
    "Then":  fakeDefineStep,
    "When":  fakeDefineStep,
};

describe("CucumberManager", () => {
    describe("properties", () => {
        describe("cucumber", () => {
            it("returns a Cucumber-like object", () => {
                const cm = new CucumberManager(cucumber);

                expect(cm.cucumber).toBe(cucumber);
            });
        });
    });

    describe("methods", () => {
        describe("defineStep()", () => {
            let cm;

            beforeEach(() => {
                cm = new CucumberManager(cucumber);

                vi.spyOn(cm.cucumber, "When");
            });

            describe("registers step def patterns with Cucumber using...", () => {
                it("a single string expression", () => {
                    const noKeyPat = "I do something with {param}";
                    const keyPat   = `When ${noKeyPat}`;

                    cm.defineStep(keyPat, fakeHandler);

                    expect(cm.cucumber.When).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.When).toHaveBeenCalledWith(noKeyPat, {}, fakeHandler);
                });

                it("a single regular expression", () => {
                    const noKeyPatStr = "I do something with .*";
                    const noKeyPatReg = new RegExp(noKeyPatStr, "i");
                    const keyPatStr   = `When ${noKeyPatStr}`;
                    const keyPatReg   = new RegExp(keyPatStr, "i");

                    cm.defineStep(keyPatReg, fakeHandler);

                    expect(cm.cucumber.When).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.When).toHaveBeenCalledWith(noKeyPatReg, {}, fakeHandler);
                });

                it("multiple mixed expressions", () => {
                    const noKeyPatStr = "I do something with {param}";
                    const noKeyPatReg = new RegExp(noKeyPatStr.replace("{param}", ".*"));
                    const noKeyPats   = [noKeyPatStr, noKeyPatReg];
                    const keyPatStr   = `When ${noKeyPatStr}`;
                    const keyPatReg   = new RegExp(keyPatStr.replace("{param}", ".*"));
                    const keyPats     = [keyPatStr, keyPatReg];

                    cm.defineStep(keyPats, fakeHandler);

                    expect(cm.cucumber.When).toHaveBeenCalledTimes(noKeyPats.length);
                    for (let i = 0; i < noKeyPats.length; i++) {
                        expect(cm.cucumber.When).toHaveBeenCalledWith(
                            noKeyPats[i],
                            {},
                            fakeHandler,
                        );
                    }
                });
            });

            it("accepts an optional third param for Cucumber step def options", () => {
                const noKeyPat = "I do something with {param}";
                const keyPat   = `When ${noKeyPat}`;
                const opts     = { "timeout": 100 };

                cm.defineStep(keyPat, fakeHandler, opts);

                expect(cm.cucumber.When).toHaveBeenCalledWith(noKeyPat, opts, fakeHandler);
            });

            describe("throws for malformed patterns like...", () => {
                describe("string expressions with...", () => {
                    it("invalid keywords", () => {
                        const pat = "Ghen I do something with {param}";

                        expect(() => cm.defineStep(pat, fakeHandler)).toThrow(
                            `Invalid pattern expression: ${pat}`,
                        );
                    });

                    it("improper formatting", () => {
                        const pat = " When I do something with {param}";

                        expect(() => cm.defineStep(pat, fakeHandler));
                    });
                });

                describe("regular expressions with...", () => {
                    it("invalid keywords", () => {
                        const pat = /Ghen I do something with .*/;

                        expect(() => cm.defineStep(pat, fakeHandler)).toThrow(
                            `Invalid pattern expression: ${pat.toString()}`,
                        );
                    });

                    it("improper formatting", () => {
                        const pat = /^ When I do something with .*/;

                        expect(() => cm.defineStep(pat, fakeHandler)).toThrow(
                            `Invalid pattern expression: ${pat.toString()}`,
                        );
                    });
                });
            });
        });
    });

    describe("static methods", () => {
        describe("getInstance()", () => {
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
});

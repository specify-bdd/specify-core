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
            it("returns the Cucumber object", () => {
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
                    cm.defineStep("When I do something with {param}", fakeHandler);

                    expect(cm.cucumber.When).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.When).toHaveBeenCalledWith(
                        "I do something with {param}",
                        {},
                        fakeHandler,
                    );
                });

                it("a single regular expression", () => {
                    cm.defineStep(/When I do something with .*/i, fakeHandler);

                    expect(cm.cucumber.When).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.When).toHaveBeenCalledWith(
                        /I do something with .*/i,
                        {},
                        fakeHandler,
                    );
                });

                it("multiple mixed expressions", () => {
                    cm.defineStep(
                        ["When I do something with {param}", /When I do something with .*/],
                        fakeHandler,
                    );

                    expect(cm.cucumber.When).toHaveBeenCalledTimes(2);
                    expect(cm.cucumber.When).toHaveBeenCalledWith(
                        "I do something with {param}",
                        {},
                        fakeHandler,
                    );
                    expect(cm.cucumber.When).toHaveBeenCalledWith(
                        /I do something with .*/,
                        {},
                        fakeHandler,
                    );
                });
            });

            it("accepts an optional third param for Cucumber step def options", () => {
                const opts = { "timeout": 100 };

                cm.defineStep("When I do something with {param}", fakeHandler, opts);

                expect(cm.cucumber.When).toHaveBeenCalledWith(
                    "I do something with {param}",
                    opts,
                    fakeHandler,
                );
            });

            describe("throws for malformed patterns like...", () => {
                describe("string expressions with...", () => {
                    it("invalid keywords", () => {
                        expect(() =>
                            cm.defineStep("Ghen I do something with {param}", fakeHandler),
                        ).toThrow(`Invalid pattern expression: ${pat}`);
                    });

                    it("improper formatting", () => {
                        expect(() =>
                            cm.defineStep(" When I do something with {param}", fakeHandler),
                        ).toThrow(`Invalid pattern expression: ${pat}`);
                    });
                });

                describe("regular expressions with...", () => {
                    it("invalid keywords", () => {
                        expect(() =>
                            cm.defineStep(/Ghen I do something with .*/, fakeHandler),
                        ).toThrow(`Invalid pattern expression: ${pat.toString()}`);
                    });

                    it("improper formatting", () => {
                        expect(() =>
                            cm.defineStep(/^ When I do something with .*/, fakeHandler),
                        ).toThrow(`Invalid pattern expression: ${pat.toString()}`);
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

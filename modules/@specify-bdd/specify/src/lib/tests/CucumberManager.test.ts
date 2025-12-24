import { CucumberManager } from "@/lib/CucumberManager";

import type { CucumberLike, StepDefOptions, StepDefPattern } from "@/lib/CucumberManager";

function fakeDefineStep(pattern: StepDefPattern, options: StepDefOptions = {}, handler = () => {}) {
    // the following logic only exists to prevent our linter from complaining
    // that the params above are defined but not used
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

const cmOpts = {
    "subjects": ["I", "the user"],
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
                cm = new CucumberManager(cucumber, cmOpts);

                vi.spyOn(cm.cucumber, "When");
            });

            describe("registers step def patterns with Cucumber using...", () => {
                it("a single basic string expression", () => {
                    cm.defineStep("When I do something with {param}", fakeHandler);

                    expect(cm.cucumber.When).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.When).toHaveBeenCalledWith(
                        "I do something with {param}",
                        {},
                        fakeHandler,
                    );
                });

                describe("a single enhanced string expression with...", () => {
                    it("multi-word alternate syntax", () => {
                        cm.defineStep("When I [laugh at/dance with] {param}", fakeHandler);

                        expect(cm.cucumber.When).toHaveBeenCalledTimes(2);
                        expect(cm.cucumber.When).toHaveBeenCalledWith(
                            "I laugh at {param}",
                            {},
                            fakeHandler,
                        );
                        expect(cm.cucumber.When).toHaveBeenCalledWith(
                            "I dance with {param}",
                            {},
                            fakeHandler,
                        );
                    });

                    it("mixed alternate and optional syntax", () => {
                        cm.defineStep("When I have [a(n)/the] {param}", fakeHandler);

                        expect(cm.cucumber.When).toHaveBeenCalledTimes(2);
                        expect(cm.cucumber.When).toHaveBeenCalledWith(
                            "I have a(n) {param}",
                            {},
                            fakeHandler,
                        );
                        expect(cm.cucumber.When).toHaveBeenCalledWith(
                            "I have the {param}",
                            {},
                            fakeHandler,
                        );
                    });

                    it("implicit subject variants", () => {
                        cm.defineStep(
                            "When [I do/the user does] something with {param}",
                            fakeHandler,
                        );

                        expect(cm.cucumber.When).toHaveBeenCalledTimes(2);
                        expect(cm.cucumber.When).toHaveBeenCalledWith(
                            "(I )do something with {param}",
                            {},
                            fakeHandler,
                        );
                        expect(cm.cucumber.When).toHaveBeenCalledWith(
                            "(the user )does something with {param}",
                            {},
                            fakeHandler,
                        );
                    });
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
                        [
                            "When I do something with {param}",
                            "When I [laugh at/dance with] {param}",
                            /When I do something with .*/,
                        ],
                        fakeHandler,
                    );

                    expect(cm.cucumber.When).toHaveBeenCalledTimes(4);
                    expect(cm.cucumber.When).toHaveBeenCalledWith(
                        "I do something with {param}",
                        {},
                        fakeHandler,
                    );
                    expect(cm.cucumber.When).toHaveBeenCalledWith(
                        "I laugh at {param}",
                        {},
                        fakeHandler,
                    );
                    expect(cm.cucumber.When).toHaveBeenCalledWith(
                        "I dance with {param}",
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
                        const pat = "Ghen I do something with {param}";

                        expect(() => cm.defineStep(pat, fakeHandler)).toThrow(
                            `Invalid pattern expression: ${pat}`,
                        );
                    });

                    it("improper formatting", () => {
                        const pat = " When I do something with {param}";

                        expect(() => cm.defineStep(pat, fakeHandler)).toThrow(
                            `Invalid pattern expression: ${pat}`,
                        );
                    });

                    it("nested enhanced syntax brackets", () => {
                        const pat = "When [I [go/stay]/the user [goes/stays]] home";

                        expect(() => cm.defineStep(pat, fakeHandler)).toThrow(
                            "Enhanced expression brackets can't be nested.",
                        );
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

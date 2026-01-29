import { CucumberManager } from "@/lib/CucumberManager";

import type {
    CucumberLike,
    HookOptions,
    ParamTypeOptions,
    StepDefOptions,
    StepDefPattern,
    WorldLike,
} from "@/lib/CucumberManager";

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
function fakeDefineParam(options: ParamTypeOptions) {}

function fakeDefineStep(
    pattern: StepDefPattern,
    options: StepDefOptions = {},
    handler: () => any,
) {}

function fakeHandler(param) {}

function fakeHook(options: HookOptions, handler: () => any) {}

function fakeSetWorld(world: WorldLike) {}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

const cucumber: CucumberLike = {
    "After":               fakeHook,
    "AfterAll":            fakeHook,
    "AfterStep":           fakeHook,
    "Before":              fakeHook,
    "BeforeAll":           fakeHook,
    "BeforeStep":          fakeHook,
    "defineParameterType": fakeDefineParam,
    "Given":               fakeDefineStep,
    "setWorldConstructor": fakeSetWorld,
    "Then":                fakeDefineStep,
    "When":                fakeDefineStep,
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
        describe("hooks", () => {
            const opts = { "name": "foo" };

            let cm;

            beforeEach(() => {
                cm = new CucumberManager(cucumber, cmOpts);

                vi.spyOn(cm.cucumber, "After");
                vi.spyOn(cm.cucumber, "AfterAll");
                vi.spyOn(cm.cucumber, "AfterStep");
                vi.spyOn(cm.cucumber, "Before");
                vi.spyOn(cm.cucumber, "BeforeAll");
                vi.spyOn(cm.cucumber, "BeforeStep");
            });

            describe("addAfterAllHook()", () => {
                it("calls addHook() and uses the correct Cucumber hook method", () => {
                    cm.addAfterAllHook(fakeHandler, opts);

                    expect(cm.cucumber.AfterAll).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.AfterAll).toHaveBeenCalledWith(opts, fakeHandler);
                });
            });

            describe("addAfterScenarioHook()", () => {
                it("calls addHook() and uses the correct Cucumber hook method", () => {
                    cm.addAfterScenarioHook(fakeHandler, opts);

                    expect(cm.cucumber.After).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.After).toHaveBeenCalledWith(opts, fakeHandler);
                });
            });

            describe("addAfterStepHook()", () => {
                it("calls addHook() and uses the correct Cucumber hook method", () => {
                    cm.addAfterStepHook(fakeHandler, opts);

                    expect(cm.cucumber.AfterStep).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.AfterStep).toHaveBeenCalledWith(opts, fakeHandler);
                });
            });

            describe("addBeforeAllHook()", () => {
                it("calls addHook() and uses the correct Cucumber hook method", () => {
                    cm.addBeforeAllHook(fakeHandler, opts);

                    expect(cm.cucumber.BeforeAll).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.BeforeAll).toHaveBeenCalledWith(opts, fakeHandler);
                });
            });

            describe("addBeforeScenarioHook()", () => {
                it("calls addHook() and uses the correct Cucumber hook method", () => {
                    cm.addBeforeScenarioHook(fakeHandler, opts);

                    expect(cm.cucumber.Before).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.Before).toHaveBeenCalledWith(opts, fakeHandler);
                });
            });

            describe("addBeforeStepHook()", () => {
                it("calls addHook() and uses the correct Cucumber hook method", () => {
                    cm.addBeforeStepHook(fakeHandler, opts);

                    expect(cm.cucumber.BeforeStep).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.BeforeStep).toHaveBeenCalledWith(opts, fakeHandler);
                });
            });
        });

        describe("defineParamType()", () => {
            let cm;

            beforeEach(() => {
                cm = new CucumberManager(cucumber, cmOpts);

                vi.spyOn(cm.cucumber, "defineParameterType");
            });

            it("passes param options on to Cucumber's defineParameterType method", () => {
                const opts: ParamTypeOptions = { "name": "foo" };

                cm.defineParamType(opts);

                expect(cm.cucumber.defineParameterType).toHaveBeenCalledTimes(1);
                expect(cm.cucumber.defineParameterType).toHaveBeenCalledWith(opts);
            });
        });

        describe("defineStep()", () => {
            let cm;

            beforeEach(() => {
                cm = new CucumberManager(cucumber, cmOpts);

                vi.spyOn(cm.cucumber, "Given");
                vi.spyOn(cm.cucumber, "When");
                vi.spyOn(cm.cucumber, "Then");
            });

            describe("registers step def patterns with Cucumber using...", () => {
                it("a single basic string expression", () => {
                    cm.defineStep("Given that I have done something with {param}", fakeHandler);
                    cm.defineStep("When I do something with {param}", fakeHandler);
                    cm.defineStep("Then something should have been done with {param}", fakeHandler);

                    expect(cm.cucumber.Given).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.When).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.Then).toHaveBeenCalledTimes(1);

                    expect(cm.cucumber.Given).toHaveBeenCalledWith(
                        "that I have done something with {param}",
                        {},
                        fakeHandler,
                    );

                    expect(cm.cucumber.When).toHaveBeenCalledWith(
                        "I do something with {param}",
                        {},
                        fakeHandler,
                    );

                    expect(cm.cucumber.Then).toHaveBeenCalledWith(
                        "something should have been done with {param}",
                        {},
                        fakeHandler,
                    );
                });

                describe("a single enhanced string expression with...", () => {
                    it("multi-word alternate syntax", () => {
                        cm.defineStep("Given that I have [laughed at/danced with] {param}", fakeHandler);
                        cm.defineStep("When I [laugh at/dance with] {param}", fakeHandler);
                        cm.defineStep("Then {param} should have been [laughed at/danced with]", fakeHandler);

                        expect(cm.cucumber.Given).toHaveBeenCalledTimes(2);
                        expect(cm.cucumber.When).toHaveBeenCalledTimes(2);
                        expect(cm.cucumber.Then).toHaveBeenCalledTimes(2);

                        expect(cm.cucumber.Given).toHaveBeenCalledWith(
                            "that I have laughed at {param}",
                            {},
                            fakeHandler,
                        );

                        expect(cm.cucumber.Given).toHaveBeenCalledWith(
                            "that I have danced with {param}",
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

                        expect(cm.cucumber.Then).toHaveBeenCalledWith(
                            "{param} should have been laughed at",
                            {},
                            fakeHandler,
                        );

                        expect(cm.cucumber.Then).toHaveBeenCalledWith(
                            "{param} should have been danced with",
                            {},
                            fakeHandler,
                        );
                    });

                    it("mixed alternate and optional syntax", () => {
                        cm.defineStep("Given that I have [a(n)/the] {param}", fakeHandler);
                        cm.defineStep("When I get [a(n)/the] {param}", fakeHandler);
                        cm.defineStep("Then I should have [a(n)/the] {param}", fakeHandler);

                        expect(cm.cucumber.Given).toHaveBeenCalledTimes(2);
                        expect(cm.cucumber.When).toHaveBeenCalledTimes(2);
                        expect(cm.cucumber.Then).toHaveBeenCalledTimes(2);

                        expect(cm.cucumber.Given).toHaveBeenCalledWith(
                            "that I have a(n) {param}",
                            {},
                            fakeHandler,
                        );

                        expect(cm.cucumber.Given).toHaveBeenCalledWith(
                            "that I have the {param}",
                            {},
                            fakeHandler,
                        );

                        expect(cm.cucumber.When).toHaveBeenCalledWith(
                            "I get a(n) {param}",
                            {},
                            fakeHandler,
                        );

                        expect(cm.cucumber.When).toHaveBeenCalledWith(
                            "I get the {param}",
                            {},
                            fakeHandler,
                        );

                        expect(cm.cucumber.Then).toHaveBeenCalledWith(
                            "I should have a(n) {param}",
                            {},
                            fakeHandler,
                        );

                        expect(cm.cucumber.Then).toHaveBeenCalledWith(
                            "I should have the {param}",
                            {},
                            fakeHandler,
                        );
                    });

                    it("implicit subject variants", () => {
                        cm.defineStep(
                            "Given that [I did/the user did] something with {param}",
                            fakeHandler,
                        );

                        cm.defineStep(
                            "When [I do/the user does] something with {param}",
                            fakeHandler,
                        );

                        cm.defineStep(
                            "Then [I should have done/the user should have done] something with {param}",
                            fakeHandler,
                        );

                        expect(cm.cucumber.Given).toHaveBeenCalledTimes(2);
                        expect(cm.cucumber.When).toHaveBeenCalledTimes(2);
                        expect(cm.cucumber.Then).toHaveBeenCalledTimes(2);

                        expect(cm.cucumber.Given).toHaveBeenCalledWith(
                            "that (I )did something with {param}", // TODO: this phrasing is weird
                            {},
                            fakeHandler,
                        );

                        expect(cm.cucumber.Given).toHaveBeenCalledWith(
                            "that (the user )did something with {param}", // TODO: this phrasing is weird
                            {},
                            fakeHandler,
                        );

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

                        expect(cm.cucumber.Then).toHaveBeenCalledWith(
                            "(I )should have done something with {param}",
                            {},
                            fakeHandler,
                        );

                        expect(cm.cucumber.Then).toHaveBeenCalledWith(
                            "(the user )should have done something with {param}",
                            {},
                            fakeHandler,
                        );
                    });
                });

                it("a single regular expression", () => {
                    cm.defineStep(/Given that I have done something with .*/i, fakeHandler);
                    cm.defineStep(/When I do something with .*/i, fakeHandler);
                    cm.defineStep(/Then something should have been done with .*/i, fakeHandler);

                    expect(cm.cucumber.Given).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.When).toHaveBeenCalledTimes(1);
                    expect(cm.cucumber.Then).toHaveBeenCalledTimes(1);

                    expect(cm.cucumber.Given).toHaveBeenCalledWith(
                        /that I have done something with .*/i,
                        {},
                        fakeHandler,
                    );

                    expect(cm.cucumber.When).toHaveBeenCalledWith(
                        /I do something with .*/i,
                        {},
                        fakeHandler,
                    );

                    expect(cm.cucumber.Then).toHaveBeenCalledWith(
                        /something should have been done with .*/i,
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

        describe("setWorld()", () => {
            let cm;

            beforeEach(() => {
                cm = new CucumberManager(cucumber, cmOpts);

                vi.spyOn(cm.cucumber, "setWorldConstructor");
            });

            it("passes a World object to Cucumber's setWorldConstructor method", () => {
                const world = {};

                cm.setWorld(world);

                expect(cm.cucumber.setWorldConstructor).toHaveBeenCalledTimes(1);
                expect(cm.cucumber.setWorldConstructor).toHaveBeenCalledWith(world);
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

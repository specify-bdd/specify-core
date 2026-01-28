import {
    addAfterAllHook,
    addAfterScenarioHook,
    addAfterStepHook,
    addBeforeAllHook,
    addBeforeScenarioHook,
    addBeforeStepHook,
    defineParamType,
    defineStep,
    defineWorld,
} from "../../../index";

const {
    mockAfter,
    mockAfterAll,
    mockAfterStep,
    mockBefore,
    mockBeforeAll,
    mockBeforeStep,
    mockDefineParameterType,
    mockGiven,
    mockSetWorldConstructor,
    mockWorld,
} = vi.hoisted(() => {
    return {
        "mockAfter":               vi.fn(),
        "mockAfterAll":            vi.fn(),
        "mockAfterStep":           vi.fn(),
        "mockBefore":              vi.fn(),
        "mockBeforeAll":           vi.fn(),
        "mockBeforeStep":          vi.fn(),
        "mockDefineParameterType": vi.fn(),
        "mockGiven":               vi.fn(),
        "mockSetWorldConstructor": vi.fn(),
        "mockWorld":               vi.fn(),
    };
});

vi.mock("@cucumber/cucumber", () => {
    const cucumber = {
        "After":               mockAfter,
        "AfterAll":            mockAfterAll,
        "AfterStep":           mockAfterStep,
        "Before":              mockBefore,
        "BeforeAll":           mockBeforeAll,
        "BeforeStep":          mockBeforeStep,
        "defineParameterType": mockDefineParameterType,
        "Given":               mockGiven,
        "setWorldConstructor": mockSetWorldConstructor,
        "World":               mockWorld,
    };

    return { "default": cucumber, ...cucumber };
});

describe("entrypoint module (integration)", () => {
    describe("exports", () => {
        describe("addAfterAllHook()", () => {
            it("registers a hook script with Cucumber", () => {
                addAfterAllHook(() => true, {});

                expect(mockAfterAll).toHaveBeenCalled();
            });
        });

        describe("addAfterScenarioHook()", () => {
            it("registers a hook script with Cucumber", () => {
                addAfterScenarioHook(() => true, {});

                expect(mockAfter).toHaveBeenCalled();
            });
        });

        describe("addAfterStepHook()", () => {
            it("registers a hook script with Cucumber", () => {
                addAfterStepHook(() => true, {});

                expect(mockAfterStep).toHaveBeenCalled();
            });
        });

        describe("addBeforeAllHook()", () => {
            it("registers a hook script with Cucumber", () => {
                addBeforeAllHook(() => true, {});

                expect(mockBeforeAll).toHaveBeenCalled();
            });
        });

        describe("addBeforeScenarioHook()", () => {
            it("registers a hook script with Cucumber", () => {
                addBeforeScenarioHook(() => true, {});

                expect(mockBefore).toHaveBeenCalled();
            });
        });

        describe("addBeforeStepHook()", () => {
            it("registers a hook script with Cucumber", () => {
                addBeforeStepHook(() => true, {});

                expect(mockBeforeStep).toHaveBeenCalled();
            });
        });

        describe("defineParamType()", () => {
            it("registers a param type definition with Cucumber", () => {
                defineParamType({});

                expect(mockDefineParameterType).toHaveBeenCalled();
            });
        });

        describe("defineStep()", () => {
            it("registers a step definition with Cucumber", () => {
                defineStep("Given a step definition", () => true);

                expect(mockGiven).toHaveBeenCalled();
            });
        });

        describe("defineWorld()", () => {
            it("registers a world constructor with Cucumber", () => {
                defineWorld({});

                expect(mockSetWorldConstructor).toHaveBeenCalled();
            });
        });
    });
});

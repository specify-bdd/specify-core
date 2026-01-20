import { defineHook, defineParamType, defineStep, defineWorld, Hook } from "../../../index";

const { mockAfter, mockDefineParameterType, mockGiven, mockSetWorldConstructor } = vi.hoisted(
    () => {
        return {
            "mockAfter":               vi.fn(),
            "mockDefineParameterType": vi.fn(),
            "mockGiven":               vi.fn(),
            "mockSetWorldConstructor": vi.fn(),
        };
    },
);

vi.mock("@cucumber/cucumber", () => {
    const cucumber = {
        "After":               mockAfter,
        "defineParameterType": mockDefineParameterType,
        "Given":               mockGiven,
        "setWorldConstructor": mockSetWorldConstructor,
    };

    return { "default": cucumber, ...cucumber };
});

describe("entrypoint module (integration)", () => {
    describe("exports", () => {
        describe("defineHook()", () => {
            it("registers a hook script with Cucumber", () => {
                defineHook(Hook.After, () => true, {});

                expect(mockAfter).toHaveBeenCalled();
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

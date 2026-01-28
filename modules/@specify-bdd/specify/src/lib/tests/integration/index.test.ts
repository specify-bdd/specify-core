import { defineParamType, defineStep, setWorld } from "../../../index";

const { mockDefineParameterType, mockGiven, mockSetWorldConstructor } = vi.hoisted(() => {
    return {
        "mockDefineParameterType": vi.fn(),
        "mockGiven":               vi.fn(),
        "mockSetWorldConstructor": vi.fn(),
    };
});

vi.mock("@cucumber/cucumber", () => {
    const cucumber = {
        "defineParameterType": mockDefineParameterType,
        "Given":               mockGiven,
        "setWorldConstructor": mockSetWorldConstructor,
    };

    return { "default": cucumber, ...cucumber };
});

describe("entrypoint module (integration)", () => {
    describe("exports", () => {
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

        describe("setWorld()", () => {
            it("registers a world constructor with Cucumber", () => {
                setWorld({});

                expect(mockSetWorldConstructor).toHaveBeenCalled();
            });
        });
    });
});

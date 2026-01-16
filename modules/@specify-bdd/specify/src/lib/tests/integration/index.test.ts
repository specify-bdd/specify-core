import { defineParamType, defineStep } from "../../../index";

const { mockDefineParameterType, mockGiven } = vi.hoisted(() => {
    return {
        "mockDefineParameterType": vi.fn(),
        "mockGiven":               vi.fn(),
    };
});

vi.mock("@cucumber/cucumber", () => {
    const cucumber = {
        "defineParameterType": mockDefineParameterType,
        "Given":               mockGiven,
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
    });
});

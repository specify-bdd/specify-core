import { defineStep } from "../../../index";

const { mockGiven } = vi.hoisted(() => {
    return { "mockGiven": vi.fn() };
});

vi.mock("@cucumber/cucumber", () => {
    const cucumber = { "Given": mockGiven };

    return { "default": cucumber, ...cucumber };
});

describe("entrypoint module (integration)", () => {
    describe("exports", () => {
        describe("defineStep()", () => {
            it("registers a step definition with Cucumber", () => {
                defineStep("Given a step definition", () => true);

                expect(mockGiven).toHaveBeenCalled();
            });
        });
    });
});

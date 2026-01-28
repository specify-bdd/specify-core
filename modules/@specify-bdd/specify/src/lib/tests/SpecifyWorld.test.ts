import { World    } from "@cucumber/cucumber";
import { QuickRef } from "@specify-bdd/quick-ref";

import { SpecifyWorld } from "@/lib/SpecifyWorld";

const { mockWorld } = vi.hoisted(() => {
    return { "mockWorld": vi.fn() };
});

vi.mock("@cucumber/cucumber", () => {
    const cucumber = {
        "World": mockWorld,
    };

    return { "default": cucumber, ...cucumber };
});

vi.mock("@specify-bdd/quick-ref");

describe("Specify World", () => {
    const opts = {};

    let world: SpecifyWorld;

    beforeEach(() => {
        vi.resetAllMocks();

        world = new SpecifyWorld(opts);
    });

    describe("constructor", () => {
        it("passes options through to the Cucumber World constructor", () => {
            expect(World).toHaveBeenCalledTimes(1);
            expect(World).toHaveBeenCalledWith(opts);
        });

        it("initializes a new QuickRef instance", () => {
            expect(QuickRef).toHaveBeenCalledTimes(1);
            expect(QuickRef).toHaveBeenCalledWith();
        });
    });

    describe("properties", () => {
        describe("quickRef", () => {
            it("returns the stored QuickRef instance", () => {
                expect(world.quickRef).toBeInstanceOf(QuickRef);
            });

            it("is read-only", () => {
                expect(() => (world.quickRef = new QuickRef())).toThrow(
                    "Cannot set property quickRef",
                );
            });
        });
    });
});

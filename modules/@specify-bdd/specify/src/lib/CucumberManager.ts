import Cucumber from "@cucumber/cucumber";

export interface CucumberLike {
    Given: CucumberStepDefLike;
    Then: CucumberStepDefLike;
    When: CucumberStepDefLike;
}

interface CucumberStepDefLike {
    (pattern: string, options: object, fn: () => void): void;
}

let instance: CucumberManager;

/**
 * A wrapper for Cucumber which streamlines, enhances, and enforces consistency
 * of Cucumber usage throughout Specify.
 */
export class CucumberManager {
    /**
     * The managed Cucumber object.
     */
    cucumber: CucumberLike;

    /**
     * Accept a Cucumber object and store it for easy access.
     *
     * @param cucumber - The Cucumber object to manage
     */
    constructor(cucumber: CucumberLike) {
        this.cucumber = cucumber;
    }

    /**
     * Get the singleton instance of CucumberManager.
     *
     * @returns The CucumberManager instance
     */
    static getInstance(): CucumberManager {
        if (!instance) {
            instance = new CucumberManager(Cucumber);
        }

        return instance;
    }
}

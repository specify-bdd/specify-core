import waitFor from "@/lib/waitFor";

/**
 * Helper function to handle rejections/errors in a way Vitest won't complain about.
 *
 * @param promise - the promise to await and make expectations about
 * @param error   - the expected error
 *
 * @returns the expectation object to await
 */
async function expectToReject(promise: Promise<unknown>, error?: Error) {
    return expect(promise).rejects.toThrow(error);
}

describe("waitFor", () => {
    const passFn = vi.fn().mockReturnValue(true);
    const failFn = vi.fn().mockReturnValue(false);

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("resolves immediately when predicate returns true", async () => {
        const timeEnd = Date.now() + 10; // 10ms buffer to account for execution time

        await expect(waitFor(passFn)).resolves.toBeUndefined();

        expect(Date.now()).toBeLessThanOrEqual(timeEnd);
        expect(passFn).toHaveBeenCalledOnce();
    });

    test("rejects after a 1 second timeout when the predicate fails", async () => {
        const timeStart   = Date.now();
        const expectation = expectToReject(waitFor(failFn));

        await vi.runAllTimersAsync();

        await expectation;

        expect(Date.now() - timeStart).toBe(1000);
    });

    test("retries at 25ms intervals if predicate fails", async () => {
        const expectation = expectToReject(waitFor(failFn));

        await vi.runAllTimersAsync();
        await expectation;

        // 40 retries (1000ms / 25ms)
        expect(failFn.mock.calls.length).toBe(40);
    });

    test("retries until predicate returns true", async () => {
        let attempts = 0;

        const fn      = vi.fn(() => ++attempts === 3);
        const promise = waitFor(fn);

        await vi.runAllTimersAsync();
        await promise;

        expect(fn).toHaveBeenCalledTimes(3);
    });

    test("has a configurable timeout", async () => {
        const timeStart   = Date.now();
        const expectation = expectToReject(waitFor(failFn, { "timeout": 100 }));

        await vi.runAllTimersAsync();
        await expectation;

        expect(Date.now() - timeStart).toBe(100);
    });

    test("has a configurable interval", async () => {
        const expectation = expectToReject(waitFor(failFn, { "interval": 100 }));

        await vi.runAllTimersAsync();
        await expectation;

        // 10 retries (1000ms / 100ms)
        expect(failFn.mock.calls.length).toBe(10);
    });

    test("supports async predicates", async () => {
        const fn = vi.fn(async () => {
            await new Promise((resolve) => setTimeout(resolve, 25));
            return false;
        });

        const expectation = expectToReject(waitFor(fn));

        await vi.runAllTimersAsync();
        await expectation;

        // 20 retries (1000ms / (25ms + 25ms predicate execution time))
        expect(fn.mock.calls.length).toBe(20);
    });

    test("throws error when timeout is reached", async () => {
        const expectation = expectToReject(waitFor(failFn), Error("waitFor timed out"));

        await vi.runAllTimersAsync();
        await expectation;
    });

    test("propagates errors thrown by predicate", async () => {
        const fn = vi.fn(() => {
            throw Error("predicate error");
        });

        const expectation = expectToReject(waitFor(fn), Error("predicate error"));

        await vi.runAllTimersAsync();
        await expectation;
    });

    test("handles interval equal to timeout", async () => {
        const expectation = expectToReject(waitFor(failFn, { "timeout": 50, "interval": 50 }));

        await vi.runAllTimersAsync();
        await expectation;

        expect(failFn).toHaveBeenCalledOnce();
    });

    test("handles interval larger than timeout", async () => {
        const expectation = expectToReject(waitFor(failFn, { "timeout": 50, "interval": 100 }));

        await vi.runAllTimersAsync();
        await expectation;

        expect(failFn).toHaveBeenCalledOnce();
    });

    test("throws for invalid interval", async () => {
        const expectation = expectToReject(
            waitFor(failFn, { "interval": 0 }),
            Error("Invalid waitFor interval, must be a postitive number."),
        );

        await vi.runAllTimersAsync();
        await expectation;

        expect(failFn).not.toHaveBeenCalled();
    });

    test("throws for invalid timeout", async () => {
        const expectation = expectToReject(
            waitFor(failFn, { "timeout": 0 }),
            Error("Invalid waitFor timeout, must be a postitive number."),
        );

        await vi.runAllTimersAsync();
        await expectation;

        expect(failFn).not.toHaveBeenCalled();
    });

    test("never runs predicate concurrently", async () => {
        let running = false;

        const fn = vi.fn(async () => {
            if (running) {
                throw Error("concurrent execution");
            }

            running = true;

            await new Promise((resolve) => setTimeout(resolve, 10));

            running = false;

            return false;
        });

        // give it plenty of time to make mistakes with concurrent execution
        const expectation = expectToReject(
            waitFor(fn, { "timeout": 5000 }),
            Error("waitFor timed out"),
        );

        await vi.runAllTimersAsync();
        await expectation;
    });

    test("times out even if predicate is still running", async () => {
        const fn = vi.fn(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500));

            return true;
        });

        const expectation = expectToReject(waitFor(fn, { "timeout": 100 }));

        await vi.advanceTimersByTimeAsync(100);

        // will throw a Vitest timeout error if waitFor doesn't timeout correctly
        await expectation;
    });

    test("can throw a custom error message on timeout", async () => {
        const expectation = expectToReject(
            waitFor(failFn, { "error": Error("custom error") }),
            Error("custom error"),
        );

        await vi.runAllTimersAsync();
        await expectation;
    });
});

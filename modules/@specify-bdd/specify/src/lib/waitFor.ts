/**
 * Waits for a predicate function to return true, retrying at specified intervals
 * until the timeout is reached.
 *
 * @param predicate        - the function to poll against
 * @param options          - configuration options for waitFor behavior
 * @param options.error    - the error that will be thrown on timeout
 * @param options.interval - time to wait between predicate calls
 * @param options.timeout  - maximum time to wait for the predicate to return true
 *
 * @throws Error
 * If the interval or timeout parameters are invalid (non-positive numbers)
 *
 * @throws Error
 * If the timeout is reached without a successful predicate call
 *
 * @throws Error
 * Any error thrown by the predicate
 */
export default async function waitFor(
    predicate: () => boolean | Promise<boolean>,
    { error = Error("waitFor timed out"), interval = 25, timeout = 1000 }: WaitForOptions = {},
): Promise<void> {
    if (interval <= 0) {
        throw new Error("Invalid waitFor interval, must be a postitive number.");
    }

    if (timeout <= 0) {
        throw new Error("Invalid waitFor timeout, must be a postitive number.");
    }

    const endTimestamp   = Date.now() + timeout;
    const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(error);
        }, timeout);
    });

    while (true) {
        try {
            // Promise.race prevents the case where a long-running predicate execution
            // would block the timeout from being thrown at the correct time
            const result = await Promise.race([predicate(), timeoutPromise]);

            if (result) {
                return;
            }
        } catch (err) {
            // error was thrown by predicate, cancel timeoutPromise rejection error
            if (err !== error) {
                timeoutPromise.catch(() => {});
            }

            throw err;
        }

        // do not wait if the next interval would exceed the timeout
        if (Date.now() + interval >= endTimestamp) {
            throw error;
        }

        await new Promise((resolve) => setTimeout(resolve, interval));
    }
}

export type WaitForOptions = {
    error?: Error;
    interval?: number;
    timeout?: number;
};

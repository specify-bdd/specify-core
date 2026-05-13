# Testing Step Definitions Module

Cucumber step definitions that facilitate Specify testing itself.

## Assert parallel worker count

- `Then there should be (only ){int} parallel worker(s)`

Passes only when the number of active Cucumber parallel workers equals the expected value.

> The env var CUCUMBER_TOTAL_WORKERS is set within the worker child processes Cucumber spins up when operating in parallel mode. When operating in the default serial mode, this env var is not set. Therefore, this step def treats the absence of this env var as equivalent to 1 worker.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The expected number of parallel workers |

---

## Wait for duration

- `Given (that )this step has passed after {float} seconds`
- `When [I wait/the user waits] for {float} second(s)`

Pauses execution for the specified number of seconds.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The number of seconds to wait |

---

## Pass on nth attempt

- `Given (that )this step has passed on the {ordinal} attempt`
- `When this step passes on the {ordinal} attempt`
- `Then this step should pass on the {ordinal} attempt`

Passes only when the current scenario attempt number matches the expected value. Multiple attempts are managed via the retry feature.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The attempt number to pass |

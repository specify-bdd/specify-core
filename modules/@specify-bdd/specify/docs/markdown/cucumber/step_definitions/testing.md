# Testing Step Definitions Module

Cucumber step definitions that facilitate Specify testing itself.

## Only passes if the expected number of parallel workers are currently active

- `Then there should be (only ){int} parallel worker(s)`

> The env var CUCUMBER_TOTAL_WORKERS is set within the worker child processes Cucumber spins up when operating in parallel mode. When operating in the default serial mode, this env var is not set. Therefore, this step def treats the absence of this env var as equivalent to 1 worker.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The expected number of parallel workers |

---

## Wait for the specified number of seconds

- `Given (that )this step has passed after {float} seconds`
- `When [I wait/the user waits] for {float} second(s)`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The number of seconds to wait |

---

## Only passes on the Nth attempt for any given test case

- `Given (that )this step has passed on the {ordinal} attempt`
- `When this step passes on the {ordinal} attempt`
- `Then this step should pass on the {ordinal} attempt`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The attempt number to pass |

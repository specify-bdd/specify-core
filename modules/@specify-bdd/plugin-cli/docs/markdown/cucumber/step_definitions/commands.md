# Commands Step Definitions Module

Cucumber step definitions covering execution of commands within an active shell session: starting them (sync or async), sending signals, waiting for return, and asserting on exit code or elapsed time.

## Send kill signal

- `When [I send/the user sends] a {cliSignal} signal to the last command`

Sends the specified system signal to the most recently executed command.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The system signal to pass to killCommand() |

---

## Run command asynchronously

- `When [I start/the user starts] a/an/the (async )command/process {refstr}`

Sends the given command to the active shell and returns immediately without waiting for it to finish.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The command to run |

---

## Run command synchronously

- `When [I run/the user runs] the command/process {refstr}`

Sends the given command to the active shell and waits for it to return before continuing.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The command to run |

---

## Wait for command return

- `When [I wait/the user waits] for the last command to return`

Waits for the last command to finish executing and updates the world's tracked working directory.

---

## Assert exit code

- `Then the last command's exit code/status should be {int|intstr|ref}`
- `Then the last command's exit code/status should be a/an {int|intstr|ref}`

Verifies that the last command exited with the expected exit code.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The exit code expected from the last command |

---

## Assert minimum execution time

- `Then the last command's execution time should be at least {float} seconds`

Verifies that the last command took at least the specified number of seconds to complete. Waits for the command to return before asserting.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The minimum amount of time, in seconds, that should have elapsed |

---

## Assert maximum execution time

- `Then the last command's execution time should be at most {float} seconds`

Verifies that the last command completed within the specified number of seconds. Waits for the command to return before asserting.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The maximum amount of time, in seconds, that should have elapsed |

# Shell Step Definitions Module

Cucumber step definitions covering the provisioning of an OS shell for testing purposes.

## Kill a CLI shell by its index

- `When [I kill/the user kills] CLI shell {int}`
- `When [I kill/the user kills] CLI shell {intstr}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The index of the CLI shell to kill |

---

## Kill the active CLI shell

- `When [I kill/the user kills] the CLI shell`

---

## Kill a CLI shell by its name

- `When [I kill/the user kills] the CLI shell named {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The name of the CLI shell to kill |

---

## Send a system kill signal to the command in the last used CLI

- `When [I send/the user sends] a {cliSignal} signal to the last command`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The system signal to pass to killCommand() |

---

## Execute the given command via the CLI asynchronously and move on without waiting for it to return

- `When [I start/the user starts] a/an/the (async )command/process {refstr}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The command to run |

---

## Switch to the next shell in the list

- `When [I switch/the user switches] CLI shells`

---

## Switch to the shell matching the index

- `When [I switch/the user switches] to CLI shell {int}`
- `When [I switch/the user switches] to CLI shell {intstr}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The index of the shell to switch to |

---

## Switch to a named shell

- `When [I switch/the user switches] to the CLI shell named {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The name of the shell to switch to |

---

## Wait for literally any output

- `When [I wait/the user waits] for terminal output`

---

## Verify the number of shell sessions

- `Then there should be {int} active CLI shell(s)`
- `Then there should be {intstr} active CLI shell(s)`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The expected number of shell sessions |

---

## Start a default shell without a name

- `Given a/another CLI shell`
- `When [I start/the user starts] a/another CLI shell`

---

## Execute the given command and wait for it to return

- `When [I run/the user runs] the command/process {refstr}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The command to run |

---

## Wait for the last command to return

- `When [I wait/the user waits] for the last command to return`

---

## Wait for output on the STDERR stream

- `When [I wait/the user waits] for terminal output on STDERR`

---

## Wait for output on the STDOUTstream

- `When [I wait/the user waits] for terminal output on STDOUT`

---

## Start a default shell with a name

- `Given a/another CLI shell named {string}`
- `When [I start/the user starts] a/another CLI shell named {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The name of the shell |

---

## Start a user-specified shell

- `Given a/an {string} CLI shell`
- `When [I start/the user starts] a/an {string} CLI shell`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The type of shell to spawn (`sh`, `bash`, etc.) |

---

## Start a user-specified shell with a name

- `Given a/an {string} CLI shell named {string}`
- `When [I start/the user starts] a/an {string} CLI shell named {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The type of shell to spawn (`sh`, `bash`, etc.) |
| 2 | The name of the shell |

---

## Change the current working directory in the active shell

- `Given (that )the working directory is {filePath}`
- `When [I change/the user changes] the working directory to {filePath}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The new working directory |

---

## Verify that the CLI exit code for the last command is as expected

- `Then the last command's exit code/status should be {int}`
- `Then the last command's exit code/status should be {intstr}`
- `Then the last command's exit code/status should be {ref}`
- `Then the last command's exit code/status should be a/an {int}`
- `Then the last command's exit code/status should be a/an {intstr}`
- `Then the last command's exit code/status should be a/an {ref}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The exit code expected from the last command |

---

## Wait for output matching a specific phrase on the STDERR stream

- `When [I wait/the user waits] for terminal output on STDERR matching (the regular expression ){regexp}`
- `When [I wait/the user waits] for terminal output on STDERR matching (the regular expression ){regexpstr}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The pattern to match output against |

---

## Wait for output containing a specific literal string on the STDERR stream

- `When [I wait/the user waits] for terminal output on STDERR including {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The literal string to wait for in the output |

---

## Wait for output matching a specific phrase on the STDOUT stream

- `When [I wait/the user waits] for terminal output on STDOUT matching (the regular expression ){regexp}`
- `When [I wait/the user waits] for terminal output on STDOUT matching (the regular expression ){regexpstr}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The pattern to match output against |

---

## Wait for output containing a specific literal string on the STDOUT stream

- `When [I wait/the user waits] for terminal output on STDOUT including {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The literal string to wait for in the output |

---

## Wait for output matching a specific phrase

- `When [I wait/the user waits] for terminal output matching (the regular expression ){regexp}`
- `When [I wait/the user waits] for terminal output matching (the regular expression ){regexpstr}`
- `When [I wait/the user waits] for the prompt {regexp}`
- `When [I wait/the user waits] for the prompt {regexpstr}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The pattern to match output against |

---

## Wait for output containing a specific literal string

- `When [I wait/the user waits] for terminal output including {string}`
- `When [I wait/the user waits] for the prompt including {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The literal string to wait for in the output |

---

## Verify that the last command's execution time is the specified number of seconds or more

- `Then the last command's execution time should be at least {float} seconds`

> Will wait for the last command to return before asserting.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The minimum amount of time, in seconds, that should have
  elapsed |

---

## Verify that the last command's execution time is the specified number of seconds or less

- `Then the last command's execution time should be at most {float} seconds`

> Will wait for the last command to return before asserting.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The maximum amount of time, in seconds, that should have
  elapsed |

---

## Verify that the CLI output for the last command matches the given regexp

- `Then the last command's terminal output should match (the regular expression ){regexp}`
- `Then the last command's terminal output should match (the regular expression ){regexpstr}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The pattern to match output against |

---

## Verify that the CLI output for the last command is exactly the given string

- `Then the last command's terminal output should be {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The expected output |

---

## Verify that the CLI output for the last command contains the given string

- `Then the last command's terminal output should include {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The substring to look for in the output |

---

## Verify that the CLI output for the last command does NOT match the given regexp

- `Then the last command's terminal output should not match (the regular expression ){regexp}`
- `Then the last command's terminal output should not match (the regular expression ){regexpstr}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The pattern to match output against |

---

## Verify that the CLI output for the last command is NOT exactly the given string

- `Then the last command's terminal output should not be {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The string the output should not equal |

---

## Verify that the CLI output for the last command does NOT contain the given string

- `Then the last command's terminal output should not include {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The substring that should not appear in the output |

---

## Verify that the CLI output for the last command is empty

- `Then the last command's terminal output should be empty`

---

## Send the character value of a key press to the CLI

- `When [I press/the user presses] the {string} key`

> Special keys like "enter", "tab", and "space" are supported, in addition to
regular single-character keys. No other special keys are currently supported.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The character or name of the key to send to the CLI |

---

## Wait for a prompt matching the given pattern, then respond by sending the given key

- `When [I respond/the user responds] to the prompt matching {regexp} by pressing the {string} key`
- `When [I respond/the user responds] to the prompt matching {regexpstr} by pressing the {string} key`

**Parameters**

| # | Description |
|---|-------------|
| 1 | the pattern to match the prompt against before responding |
| 2 | the key to send in response to the prompt |

---

## Wait for a prompt containing the given literal string, then respond by sending the given key

- `When [I respond/the user responds] to the prompt including {string} by pressing the {string} key`

**Parameters**

| # | Description |
|---|-------------|
| 1 | the literal string to wait for in the prompt before responding |
| 2 | the key to send in response to the prompt |

---

## Send a line of input to the CLI, followed by a newline character to execute it

- `When [I enter/the user enters] {string}`
- `When [I input/the user inputs] {string}`

> One character at a time is sent to simulate real user input

**Parameters**

| # | Description |
|---|-------------|
| 1 | the line of input to enter |

---

## Wait for a matching prompt, then respond by entering the given line

- `When [I respond/the user responds] to the prompt including {string} by entering/inputting {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | the string to wait for in the prompt |
| 2 | the string to enter in response |

---

## Wait for a prompt matching the given regexp, then respond by entering the given line

- `When [I respond/the user responds] to the prompt matching {regexp} by entering/inputting {string}`
- `When [I respond/the user responds] to the prompt matching {regexpstr} by entering/inputting {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | the pattern to match the prompt against before responding |
| 2 | the line to enter in response to the prompt |

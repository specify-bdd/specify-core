# Output Step Definitions Module

Cucumber step definitions covering observation of shell output: asserting what's been printed (or not), and waiting for new output to arrive on STDOUT, STDERR, or any stream.

## Wait for any output

- `When [I wait/the user waits] for terminal output`

Waits until the active shell produces any terminal output.

---

## Wait for STDERR output

- `When [I wait/the user waits] for terminal output on STDERR`

Waits until the active shell produces any output on STDERR.

---

## Wait for STDOUT output

- `When [I wait/the user waits] for terminal output on STDOUT`

Waits until the active shell produces any output on STDOUT.

---

## Wait for STDERR match

- `When [I wait/the user waits] for terminal output on STDERR matching (the regular expression ){regexp|regexpstr}`

Waits until STDERR output matches the given regular expression.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The pattern to match output against |

---

## Wait for string on STDERR

- `When [I wait/the user waits] for terminal output on STDERR including {string}`

Waits until STDERR includes the given literal string.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The literal string to wait for in the output |

---

## Wait for STDOUT match

- `When [I wait/the user waits] for terminal output on STDOUT matching (the regular expression ){regexp|regexpstr}`

Waits until STDOUT output matches the given regular expression.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The pattern to match output against |

---

## Wait for string on STDOUT

- `When [I wait/the user waits] for terminal output on STDOUT including {string}`

Waits until STDOUT includes the given literal string.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The literal string to wait for in the output |

---

## Wait for matching output

- `When [I wait/the user waits] for terminal output matching (the regular expression ){regexp|regexpstr}`
- `When [I wait/the user waits] for the prompt {regexp|regexpstr}`

Waits until the active shell's output matches the given regular expression.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The pattern to match output against |

---

## Wait for string in output

- `When [I wait/the user waits] for terminal output including {string}`
- `When [I wait/the user waits] for the prompt including {string}`

Waits until the active shell's output includes the given literal string.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The literal string to wait for in the output |

---

## Assert output matches pattern

- `Then the last command's terminal output should match (the regular expression ){regexp|regexpstr}`

Verifies that the last command's terminal output matches the given regular expression.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The pattern to match output against |

---

## Assert exact output

- `Then the last command's terminal output should be {string}`

Verifies that the last command's terminal output is exactly the given string, after trimming whitespace.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The expected output |

---

## Assert output includes string

- `Then the last command's terminal output should include {string}`

Verifies that the last command's terminal output contains the given literal string.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The substring to look for in the output |

---

## Assert output not matching

- `Then the last command's terminal output should not match (the regular expression ){regexp|regexpstr}`

Verifies that the last command's terminal output does not match the given regular expression.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The pattern to match output against |

---

## Assert output differs

- `Then the last command's terminal output should not be {string}`

Verifies that the last command's terminal output is not exactly the given string, after trimming whitespace.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The string the output should not equal |

---

## Assert output excludes string

- `Then the last command's terminal output should not include {string}`

Verifies that the last command's terminal output does not contain the given literal string.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The substring that should not appear in the output |

---

## Assert output is empty

- `Then the last command's terminal output should be empty`

Verifies that the last command produced no terminal output.

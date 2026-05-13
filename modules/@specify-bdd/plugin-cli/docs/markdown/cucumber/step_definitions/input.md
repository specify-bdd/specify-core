# Input Step Definitions Module

Cucumber step definitions covering interactive input to a shell session: sending key presses, lines of input, and responses to prompts.

## Send key press

- `When [I press/the user presses] the {string} key`

Sends a single key press to the active shell. Supports single-character keys and the named special keys `enter`, `tab`, and `space`.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The character or name of the key to send to the CLI |

---

## Press key at matching prompt

- `When [I respond/the user responds] to the prompt matching {regexp|regexpstr} by pressing the {string} key`

Waits for the terminal output to match the given pattern, then sends the specified key press.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The pattern to match the prompt against before responding |
| 2 | The key to send in response to the prompt |

---

## Press key at string prompt

- `When [I respond/the user responds] to the prompt including {string} by pressing the {string} key`

Waits for the terminal output to include the given literal string, then sends the specified key press.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The literal string to wait for in the prompt before responding |
| 2 | The key to send in response to the prompt |

---

## Send input line

- `When [I enter/the user enters] {string}`
- `When [I input/the user inputs] {string}`

Sends the given string to the active shell one character at a time, followed by a newline to execute it.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The line of input to enter |

---

## Respond to string prompt

- `When [I respond/the user responds] to the prompt including {string} by entering/inputting {string}`

Waits for the terminal output to include the given literal string, then sends the specified line as input.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The string to wait for in the prompt |
| 2 | The string to enter in response |

---

## Respond to pattern prompt

- `When [I respond/the user responds] to the prompt matching {regexp|regexpstr} by entering/inputting {string}`

Waits for the terminal output to match the given pattern, then sends the specified line as input.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The pattern to match the prompt against before responding |
| 2 | The line to enter in response to the prompt |

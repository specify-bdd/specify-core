# Shell Sessions Step Definitions Module

Cucumber step definitions covering the lifecycle of OS shell sessions: starting, switching, killing, and counting them, plus changing the working directory of the active session.

## Kill shell by index

- `When [I kill/the user kills] CLI shell {int|intstr}`

Kills the shell session identified by the given index.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The index of the CLI shell to kill |

---

## Kill active CLI shell

- `When [I kill/the user kills] the CLI shell`

Kills the currently active shell session.

---

## Kill shell by name

- `When [I kill/the user kills] the CLI shell named {string}`

Kills the shell session with the given name.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The name of the CLI shell to kill |

---

## Switch to next shell

- `When [I switch/the user switches] CLI shells`

Switches to the next shell in the session manager's list.

---

## Switch shell by index

- `When [I switch/the user switches] to CLI shell {int|intstr}`

Switches to the shell session at the given index.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The index of the shell to switch to |

---

## Switch shell by name

- `When [I switch/the user switches] to the CLI shell named {string}`

Switches to the shell session with the given name.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The name of the shell to switch to |

---

## Assert shell session count

- `Then there should be {int|intstr} active CLI shell(s)`

Verifies that the session manager has exactly the expected number of active shell sessions.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The expected number of shell sessions |

---

## Start default shell

- `Given a/another CLI shell`
- `When [I start/the user starts] a/another CLI shell`

Starts a new unnamed shell using the default shell type (`sh`).

---

## Start named default shell

- `Given a/another CLI shell named {string}`
- `When [I start/the user starts] a/another CLI shell named {string}`

Starts a new named shell using the default shell type (`sh`).

**Parameters**

| # | Description |
|---|-------------|
| 1 | The name of the shell |

---

## Start alternate shell

- `Given a/an {string} CLI shell`
- `When [I start/the user starts] a/an {string} CLI shell`

Starts a new unnamed shell of the specified type.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The type of shell to spawn (`sh`, `bash`, etc.) |

---

## Start named alternate shell

- `Given a/an {string} CLI shell named {string}`
- `When [I start/the user starts] a/an {string} CLI shell named {string}`

Starts a new named shell of the specified type.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The type of shell to spawn (`sh`, `bash`, etc.) |
| 2 | The name of the shell |

---

## Change working directory

- `Given (that )the working directory is {filePath}`
- `When [I change/the user changes] the working directory to {filePath}`

Runs `cd` in the active shell session and updates the world's tracked working directory to match.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The new working directory |

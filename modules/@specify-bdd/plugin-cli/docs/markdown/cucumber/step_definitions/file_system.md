# File System Step Definitions Module

Cucumber step definitions covering interactions with a file system.

## Create a new /tmp filepath and store it in QuickRef at the given address

- `Given a new temp file path referenced as {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The dot notation address at which to store the temp file path |

---

## Delete the file at the given path

- `When [I delete/the user deletes] the {filePath} file`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The path to the file |

---

## Set the content of the file at the given path

- `Given (that )the {filePath} file content is {string}`
- `Given (that )the {ref} file content is {string}`
- `When [I change/the user changes] the {filePath} file content to {string}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The path to the file to set content for |
| 2 | The content to write to the file |

---

## Create an empty file at the given path

- `Given (that )the {filePath} file content is empty`
- `Given (that )the {ref} file content is empty`
- `When [I create/the user creates] the {filePath} file`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The path to the file |

---

## Verify that the file at the given path is empty

- `Then the {filePath} file content should be empty`
- `Then the {ref} file content should be empty`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The file path to check for emptiness |

**Throws**

- `Error` — If the file does not exist.
- `Error` — If the file is not empty.

---

## Verify that the file at the given path has content matching the given pattern

- `Then the {filePath} file content should match {ref}`
- `Then the {ref} file content should match {ref}`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The file path to check the content of |
| 2 | The regex pattern (as string) the file content should match |

**Throws**

- `Error` — If the file does not exist.
- `Error` — If the file content doesn't match the pattern.

---

## Verify that a file exists at the given path

- `Then the {filePath} file path should exist`
- `Then the {ref} file path should exist`

**Parameters**

| # | Description |
|---|-------------|
| 1 | The file path to check for existence |

**Throws**

- `Error` — If the file does not exist.

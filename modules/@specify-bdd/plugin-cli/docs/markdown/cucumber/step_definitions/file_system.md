# File System Step Definitions Module

Cucumber step definitions covering interactions with a file system.

## Create temp file reference

- `Given a new temp file path referenced as {string}`

Creates a temporary directory and file path, then stores the path in QuickRef at the given dot-notation address.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The dot notation address at which to store the temp file path |

---

## Delete a file

- `When [I delete/the user deletes] the {filePath} file`

Deletes the file at the specified path. Fails if the file does not exist.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The path to the file |

---

## Write file content

- `Given (that )the {filePath|ref} file content is {string}`
- `When [I change/the user changes] the {filePath} file content to {string}`

Writes the specified content to the file at the given path, creating the file if it does not exist or overwriting it if it does.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The path to the file to set content for |
| 2 | The content to write to the file |

---

## Write empty file content

- `Given (that )the {filePath|ref} file content is empty`
- `When [I create/the user creates] the {filePath} file`

Creates an empty file at the given path, or overwrites its content if the file already exists.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The path to the file |

---

## Assert file is empty

- `Then the {filePath|ref} file content should be empty`

Verifies that the file at the given path exists and contains no content.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The file path to check for emptiness |

---

## Assert file content matches

- `Then the {filePath|ref} file content should match {ref}`

Verifies that the content of the file at the given path matches the provided regular expression pattern.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The file path to check the content of |
| 2 | The regex pattern (as string) the file content should match |

---

## Assert file path exists

- `Then the {filePath|ref} file path should exist`

Verifies that a file exists at the given path.

**Parameters**

| # | Description |
|---|-------------|
| 1 | The file path to check for existence |

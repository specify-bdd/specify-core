[**@specify/core**](../../README.md)

***

[@specify/core](../../modules.md) / [Logger](../README.md) / Logger

# Class: Logger

Defined in: [modules/@specify/core/src/lib/Logger.ts:23](https://github.com/specify-bdd/specify-core/blob/0a7f6fafd35930be20c578f6e33aa9f389b32224/modules/@specify/core/src/lib/Logger.ts#L23)

Utility for working with temporary Cucumber JSON log files on disk.

Provides functions for generating temp file paths, reading JSON logs,
and consuming (i.e., reading then deleting) logs. Internal file system
behavior can be customized for testing purposes via injected dependencies.

## Constructors

### Constructor

> **new Logger**(`options`): `Logger`

Defined in: [modules/@specify/core/src/lib/Logger.ts:38](https://github.com/specify-bdd/specify-core/blob/0a7f6fafd35930be20c578f6e33aa9f389b32224/modules/@specify/core/src/lib/Logger.ts#L38)

Create a Logger instance with file system behavior overrides.

#### Parameters

##### options

`LoggerOptions` = `{}`

Overrides for reading, deleting, and creating directories

#### Returns

`Logger`

## Methods

### consumeTmpLog()

> **consumeTmpLog**(`path`): `Promise`\<`JsonObject`\>

Defined in: [modules/@specify/core/src/lib/Logger.ts:57](https://github.com/specify-bdd/specify-core/blob/0a7f6fafd35930be20c578f6e33aa9f389b32224/modules/@specify/core/src/lib/Logger.ts#L57)

Read a JSON log file from disk and delete it afterward.

#### Parameters

##### path

`string`

Absolute path to the log file

#### Returns

`Promise`\<`JsonObject`\>

The parsed JSON contents of the log file

#### Throws

SyntaxError
If the file contents are not valid JSON.

#### Throws

Error
If the file does not exist or cannot be read/deleted.

***

### generateTmpLogPath()

> **generateTmpLogPath**(`prefix`): `Promise`\<`string`\>

Defined in: [modules/@specify/core/src/lib/Logger.ts:96](https://github.com/specify-bdd/specify-core/blob/0a7f6fafd35930be20c578f6e33aa9f389b32224/modules/@specify/core/src/lib/Logger.ts#L96)

Generate a unique file path in the system's temp directory
for writing a JSON log file. Ensures the parent directory exists.

#### Parameters

##### prefix

`string` = `"cucumber-log"`

File name prefix

#### Returns

`Promise`\<`string`\>

The absolute path to the new temp log file

#### Remarks

This only creates a path to the file, its does not create the file itself

#### Example

```ts
"/tmp/specify/cucumber-log-<random-uuid>.json"
```

***

### readTmpLog()

> **readTmpLog**(`path`): `Promise`\<`JsonObject`\>

Defined in: [modules/@specify/core/src/lib/Logger.ts:78](https://github.com/specify-bdd/specify-core/blob/0a7f6fafd35930be20c578f6e33aa9f389b32224/modules/@specify/core/src/lib/Logger.ts#L78)

Read and parse a JSON log file from disk.

#### Parameters

##### path

`string`

Absolute path to the log file

#### Returns

`Promise`\<`JsonObject`\>

The parsed JSON contents of the file

#### Throws

SyntaxError
If the file contents are not valid JSON.

#### Throws

Error
If the file does not exist or cannot be read.

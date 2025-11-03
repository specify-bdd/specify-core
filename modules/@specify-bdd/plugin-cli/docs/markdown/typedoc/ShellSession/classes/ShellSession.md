[**@specify-bdd/plugin-cli**](../../README.md)

***

[@specify-bdd/plugin-cli](../../modules.md) / [ShellSession](../README.md) / ShellSession

# Class: ShellSession

Defined in: [ShellSession.ts:16](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L16)

## Implements

- `SystemIOSession`

## Constructors

### Constructor

> **new ShellSession**(`options`): `ShellSession`

Defined in: [ShellSession.ts:29](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L29)

Creates a new interactive shell session.

#### Parameters

##### options

`SpawnOptions` = `{}`

The options to use with ChildProcess.spawn

#### Returns

`ShellSession`

#### Remarks

If `userPath` is provided, it will override the default PATH
environment variable for this session.

## Methods

### killCommand()

> **killCommand**(`signal`): `Promise`\<`void`\>

Defined in: [ShellSession.ts:40](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L40)

Gracefully terminates the current command process.

#### Parameters

##### signal

`string` = `"SIGTERM"`

The system signal to pass to kill()

#### Returns

`Promise`\<`void`\>

#### Implementation of

`SystemIOSession.killCommand`

***

### killSession()

> **killSession**(`signal`): `void`

Defined in: [ShellSession.ts:53](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L53)

Gracefully terminates the shell session.

#### Parameters

##### signal

`string` = `"SIGTERM"`

The system signal to pass to kill()

#### Returns

`void`

#### Implementation of

`SystemIOSession.killSession`

***

### onClose()

> **onClose**(`callback`): `void`

Defined in: [ShellSession.ts:62](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L62)

Registers a callback to be invoked when the shell session closes.

#### Parameters

##### callback

() => `void`

function to call when the shell session ends

#### Returns

`void`

#### Implementation of

`SystemIOSession.onClose`

***

### onError()

> **onError**(`callback`): `void`

Defined in: [ShellSession.ts:71](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L71)

Registers a callback to handle error output from the shell session.

#### Parameters

##### callback

(`data`) => `void`

function that receives error data as a string

#### Returns

`void`

#### Implementation of

`SystemIOSession.onError`

***

### onOutput()

> **onOutput**(`callback`): `void`

Defined in: [ShellSession.ts:80](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L80)

Registers a callback to handle standard output from the shell session.

#### Parameters

##### callback

(`data`) => `void`

function that receives output data as a string.

#### Returns

`void`

#### Implementation of

`SystemIOSession.onOutput`

***

### write()

> **write**(`command`): `void`

Defined in: [ShellSession.ts:90](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L90)

Writes (runs) a command to the shell session's stdin.

#### Parameters

##### command

`string`

the command to execute. `\n` is appended to simulate a
                 user pressing the "enter" key on their keyboard

#### Returns

`void`

#### Implementation of

`SystemIOSession.write`

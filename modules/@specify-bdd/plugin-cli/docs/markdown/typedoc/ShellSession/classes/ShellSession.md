[**@specify-bdd/plugin-cli**](../../README.md)

***

[@specify-bdd/plugin-cli](../../README.md) / [ShellSession](../README.md) / ShellSession

# Class: ShellSession

Defined in: [ShellSession.ts:14](https://github.com/specify-bdd/specify-core/blob/a72967d5d7ff6946c1828988ad1d054ed520ad4a/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L14)

## Implements

- `SystemIOSession`

## Constructors

### Constructor

> **new ShellSession**(`userPath?`): `ShellSession`

Defined in: [ShellSession.ts:27](https://github.com/specify-bdd/specify-core/blob/a72967d5d7ff6946c1828988ad1d054ed520ad4a/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L27)

Creates a new interactive shell session.

#### Parameters

##### userPath?

`string`

PATH to use for the session

#### Returns

`ShellSession`

#### Remarks

If `userPath` is provided, it will override the default PATH
environment variable for this session.

## Methods

### kill()

> **kill**(): `void`

Defined in: [ShellSession.ts:43](https://github.com/specify-bdd/specify-core/blob/a72967d5d7ff6946c1828988ad1d054ed520ad4a/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L43)

Gracefully terminates the shell session.

#### Returns

`void`

#### Implementation of

`SystemIOSession.kill`

***

### onClose()

> **onClose**(`callback`): `void`

Defined in: [ShellSession.ts:52](https://github.com/specify-bdd/specify-core/blob/a72967d5d7ff6946c1828988ad1d054ed520ad4a/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L52)

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

Defined in: [ShellSession.ts:61](https://github.com/specify-bdd/specify-core/blob/a72967d5d7ff6946c1828988ad1d054ed520ad4a/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L61)

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

Defined in: [ShellSession.ts:70](https://github.com/specify-bdd/specify-core/blob/a72967d5d7ff6946c1828988ad1d054ed520ad4a/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L70)

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

Defined in: [ShellSession.ts:80](https://github.com/specify-bdd/specify-core/blob/a72967d5d7ff6946c1828988ad1d054ed520ad4a/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L80)

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

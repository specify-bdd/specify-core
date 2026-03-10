[**@specify-bdd/plugin-cli**](../../README.md)

***

[@specify-bdd/plugin-cli](../../modules.md) / [ShellSession](../README.md) / ShellSession

# Class: ShellSession

Defined in: [ShellSession.ts:16](https://github.com/specify-bdd/specify-core/blob/920dfd7f743db924ec53105594e27d6e91321637/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L16)

## Implements

- `SystemIOSession`

## Constructors

### Constructor

> **new ShellSession**(`shellType`, `options`): `ShellSession`

Defined in: [ShellSession.ts:30](https://github.com/specify-bdd/specify-core/blob/920dfd7f743db924ec53105594e27d6e91321637/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L30)

Creates a new interactive shell session.

#### Parameters

##### shellType

`string` = `"sh"`

The type of shell to spawn (`sh`, `bash`, etc.)

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

Defined in: [ShellSession.ts:41](https://github.com/specify-bdd/specify-core/blob/920dfd7f743db924ec53105594e27d6e91321637/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L41)

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

Defined in: [ShellSession.ts:54](https://github.com/specify-bdd/specify-core/blob/920dfd7f743db924ec53105594e27d6e91321637/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L54)

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

Defined in: [ShellSession.ts:63](https://github.com/specify-bdd/specify-core/blob/920dfd7f743db924ec53105594e27d6e91321637/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L63)

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

Defined in: [ShellSession.ts:72](https://github.com/specify-bdd/specify-core/blob/920dfd7f743db924ec53105594e27d6e91321637/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L72)

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

Defined in: [ShellSession.ts:81](https://github.com/specify-bdd/specify-core/blob/920dfd7f743db924ec53105594e27d6e91321637/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L81)

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

> **write**(`input`, `appendNewline`): `void`

Defined in: [ShellSession.ts:92](https://github.com/specify-bdd/specify-core/blob/920dfd7f743db924ec53105594e27d6e91321637/modules/@specify-bdd/plugin-cli/src/lib/ShellSession.ts#L92)

Writes input to the shell session's stdin. Also appends a newline
to immediately run the input as a command by default.

#### Parameters

##### input

`string`

the input to write.

##### appendNewline

`boolean` = `true`

simulate a user pressing the "enter" key on their keyboard

#### Returns

`void`

#### Implementation of

`SystemIOSession.write`

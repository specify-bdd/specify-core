[**@specify-bdd/plugin-cli**](../../README.md)

***

[@specify-bdd/plugin-cli](../../README.md) / [SessionManager](../README.md) / SessionManager

# Class: SessionManager

Defined in: [SessionManager.ts:87](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L87)

Session Manager

Manages the lifecycle of a system process session. Ensures only one command
runs at a time, and tracks command output and exit code.

## Constructors

### Constructor

> **new SessionManager**(): `SessionManager`

#### Returns

`SessionManager`

## Accessors

### activeSession

#### Get Signature

> **get** **activeSession**(): [`SessionMeta`](../interfaces/SessionMeta.md)

Defined in: [SessionManager.ts:106](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L106)

The managed session which is currently active

##### Returns

[`SessionMeta`](../interfaces/SessionMeta.md)

***

### exitCode

#### Get Signature

> **get** **exitCode**(): `number`

Defined in: [SessionManager.ts:113](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L113)

The numeric exit code of the active session's last completed command.

##### Returns

`number`

***

### output

#### Get Signature

> **get** **output**(): `string`

Defined in: [SessionManager.ts:121](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L121)

The output from the active session's last executed command. Whitespace is
trimmed from both ends.

##### Returns

`string`

***

### sessions

#### Get Signature

> **get** **sessions**(): [`SessionMeta`](../interfaces/SessionMeta.md)[]

Defined in: [SessionManager.ts:137](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L137)

The list of managed sessions

##### Returns

[`SessionMeta`](../interfaces/SessionMeta.md)[]

## Methods

### addSession()

> **addSession**(`session`, `name?`, `activate?`): [`SessionMeta`](../interfaces/SessionMeta.md)

Defined in: [SessionManager.ts:148](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L148)

Adds a new managed session.

#### Parameters

##### session

`SystemIOSession`

The session to manage

##### name?

`string`

The name of the session, for easy reference

##### activate?

`boolean` = `true`

Activate the new session

#### Returns

[`SessionMeta`](../interfaces/SessionMeta.md)

***

### kill()

> **kill**(`opts`): `Promise`\<`void`\>

Defined in: [SessionManager.ts:170](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L170)

Gracefully terminates a managed session. Resolves once the session is
fully closed.

#### Parameters

##### opts

[`SessionManagerOptions`](../interfaces/SessionManagerOptions.md) = `{}`

Options to modify the behavior of kill()

#### Returns

`Promise`\<`void`\>

***

### killAll()

> **killAll**(): `Promise`\<`void`\>

Defined in: [SessionManager.ts:185](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L185)

Gracefully terminate all managed sessions.  Resolves once all sessions
are fully closed.

#### Returns

`Promise`\<`void`\>

***

### removeSession()

> **removeSession**(`opts`): `void`

Defined in: [SessionManager.ts:198](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L198)

Remove a managed session.

#### Parameters

##### opts

[`SessionManagerOptions`](../interfaces/SessionManagerOptions.md) = `{}`

Options to modify the behavior of removeSession()

#### Returns

`void`

***

### run()

> **run**(`command`, `opts`): [`CommandMeta`](../interfaces/CommandMeta.md)

Defined in: [SessionManager.ts:231](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L231)

Executes a single command within a managed session.

Only one command may be active at a time in any given session. Output and
exit code are available via `output` and `exitCode` once resolved.

#### Parameters

##### command

`string`

The command to execute

##### opts

[`SessionManagerOptions`](../interfaces/SessionManagerOptions.md) = `{}`

Options to modify the behavior of run()

#### Returns

[`CommandMeta`](../interfaces/CommandMeta.md)

#### Remarks

Multiple commands can be chained in a single command string
with "&" or ";". Ex: `echo first;echo second`

#### Throws

AssertionError
If another command is already in progress

***

### switchToNextSession()

> **switchToNextSession**(): `void`

Defined in: [SessionManager.ts:266](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L266)

Switch to the next session in the list.

#### Returns

`void`

#### Remarks

If there is no next session, the first session in the list is activated.

***

### waitForOutput()

> **waitForOutput**(`opts`): `Promise`\<[`OutputMeta`](../interfaces/OutputMeta.md)\>

Defined in: [SessionManager.ts:278](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L278)

Wait for the last command in a managed session to produce output.

#### Parameters

##### opts

[`WaitForOutputOptions`](../interfaces/WaitForOutputOptions.md) = `{}`

Options to modify the behavior of waitForOutput()

#### Returns

`Promise`\<[`OutputMeta`](../interfaces/OutputMeta.md)\>

***

### waitForReturn()

> **waitForReturn**(`opts`): `Promise`\<[`CommandMeta`](../interfaces/CommandMeta.md)\>

Defined in: [SessionManager.ts:302](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L302)

Wait for the last command in a managed session to return.

#### Parameters

##### opts

[`SessionManagerOptions`](../interfaces/SessionManagerOptions.md) = `{}`

Options to modify the behavior of waitForOutput()

#### Returns

`Promise`\<[`CommandMeta`](../interfaces/CommandMeta.md)\>

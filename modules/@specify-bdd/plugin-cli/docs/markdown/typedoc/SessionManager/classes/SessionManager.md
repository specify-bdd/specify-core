[**@specify-bdd/plugin-cli**](../../README.md)

***

[@specify-bdd/plugin-cli](../../modules.md) / [SessionManager](../README.md) / SessionManager

# Class: SessionManager

Defined in: [SessionManager.ts:110](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L110)

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

Defined in: [SessionManager.ts:124](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L124)

The managed session which is currently active

##### Returns

[`SessionMeta`](../interfaces/SessionMeta.md)

***

### commandElapsedTime

#### Get Signature

> **get** **commandElapsedTime**(): `number`

Defined in: [SessionManager.ts:131](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L131)

The elapsed time, in milliseconds, of the active session's last completed command.

##### Returns

`number`

***

### commandEndTime

#### Get Signature

> **get** **commandEndTime**(): `number`

Defined in: [SessionManager.ts:138](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L138)

The end time of the active session's last completed command.

##### Returns

`number`

***

### commandStartTime

#### Get Signature

> **get** **commandStartTime**(): `number`

Defined in: [SessionManager.ts:145](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L145)

The start time of the active session's last completed command.

##### Returns

`number`

***

### cwd

#### Get Signature

> **get** **cwd**(): `string`

Defined in: [SessionManager.ts:152](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L152)

The current working directory of the active session.

##### Returns

`string`

***

### exitCode

#### Get Signature

> **get** **exitCode**(): `number`

Defined in: [SessionManager.ts:159](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L159)

The numeric exit code of the active session's last completed command.

##### Returns

`number`

***

### output

#### Get Signature

> **get** **output**(): `string`

Defined in: [SessionManager.ts:167](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L167)

The output from the active session's last executed command. Whitespace is
trimmed from both ends.

##### Returns

`string`

***

### sessions

#### Get Signature

> **get** **sessions**(): [`SessionMeta`](../interfaces/SessionMeta.md)[]

Defined in: [SessionManager.ts:183](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L183)

The list of managed sessions

##### Returns

[`SessionMeta`](../interfaces/SessionMeta.md)[]

## Methods

### addSession()

> **addSession**(`session`, `name?`, `cwd?`, `activate?`): [`SessionMeta`](../interfaces/SessionMeta.md)

Defined in: [SessionManager.ts:196](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L196)

Adds a new managed session.

#### Parameters

##### session

`SystemIOSession`

The session to manage

##### name?

`string`

The name of the session, for easy reference

##### cwd?

`string`

The session's current working directory; defaults to
                  the manager's CWD

##### activate?

`boolean` = `true`

Activate the new session

#### Returns

[`SessionMeta`](../interfaces/SessionMeta.md)

***

### findSession()

> **findSession**(`selector`): [`SessionMeta`](../interfaces/SessionMeta.md)

Defined in: [SessionManager.ts:229](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L229)

Find the SessionMeta that matches the given selector.

#### Parameters

##### selector

The index or name of the session to find

`string` | `number`

#### Returns

[`SessionMeta`](../interfaces/SessionMeta.md)

The matching SessionMeta

#### Throws

Error
If there is no matching session

***

### killAllSessions()

> **killAllSessions**(): `Promise`\<`void`\>

Defined in: [SessionManager.ts:276](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L276)

Gracefully terminate all managed sessions.  Resolves once all sessions
are fully closed.

#### Returns

`Promise`\<`void`\>

***

### killCommand()

> **killCommand**(`opts`, `signal`): `Promise`\<`void`\>

Defined in: [SessionManager.ts:249](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L249)

Gracefully terminates the command in a managed session. Resolves once the command is killed.

#### Parameters

##### opts

[`SessionManagerOptions`](../interfaces/SessionManagerOptions.md) = `{}`

Options to modify the behavior of killSession()

##### signal

`string` = `"SIGTERM"`

#### Returns

`Promise`\<`void`\>

***

### killSession()

> **killSession**(`opts`, `signal`): `Promise`\<`void`\>

Defined in: [SessionManager.ts:261](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L261)

Gracefully terminates a managed session. Resolves once the session is
fully closed.

#### Parameters

##### opts

[`SessionManagerOptions`](../interfaces/SessionManagerOptions.md) = `{}`

Options to modify the behavior of killSession()

##### signal

`string` = `"SIGTERM"`

#### Returns

`Promise`\<`void`\>

***

### removeSession()

> **removeSession**(`opts`): `void`

Defined in: [SessionManager.ts:291](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L291)

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

Defined in: [SessionManager.ts:324](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L324)

Executes a single command within a managed session.

Only one command may be active at a time in any given session. Output and
exit code are available via `output` and `exitCode` once resolved.

#### Parameters

##### command

`string`

The command to execute

##### opts

[`CommandOptions`](../interfaces/CommandOptions.md) = `{}`

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

### sendInput()

> **sendInput**(`input`, `opts`): `void`

Defined in: [SessionManager.ts:361](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L361)

Send input to the active (or specified) session. Will not automatically
append a newline, so this can be used for interactive input.

#### Parameters

##### input

`string`

The input to send

##### opts

[`SessionManagerOptions`](../interfaces/SessionManagerOptions.md) = `{}`

Options to modify the behavior of sendInput()

#### Returns

`void`

***

### switchToNextSession()

> **switchToNextSession**(): `void`

Defined in: [SessionManager.ts:373](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L373)

Switch to the next session in the list.

#### Returns

`void`

#### Remarks

If there is no next session, the first session in the list is activated.

***

### switchToSession()

> **switchToSession**(`opts`): `void`

Defined in: [SessionManager.ts:388](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L388)

Switch to the given session.

#### Parameters

##### opts

[`SessionManagerOptions`](../interfaces/SessionManagerOptions.md)

Options to modify the behavior of switchToSession()

#### Returns

`void`

#### Throws

Error
If the given session is invalid

***

### validateShell()

> **validateShell**(`shellType`): `Promise`\<`boolean`\>

Defined in: [SessionManager.ts:403](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L403)

Validate the shell type of the active session.

#### Parameters

##### shellType

`string`

The expected shell type

#### Returns

`Promise`\<`boolean`\>

Whether its the correct type or not

***

### waitForOutput()

> **waitForOutput**(`opts`): `Promise`\<[`OutputMeta`](../interfaces/OutputMeta.md)\>

Defined in: [SessionManager.ts:422](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L422)

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

Defined in: [SessionManager.ts:446](https://github.com/specify-bdd/specify-core/blob/7ca8aaa49e513e4ce7a17060b2bffd3701db5f36/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L446)

Wait for the last command in a managed session to return.

#### Parameters

##### opts

[`SessionManagerOptions`](../interfaces/SessionManagerOptions.md) = `{}`

Options to modify the behavior of waitForOutput()

#### Returns

`Promise`\<[`CommandMeta`](../interfaces/CommandMeta.md)\>

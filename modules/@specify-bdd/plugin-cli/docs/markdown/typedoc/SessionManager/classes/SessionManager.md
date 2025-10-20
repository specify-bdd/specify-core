[**@specify-bdd/plugin-cli**](../../README.md)

***

[@specify-bdd/plugin-cli](../../modules.md) / [SessionManager](../README.md) / SessionManager

# Class: SessionManager

Defined in: [SessionManager.ts:101](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L101)

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

Defined in: [SessionManager.ts:115](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L115)

The managed session which is currently active

##### Returns

[`SessionMeta`](../interfaces/SessionMeta.md)

***

### commandElapsedTime

#### Get Signature

> **get** **commandElapsedTime**(): `number`

Defined in: [SessionManager.ts:122](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L122)

The elapsed time, in milliseconds, of the active session's last completed command.

##### Returns

`number`

***

### commandEndTime

#### Get Signature

> **get** **commandEndTime**(): `number`

Defined in: [SessionManager.ts:129](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L129)

The end time of the active session's last completed command.

##### Returns

`number`

***

### commandStartTime

#### Get Signature

> **get** **commandStartTime**(): `number`

Defined in: [SessionManager.ts:136](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L136)

The start time of the active session's last completed command.

##### Returns

`number`

***

### cwd

#### Get Signature

> **get** **cwd**(): `string`

Defined in: [SessionManager.ts:143](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L143)

The current working directory of the active session.

##### Returns

`string`

***

### exitCode

#### Get Signature

> **get** **exitCode**(): `number`

Defined in: [SessionManager.ts:150](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L150)

The numeric exit code of the active session's last completed command.

##### Returns

`number`

***

### output

#### Get Signature

> **get** **output**(): `string`

Defined in: [SessionManager.ts:158](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L158)

The output from the active session's last executed command. Whitespace is
trimmed from both ends.

##### Returns

`string`

***

### sessions

#### Get Signature

> **get** **sessions**(): [`SessionMeta`](../interfaces/SessionMeta.md)[]

Defined in: [SessionManager.ts:174](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L174)

The list of managed sessions

##### Returns

[`SessionMeta`](../interfaces/SessionMeta.md)[]

## Methods

### addSession()

> **addSession**(`session`, `name?`, `cwd?`, `activate?`): [`SessionMeta`](../interfaces/SessionMeta.md)

Defined in: [SessionManager.ts:187](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L187)

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

### killAllSessions()

> **killAllSessions**(): `Promise`\<`void`\>

Defined in: [SessionManager.ts:242](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L242)

Gracefully terminate all managed sessions.  Resolves once all sessions
are fully closed.

#### Returns

`Promise`\<`void`\>

***

### killCommand()

> **killCommand**(`opts`, `signal`): `Promise`\<`void`\>

Defined in: [SessionManager.ts:215](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L215)

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

Defined in: [SessionManager.ts:227](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L227)

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

Defined in: [SessionManager.ts:257](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L257)

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

Defined in: [SessionManager.ts:290](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L290)

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

Defined in: [SessionManager.ts:325](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L325)

Switch to the next session in the list.

#### Returns

`void`

#### Remarks

If there is no next session, the first session in the list is activated.

***

### waitForOutput()

> **waitForOutput**(`opts`): `Promise`\<[`OutputMeta`](../interfaces/OutputMeta.md)\>

Defined in: [SessionManager.ts:337](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L337)

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

Defined in: [SessionManager.ts:361](https://github.com/specify-bdd/specify-core/blob/95536ec0c83ec2676c210c37b110070e5897fa12/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L361)

Wait for the last command in a managed session to return.

#### Parameters

##### opts

[`SessionManagerOptions`](../interfaces/SessionManagerOptions.md) = `{}`

Options to modify the behavior of waitForOutput()

#### Returns

`Promise`\<[`CommandMeta`](../interfaces/CommandMeta.md)\>

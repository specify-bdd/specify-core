[**@specify-bdd/specify**](../../README.md)

***

[@specify-bdd/specify](../../modules.md) / [Command](../README.md) / Command

# Abstract Class: Command

Defined in: [Command.ts:40](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/specify/src/lib/Command.ts#L40)

## Extended by

- [`TestCommand`](../../TestCommand/classes/TestCommand.md)

## Constructors

### Constructor

> **new Command**(`userOpts`): `Command`

Defined in: [Command.ts:56](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/specify/src/lib/Command.ts#L56)

Store user args and options data.

#### Parameters

##### userOpts

[`CommandOptions`](../interfaces/CommandOptions.md)

User-supplied options

#### Returns

`Command`

## Properties

### debug

> **debug**: `boolean`

Defined in: [Command.ts:44](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/specify/src/lib/Command.ts#L44)

Output debug info for this command.

***

### logPath

> **logPath**: `string`

Defined in: [Command.ts:49](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/specify/src/lib/Command.ts#L49)

The file system path to write log output to.

## Methods

### execute()

> **execute**(`userArgs`): `Promise`\<[`CommandResult`](../interfaces/CommandResult.md)\>

Defined in: [Command.ts:72](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/specify/src/lib/Command.ts#L72)

Execute the Command.  This method should be overridden by child
classes, or it will just return an error result.

#### Parameters

##### userArgs

`any`

User-supplied arguments

#### Returns

`Promise`\<[`CommandResult`](../interfaces/CommandResult.md)\>

The Command result

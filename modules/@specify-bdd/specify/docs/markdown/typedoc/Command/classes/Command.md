[**@specify-bdd/specify**](../../README.md)

***

[@specify-bdd/specify](../../modules.md) / [Command](../README.md) / Command

# Abstract Class: Command

Defined in: [modules/@specify-bdd/specify/src/lib/Command.ts:40](https://github.com/specify-bdd/specify-core/blob/088ccad253a8897bc366dec613dbf080821f32a3/modules/@specify-bdd/specify/src/lib/Command.ts#L40)

## Extended by

- [`TestCommand`](../../TestCommand/classes/TestCommand.md)

## Constructors

### Constructor

> **new Command**(`userOpts`): `Command`

Defined in: [modules/@specify-bdd/specify/src/lib/Command.ts:56](https://github.com/specify-bdd/specify-core/blob/088ccad253a8897bc366dec613dbf080821f32a3/modules/@specify-bdd/specify/src/lib/Command.ts#L56)

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

Defined in: [modules/@specify-bdd/specify/src/lib/Command.ts:44](https://github.com/specify-bdd/specify-core/blob/088ccad253a8897bc366dec613dbf080821f32a3/modules/@specify-bdd/specify/src/lib/Command.ts#L44)

Output debug info for this command.

***

### logPath

> **logPath**: `string`

Defined in: [modules/@specify-bdd/specify/src/lib/Command.ts:49](https://github.com/specify-bdd/specify-core/blob/088ccad253a8897bc366dec613dbf080821f32a3/modules/@specify-bdd/specify/src/lib/Command.ts#L49)

The file system path to write log output to.

## Methods

### execute()

> **execute**(`userArgs`): `Promise`\<[`CommandResult`](../interfaces/CommandResult.md)\>

Defined in: [modules/@specify-bdd/specify/src/lib/Command.ts:71](https://github.com/specify-bdd/specify-core/blob/088ccad253a8897bc366dec613dbf080821f32a3/modules/@specify-bdd/specify/src/lib/Command.ts#L71)

Execute the Command.  This method should be overridden by child
classes, or it will just return an error result.

#### Parameters

##### userArgs

`JsonObject`

User-supplied arguments

#### Returns

`Promise`\<[`CommandResult`](../interfaces/CommandResult.md)\>

The Command result

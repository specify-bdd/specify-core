[**@specify/core**](../../README.md)

***

[@specify/core](../../modules.md) / [Command](../README.md) / Command

# Abstract Class: Command

Defined in: [modules/@specify/core/src/lib/Command.ts:49](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/Command.ts#L49)

## Extended by

- [`TestCommand`](../../TestCommand/classes/TestCommand.md)

## Constructors

### Constructor

> **new Command**(`userOpts`): `Command`

Defined in: [modules/@specify/core/src/lib/Command.ts:65](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/Command.ts#L65)

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

Defined in: [modules/@specify/core/src/lib/Command.ts:53](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/Command.ts#L53)

Output debug info for this command.

***

### logPath

> **logPath**: `string`

Defined in: [modules/@specify/core/src/lib/Command.ts:58](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/Command.ts#L58)

The file system path to write log output to.

## Methods

### execute()

> **execute**(`userArgs`): `Promise`\<[`CommandResult`](../interfaces/CommandResult.md)\>

Defined in: [modules/@specify/core/src/lib/Command.ts:80](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/Command.ts#L80)

Execute the Command.  This method should be overridden by child
classes, or it will just return an error result.

#### Parameters

##### userArgs

`ParsedArgs`

User-supplied arguments

#### Returns

`Promise`\<[`CommandResult`](../interfaces/CommandResult.md)\>

The Command result

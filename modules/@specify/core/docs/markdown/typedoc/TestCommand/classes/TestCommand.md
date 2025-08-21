[**@specify/core**](../../README.md)

***

[@specify/core](../../modules.md) / [TestCommand](../README.md) / TestCommand

# Class: TestCommand

Defined in: [modules/@specify/core/src/lib/TestCommand.ts:58](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/TestCommand.ts#L58)

## Extends

- [`Command`](../../Command/classes/Command.md)

## Constructors

### Constructor

> **new TestCommand**(`userOpts`): `TestCommand`

Defined in: [modules/@specify/core/src/lib/TestCommand.ts:74](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/TestCommand.ts#L74)

Parse user arguments and options data to prepare operational parameters

#### Parameters

##### userOpts

[`TestCommandOptions`](../interfaces/TestCommandOptions.md) = `{}`

User-supplied options

#### Returns

`TestCommand`

#### Overrides

[`Command`](../../Command/classes/Command.md).[`constructor`](../../Command/classes/Command.md#constructor)

## Properties

### cucumber

> **cucumber**: `Partial`\<`IConfiguration`\>

Defined in: [modules/@specify/core/src/lib/TestCommand.ts:62](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/TestCommand.ts#L62)

A raw Cucumber configuration.

***

### debug

> **debug**: `boolean`

Defined in: [modules/@specify/core/src/lib/Command.ts:53](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/Command.ts#L53)

Output debug info for this command.

#### Inherited from

[`Command`](../../Command/classes/Command.md).[`debug`](../../Command/classes/Command.md#debug)

***

### gherkinPaths

> **gherkinPaths**: `string`[]

Defined in: [modules/@specify/core/src/lib/TestCommand.ts:67](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/TestCommand.ts#L67)

A list of paths to Gherkin feature files this Command should execute.

***

### logPath

> **logPath**: `string`

Defined in: [modules/@specify/core/src/lib/Command.ts:58](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/Command.ts#L58)

The file system path to write log output to.

#### Inherited from

[`Command`](../../Command/classes/Command.md).[`logPath`](../../Command/classes/Command.md#logpath)

## Methods

### execute()

> **execute**(`userArgs`): `Promise`\<[`TestCommandResult`](../interfaces/TestCommandResult.md)\>

Defined in: [modules/@specify/core/src/lib/TestCommand.ts:102](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/TestCommand.ts#L102)

Execute tests with Cucumber.  Consider a no-op result from Cucumber to
be an error condition.

#### Parameters

##### userArgs

`ParsedArgs`

User-supplied arguments

#### Returns

`Promise`\<[`TestCommandResult`](../interfaces/TestCommandResult.md)\>

The Command result

#### Overrides

[`Command`](../../Command/classes/Command.md).[`execute`](../../Command/classes/Command.md#execute)

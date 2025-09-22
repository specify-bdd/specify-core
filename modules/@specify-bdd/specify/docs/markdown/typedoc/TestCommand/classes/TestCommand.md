[**@specify-bdd/specify**](../../README.md)

***

[@specify-bdd/specify](../../modules.md) / [TestCommand](../README.md) / TestCommand

# Class: TestCommand

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:66](https://github.com/specify-bdd/specify-core/blob/142f928c2899f88df5447c22dedb5d7a2ce8c552/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L66)

## Extends

- [`Command`](../../Command/classes/Command.md)

## Constructors

### Constructor

> **new TestCommand**(`userOpts`): `TestCommand`

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:82](https://github.com/specify-bdd/specify-core/blob/142f928c2899f88df5447c22dedb5d7a2ce8c552/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L82)

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

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:70](https://github.com/specify-bdd/specify-core/blob/142f928c2899f88df5447c22dedb5d7a2ce8c552/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L70)

A raw Cucumber configuration.

***

### debug

> **debug**: `boolean`

Defined in: [modules/@specify-bdd/specify/src/lib/Command.ts:44](https://github.com/specify-bdd/specify-core/blob/142f928c2899f88df5447c22dedb5d7a2ce8c552/modules/@specify-bdd/specify/src/lib/Command.ts#L44)

Output debug info for this command.

#### Inherited from

[`Command`](../../Command/classes/Command.md).[`debug`](../../Command/classes/Command.md#debug)

***

### gherkinPaths

> **gherkinPaths**: `string`[]

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:75](https://github.com/specify-bdd/specify-core/blob/142f928c2899f88df5447c22dedb5d7a2ce8c552/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L75)

A list of paths to Gherkin feature files this Command should execute.

***

### logPath

> **logPath**: `string`

Defined in: [modules/@specify-bdd/specify/src/lib/Command.ts:49](https://github.com/specify-bdd/specify-core/blob/142f928c2899f88df5447c22dedb5d7a2ce8c552/modules/@specify-bdd/specify/src/lib/Command.ts#L49)

The file system path to write log output to.

#### Inherited from

[`Command`](../../Command/classes/Command.md).[`logPath`](../../Command/classes/Command.md#logpath)

## Methods

### execute()

> **execute**(`userArgs`): `Promise`\<[`TestCommandResult`](../interfaces/TestCommandResult.md)\>

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:110](https://github.com/specify-bdd/specify-core/blob/142f928c2899f88df5447c22dedb5d7a2ce8c552/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L110)

Execute tests with Cucumber.  Consider a no-op result from Cucumber to
be an error condition.

#### Parameters

##### userArgs

[`TestCommandArguments`](../interfaces/TestCommandArguments.md)

User-supplied arguments

#### Returns

`Promise`\<[`TestCommandResult`](../interfaces/TestCommandResult.md)\>

The Command result

#### Overrides

[`Command`](../../Command/classes/Command.md).[`execute`](../../Command/classes/Command.md#execute)

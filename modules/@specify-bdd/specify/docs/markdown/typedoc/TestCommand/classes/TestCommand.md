[**@specify-bdd/specify**](../../README.md)

***

[@specify-bdd/specify](../../modules.md) / [TestCommand](../README.md) / TestCommand

# Class: TestCommand

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:67](https://github.com/specify-bdd/specify-core/blob/a72967d5d7ff6946c1828988ad1d054ed520ad4a/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L67)

## Extends

- [`Command`](../../Command/classes/Command.md)

## Constructors

### Constructor

> **new TestCommand**(`userOpts`): `TestCommand`

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:83](https://github.com/specify-bdd/specify-core/blob/a72967d5d7ff6946c1828988ad1d054ed520ad4a/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L83)

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

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:71](https://github.com/specify-bdd/specify-core/blob/a72967d5d7ff6946c1828988ad1d054ed520ad4a/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L71)

A raw Cucumber configuration.

***

### debug

> **debug**: `boolean`

Defined in: [modules/@specify-bdd/specify/src/lib/Command.ts:44](https://github.com/specify-bdd/specify-core/blob/a72967d5d7ff6946c1828988ad1d054ed520ad4a/modules/@specify-bdd/specify/src/lib/Command.ts#L44)

Output debug info for this command.

#### Inherited from

[`Command`](../../Command/classes/Command.md).[`debug`](../../Command/classes/Command.md#debug)

***

### gherkinPaths

> **gherkinPaths**: `string`[]

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:76](https://github.com/specify-bdd/specify-core/blob/a72967d5d7ff6946c1828988ad1d054ed520ad4a/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L76)

A list of paths to Gherkin feature files this Command should execute.

***

### logPath

> **logPath**: `string`

Defined in: [modules/@specify-bdd/specify/src/lib/Command.ts:49](https://github.com/specify-bdd/specify-core/blob/a72967d5d7ff6946c1828988ad1d054ed520ad4a/modules/@specify-bdd/specify/src/lib/Command.ts#L49)

The file system path to write log output to.

#### Inherited from

[`Command`](../../Command/classes/Command.md).[`logPath`](../../Command/classes/Command.md#logpath)

## Methods

### execute()

> **execute**(`userArgs`): `Promise`\<[`TestCommandResult`](../interfaces/TestCommandResult.md)\>

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:111](https://github.com/specify-bdd/specify-core/blob/a72967d5d7ff6946c1828988ad1d054ed520ad4a/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L111)

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

[**@specify-bdd/specify**](../../README.md)

***

[@specify-bdd/specify](../../modules.md) / [TestCommandWatcher](../README.md) / TestCommandWatcher

# Class: TestCommandWatcher

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts:29](https://github.com/specify-bdd/specify-core/blob/8d56e00368fb4979647536584799f41d4f8aa6f7/modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts#L29)

## Constructors

### Constructor

> **new TestCommandWatcher**(`command`): `TestCommandWatcher`

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts:93](https://github.com/specify-bdd/specify-core/blob/8d56e00368fb4979647536584799f41d4f8aa6f7/modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts#L93)

Initialize the TestCommandWatcher.

#### Parameters

##### command

[`TestCommand`](../../TestCommand/classes/TestCommand.md)

The TestCommand instance to watch and execute

#### Returns

`TestCommandWatcher`

## Methods

### start()

> **start**(`args`): `Promise`\<`void`\>

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts:209](https://github.com/specify-bdd/specify-core/blob/8d56e00368fb4979647536584799f41d4f8aa6f7/modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts#L209)

Start watching for file changes and execute the command when changes occur.

#### Parameters

##### args

[`TestCommandArguments`](../../TestCommand/interfaces/TestCommandArguments.md)

Command line arguments to pass to the TestCommand

#### Returns

`Promise`\<`void`\>

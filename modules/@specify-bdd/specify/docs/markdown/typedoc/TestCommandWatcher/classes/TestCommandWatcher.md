[**@specify-bdd/specify**](../../README.md)

***

[@specify-bdd/specify](../../modules.md) / [TestCommandWatcher](../README.md) / TestCommandWatcher

# Class: TestCommandWatcher

Defined in: [TestCommandWatcher.ts:24](https://github.com/specify-bdd/specify-core/blob/757bc198012e6b49e3c9a8802a95b728349e8b41/modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts#L24)

## Constructors

### Constructor

> **new TestCommandWatcher**(`command`): `TestCommandWatcher`

Defined in: [TestCommandWatcher.ts:81](https://github.com/specify-bdd/specify-core/blob/757bc198012e6b49e3c9a8802a95b728349e8b41/modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts#L81)

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

Defined in: [TestCommandWatcher.ts:171](https://github.com/specify-bdd/specify-core/blob/757bc198012e6b49e3c9a8802a95b728349e8b41/modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts#L171)

Start watching for file changes and execute the command when changes occur.

#### Parameters

##### args

[`TestCommandArguments`](../../TestCommand/interfaces/TestCommandArguments.md)

Command line arguments to pass to the TestCommand

#### Returns

`Promise`\<`void`\>

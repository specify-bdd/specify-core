[**@specify-bdd/specify**](../../README.md)

***

[@specify-bdd/specify](../../modules.md) / [TestCommandWatcher](../README.md) / TestCommandWatcher

# Class: TestCommandWatcher

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts:30](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts#L30)

## Constructors

### Constructor

> **new TestCommandWatcher**(`command`): `TestCommandWatcher`

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts:94](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts#L94)

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

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts:210](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts#L210)

Start watching for file changes and execute the command when changes occur.

#### Parameters

##### args

`ParsedArgs`

Command line arguments to pass to the TestCommand

#### Returns

`Promise`\<`void`\>

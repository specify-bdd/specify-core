[**@specify-bdd/specify**](../../README.md)

***

[@specify-bdd/specify](../../modules.md) / [TestCommandWatcher](../README.md) / TestCommandWatcher

# Class: TestCommandWatcher

Defined in: [TestCommandWatcher.ts:24](https://github.com/specify-bdd/specify-core/blob/d16f7535e9a422d29e16c0535b6c65660bae8f1d/modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts#L24)

## Constructors

### Constructor

> **new TestCommandWatcher**(`command`): `TestCommandWatcher`

Defined in: [TestCommandWatcher.ts:81](https://github.com/specify-bdd/specify-core/blob/d16f7535e9a422d29e16c0535b6c65660bae8f1d/modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts#L81)

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

Defined in: [TestCommandWatcher.ts:171](https://github.com/specify-bdd/specify-core/blob/d16f7535e9a422d29e16c0535b6c65660bae8f1d/modules/@specify-bdd/specify/src/lib/TestCommandWatcher.ts#L171)

Start watching for file changes and execute the command when changes occur.

#### Parameters

##### args

[`TestCommandArguments`](../../TestCommand/interfaces/TestCommandArguments.md)

Command line arguments to pass to the TestCommand

#### Returns

`Promise`\<`void`\>

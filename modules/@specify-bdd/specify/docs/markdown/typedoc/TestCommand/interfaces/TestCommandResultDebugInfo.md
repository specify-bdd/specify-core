[**@specify-bdd/specify**](../../README.md)

***

[@specify-bdd/specify](../../modules.md) / [TestCommand](../README.md) / TestCommandResultDebugInfo

# Interface: TestCommandResultDebugInfo

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:57](https://github.com/specify-bdd/specify-core/blob/b47338cce98c34b2e68fbf033eb22e90c70e41ea/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L57)

## Extends

- [`CommandResultDebugInfo`](../../Command/interfaces/CommandResultDebugInfo.md)

## Properties

### args?

> `optional` **args**: [`TestCommandArguments`](TestCommandArguments.md)

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:58](https://github.com/specify-bdd/specify-core/blob/b47338cce98c34b2e68fbf033eb22e90c70e41ea/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L58)

#### Overrides

[`CommandResultDebugInfo`](../../Command/interfaces/CommandResultDebugInfo.md).[`args`](../../Command/interfaces/CommandResultDebugInfo.md#args)

***

### cucumber?

> `optional` **cucumber**: `object`

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:59](https://github.com/specify-bdd/specify-core/blob/b47338cce98c34b2e68fbf033eb22e90c70e41ea/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L59)

#### runConfiguration?

> `optional` **runConfiguration**: `IRunConfiguration`

#### runEnvironment?

> `optional` **runEnvironment**: `IRunEnvironment`

#### runResult?

> `optional` **runResult**: `IRunResult`

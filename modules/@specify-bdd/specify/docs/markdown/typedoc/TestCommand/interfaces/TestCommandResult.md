[**@specify-bdd/specify**](../../README.md)

***

[@specify-bdd/specify](../../modules.md) / [TestCommand](../README.md) / TestCommandResult

# Interface: TestCommandResult

Defined in: [TestCommand.ts:56](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L56)

## Extends

- [`CommandResult`](../../Command/interfaces/CommandResult.md)

## Properties

### debug?

> `optional` **debug**: [`TestCommandResultDebugInfo`](TestCommandResultDebugInfo.md)

Defined in: [TestCommand.ts:57](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L57)

#### Overrides

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`debug`](../../Command/interfaces/CommandResult.md#debug)

***

### error?

> `optional` **error**: `JsonObject`

Defined in: [Command.ts:25](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/specify/src/lib/Command.ts#L25)

#### Inherited from

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`error`](../../Command/interfaces/CommandResult.md#error)

***

### ok

> **ok**: `boolean`

Defined in: [Command.ts:23](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/specify/src/lib/Command.ts#L23)

#### Inherited from

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`ok`](../../Command/interfaces/CommandResult.md#ok)

***

### result?

> `optional` **result**: `JsonValue`

Defined in: [Command.ts:26](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/specify/src/lib/Command.ts#L26)

#### Inherited from

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`result`](../../Command/interfaces/CommandResult.md#result)

***

### status

> **status**: [`CommandResultStatus`](../../Command/enumerations/CommandResultStatus.md)

Defined in: [Command.ts:24](https://github.com/specify-bdd/specify-core/blob/002f297bfe6da30a30fb2352df5d00b678e11d18/modules/@specify-bdd/specify/src/lib/Command.ts#L24)

#### Inherited from

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`status`](../../Command/interfaces/CommandResult.md#status)

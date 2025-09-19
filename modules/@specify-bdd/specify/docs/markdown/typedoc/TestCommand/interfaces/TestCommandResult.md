[**@specify-bdd/specify**](../../README.md)

***

[@specify-bdd/specify](../../modules.md) / [TestCommand](../README.md) / TestCommandResult

# Interface: TestCommandResult

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:53](https://github.com/specify-bdd/specify-core/blob/ff8f0729666668ac0689da959ff440a4b4121187/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L53)

## Extends

- [`CommandResult`](../../Command/interfaces/CommandResult.md)

## Properties

### debug?

> `optional` **debug**: [`TestCommandResultDebugInfo`](TestCommandResultDebugInfo.md)

Defined in: [modules/@specify-bdd/specify/src/lib/TestCommand.ts:54](https://github.com/specify-bdd/specify-core/blob/ff8f0729666668ac0689da959ff440a4b4121187/modules/@specify-bdd/specify/src/lib/TestCommand.ts#L54)

#### Overrides

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`debug`](../../Command/interfaces/CommandResult.md#debug)

***

### error?

> `optional` **error**: `JsonObject`

Defined in: [modules/@specify-bdd/specify/src/lib/Command.ts:25](https://github.com/specify-bdd/specify-core/blob/ff8f0729666668ac0689da959ff440a4b4121187/modules/@specify-bdd/specify/src/lib/Command.ts#L25)

#### Inherited from

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`error`](../../Command/interfaces/CommandResult.md#error)

***

### ok

> **ok**: `boolean`

Defined in: [modules/@specify-bdd/specify/src/lib/Command.ts:23](https://github.com/specify-bdd/specify-core/blob/ff8f0729666668ac0689da959ff440a4b4121187/modules/@specify-bdd/specify/src/lib/Command.ts#L23)

#### Inherited from

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`ok`](../../Command/interfaces/CommandResult.md#ok)

***

### result?

> `optional` **result**: `JsonValue`

Defined in: [modules/@specify-bdd/specify/src/lib/Command.ts:26](https://github.com/specify-bdd/specify-core/blob/ff8f0729666668ac0689da959ff440a4b4121187/modules/@specify-bdd/specify/src/lib/Command.ts#L26)

#### Inherited from

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`result`](../../Command/interfaces/CommandResult.md#result)

***

### status

> **status**: [`CommandResultStatus`](../../Command/enumerations/CommandResultStatus.md)

Defined in: [modules/@specify-bdd/specify/src/lib/Command.ts:24](https://github.com/specify-bdd/specify-core/blob/ff8f0729666668ac0689da959ff440a4b4121187/modules/@specify-bdd/specify/src/lib/Command.ts#L24)

#### Inherited from

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`status`](../../Command/interfaces/CommandResult.md#status)

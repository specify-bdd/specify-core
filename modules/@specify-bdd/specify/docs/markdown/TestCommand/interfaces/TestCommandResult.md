[**@specify/core**](../../README.md)

***

[@specify/core](../../modules.md) / [TestCommand](../README.md) / TestCommandResult

# Interface: TestCommandResult

Defined in: [modules/@specify/core/src/lib/TestCommand.ts:46](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/TestCommand.ts#L46)

## Extends

- [`CommandResult`](../../Command/interfaces/CommandResult.md)

## Properties

### debug?

> `optional` **debug**: [`TestCommandResultDebugInfo`](TestCommandResultDebugInfo.md)

Defined in: [modules/@specify/core/src/lib/TestCommand.ts:47](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/TestCommand.ts#L47)

#### Overrides

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`debug`](../../Command/interfaces/CommandResult.md#debug)

***

### error?

> `optional` **error**: `JsonObject`

Defined in: [modules/@specify/core/src/lib/Command.ts:29](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/Command.ts#L29)

#### Inherited from

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`error`](../../Command/interfaces/CommandResult.md#error)

***

### ok

> **ok**: `boolean`

Defined in: [modules/@specify/core/src/lib/Command.ts:27](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/Command.ts#L27)

#### Inherited from

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`ok`](../../Command/interfaces/CommandResult.md#ok)

***

### result?

> `optional` **result**: `JsonValue`

Defined in: [modules/@specify/core/src/lib/Command.ts:30](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/Command.ts#L30)

#### Inherited from

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`result`](../../Command/interfaces/CommandResult.md#result)

***

### status

> **status**: [`CommandResultStatus`](../../Command/enumerations/CommandResultStatus.md)

Defined in: [modules/@specify/core/src/lib/Command.ts:28](https://github.com/specify-bdd/specify-core/blob/47b04e46253b9c5ba29e870a4c53fb0503a1b0ae/modules/@specify/core/src/lib/Command.ts#L28)

#### Inherited from

[`CommandResult`](../../Command/interfaces/CommandResult.md).[`status`](../../Command/interfaces/CommandResult.md#status)

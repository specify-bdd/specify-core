[**@specify-bdd/plugin-cli**](../../README.md)

***

[@specify-bdd/plugin-cli](../../modules.md) / [SessionManager](../README.md) / CommandMeta

# Interface: CommandMeta

Defined in: [SessionManager.ts:17](https://github.com/specify-bdd/specify-core/blob/d16f7535e9a422d29e16c0535b6c65660bae8f1d/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L17)

A metadata object representing one executed command.

## Properties

### command

> **command**: `string`

Defined in: [SessionManager.ts:18](https://github.com/specify-bdd/specify-core/blob/d16f7535e9a422d29e16c0535b6c65660bae8f1d/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L18)

***

### delimiter?

> `optional` **delimiter**: `Delimiter`

Defined in: [SessionManager.ts:19](https://github.com/specify-bdd/specify-core/blob/d16f7535e9a422d29e16c0535b6c65660bae8f1d/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L19)

***

### exitCode?

> `optional` **exitCode**: `number`

Defined in: [SessionManager.ts:20](https://github.com/specify-bdd/specify-core/blob/d16f7535e9a422d29e16c0535b6c65660bae8f1d/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L20)

***

### output

> **output**: [`OutputMeta`](OutputMeta.md)[]

Defined in: [SessionManager.ts:21](https://github.com/specify-bdd/specify-core/blob/d16f7535e9a422d29e16c0535b6c65660bae8f1d/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L21)

***

### promise?

> `optional` **promise**: `Promise`\<`CommandMeta`\>

Defined in: [SessionManager.ts:22](https://github.com/specify-bdd/specify-core/blob/d16f7535e9a422d29e16c0535b6c65660bae8f1d/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L22)

***

### reject()?

> `optional` **reject**: (`err`) => `void`

Defined in: [SessionManager.ts:23](https://github.com/specify-bdd/specify-core/blob/d16f7535e9a422d29e16c0535b6c65660bae8f1d/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L23)

#### Parameters

##### err

`Error`

#### Returns

`void`

***

### resolve()?

> `optional` **resolve**: (`cmdMeta`) => `void`

Defined in: [SessionManager.ts:24](https://github.com/specify-bdd/specify-core/blob/d16f7535e9a422d29e16c0535b6c65660bae8f1d/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L24)

#### Parameters

##### cmdMeta

`CommandMeta`

#### Returns

`void`

***

### timeEnd?

> `optional` **timeEnd**: `number`

Defined in: [SessionManager.ts:25](https://github.com/specify-bdd/specify-core/blob/d16f7535e9a422d29e16c0535b6c65660bae8f1d/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L25)

***

### timeStart?

> `optional` **timeStart**: `number`

Defined in: [SessionManager.ts:26](https://github.com/specify-bdd/specify-core/blob/d16f7535e9a422d29e16c0535b6c65660bae8f1d/modules/@specify-bdd/plugin-cli/src/lib/SessionManager.ts#L26)

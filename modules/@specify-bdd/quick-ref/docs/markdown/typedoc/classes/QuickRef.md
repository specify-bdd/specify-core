[**@specify-bdd/quick-ref**](../README.md)

***

[@specify-bdd/quick-ref](../README.md) / QuickRef

# Class: QuickRef

Defined in: [QuickRef.ts:12](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/quick-ref/src/lib/QuickRef.ts#L12)

## Constructors

### Constructor

> **new QuickRef**(...`refs`): `QuickRef`

Defined in: [QuickRef.ts:20](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/quick-ref/src/lib/QuickRef.ts#L20)

Initialize the reference object hierarchy with one or more JSON objects.

#### Parameters

##### refs

...`JsonObject`[]

One or more reference objects to combine and cache

#### Returns

`QuickRef`

## Accessors

### refs

#### Get Signature

> **get** **refs**(): `JsonObject`

Defined in: [QuickRef.ts:27](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/quick-ref/src/lib/QuickRef.ts#L27)

The cached reference objects aggregated into one JSON hierarchy

##### Returns

`JsonObject`

## Methods

### add()

> **add**(...`refs`): `QuickRef`

Defined in: [QuickRef.ts:45](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/quick-ref/src/lib/QuickRef.ts#L45)

Add one or more new JSON objects to the unified reference object
hierarchy.

#### Parameters

##### refs

...`JsonObject`[]

One or more reference objects to combine and cache

#### Returns

`QuickRef`

This instance

#### Remarks

When multiple arrays are assigned to the same address, the arrays are
not concatenated, but instead overwrite.  An alternative implementation
that concatenates is commented out and should remain here until we're
certain that we know how we want this to behave.

***

### lookup()

> **lookup**(...`segments`): `JsonValue`

Defined in: [QuickRef.ts:86](https://github.com/specify-bdd/specify-core/blob/f886d17f9d8689640b41a37f683750a408f0c53c/modules/@specify-bdd/quick-ref/src/lib/QuickRef.ts#L86)

Look up a reference by its address.  Params drill down through the
reference object hierarchy in the sequence provided.

#### Parameters

##### segments

...`string`[]

The address segments to look up.  For example, ("foo",
                  "bar", "baz") will retrieve the value of
                  refs.foo.bar.baz.

#### Returns

`JsonValue`

The value found at given address

#### Throws

Error
If the provided address segments do not exist in the reference object
hierarchy

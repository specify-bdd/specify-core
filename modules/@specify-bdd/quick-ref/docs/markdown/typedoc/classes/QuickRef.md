[**@specify-bdd/quick-ref**](../README.md)

***

[@specify-bdd/quick-ref](../README.md) / QuickRef

# Class: QuickRef

Defined in: [QuickRef.ts:14](https://github.com/specify-bdd/specify-core/blob/bc1131707d11b7271041451cead3b7997bd10476/modules/@specify-bdd/quick-ref/src/lib/QuickRef.ts#L14)

## Constructors

### Constructor

> **new QuickRef**(...`refs`): `QuickRef`

Defined in: [QuickRef.ts:25](https://github.com/specify-bdd/specify-core/blob/bc1131707d11b7271041451cead3b7997bd10476/modules/@specify-bdd/quick-ref/src/lib/QuickRef.ts#L25)

Initialize the reference object hierarchy with one or more JSON objects.

#### Parameters

##### refs

...`JsonObject`[]

One or more reference objects to combine and cache

#### Returns

`QuickRef`

## Accessors

### all

#### Get Signature

> **get** **all**(): `JsonObject`

Defined in: [QuickRef.ts:33](https://github.com/specify-bdd/specify-core/blob/bc1131707d11b7271041451cead3b7997bd10476/modules/@specify-bdd/quick-ref/src/lib/QuickRef.ts#L33)

A read-only accessor for all the references stored in this QuickRef
instance.

##### Returns

`JsonObject`

## Methods

### add()

> **add**(...`refs`): `QuickRef`

Defined in: [QuickRef.ts:51](https://github.com/specify-bdd/specify-core/blob/bc1131707d11b7271041451cead3b7997bd10476/modules/@specify-bdd/quick-ref/src/lib/QuickRef.ts#L51)

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

### lookupByAddress()

> **lookupByAddress**(`address?`): `JsonValue`

Defined in: [QuickRef.ts:87](https://github.com/specify-bdd/specify-core/blob/bc1131707d11b7271041451cead3b7997bd10476/modules/@specify-bdd/quick-ref/src/lib/QuickRef.ts#L87)

Look up a reference by its dot notation address.  If no address is 
provided, the entire reference store will be returned.

#### Parameters

##### address?

`string`

The address to look up. For example, ("foo.bar.baz")
                 will retrieve the value of this.#all.foo.bar.baz.

#### Returns

`JsonValue`

The value found at the given address

***

### lookupByKeys()

> **lookupByKeys**(...`segments`): `JsonValue`

Defined in: [QuickRef.ts:106](https://github.com/specify-bdd/specify-core/blob/bc1131707d11b7271041451cead3b7997bd10476/modules/@specify-bdd/quick-ref/src/lib/QuickRef.ts#L106)

Look up a reference by its keys.  Params drill down through the
reference object hierarchy in the key sequence provided.  If no keys are
provided, the entire reference store will be returned.

#### Parameters

##### segments

...`string`[]

The keys to look up. For example, ("foo", "bar", "baz")
                  will retrieve the value of this.#all.foo.bar.baz.

#### Returns

`JsonValue`

The value found at given key(s)

#### Throws

Error
If the provided keys do not exist in the reference object hierarchy.

***

### parse()

> **parse**(`input`): `string`

Defined in: [QuickRef.ts:139](https://github.com/specify-bdd/specify-core/blob/bc1131707d11b7271041451cead3b7997bd10476/modules/@specify-bdd/quick-ref/src/lib/QuickRef.ts#L139)

Parse a string which may contain reference notation and replace all ref
addresses found with their corresponding values.

#### Parameters

##### input

`string`

The input string to parse

#### Returns

`string`

The parsed input string

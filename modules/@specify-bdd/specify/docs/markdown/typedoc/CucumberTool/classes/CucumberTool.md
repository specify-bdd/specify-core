[**@specify-bdd/specify**](../../README.md)

***

[@specify-bdd/specify](../../modules.md) / [CucumberTool](../README.md) / CucumberTool

# Class: CucumberTool

Defined in: [modules/@specify-bdd/specify/src/lib/CucumberTool.ts:37](https://github.com/specify-bdd/specify-core/blob/c3c8ea2d9aaff082b901a629fe828faeb8afe9a8/modules/@specify-bdd/specify/src/lib/CucumberTool.ts#L37)

Encapsulates the lifecycle of configuring, loading support, and running
Cucumber test executions, with result logging handled by Logger.

Handles caching of support code to work around Node.js module caching,
and manages temporary log files to record and validate test execution output.

## Constructors

### Constructor

> **new CucumberTool**(): `CucumberTool`

#### Returns

`CucumberTool`

## Accessors

### logger

#### Set Signature

> **set** `static` **logger**(`logger`): `void`

Defined in: [modules/@specify-bdd/specify/src/lib/CucumberTool.ts:65](https://github.com/specify-bdd/specify-core/blob/c3c8ea2d9aaff082b901a629fe828faeb8afe9a8/modules/@specify-bdd/specify/src/lib/CucumberTool.ts#L65)

Inject custom Logger instance (for alternative behavior or testing).

##### Parameters

###### logger

[`Logger`](../../Logger/classes/Logger.md)

##### Returns

`void`

## Methods

### loadConfiguration()

> `static` **loadConfiguration**(`config`): `Promise`\<`IRunConfiguration`\>

Defined in: [modules/@specify-bdd/specify/src/lib/CucumberTool.ts:77](https://github.com/specify-bdd/specify-core/blob/c3c8ea2d9aaff082b901a629fe828faeb8afe9a8/modules/@specify-bdd/specify/src/lib/CucumberTool.ts#L77)

Load and prepare Cucumber run configuration, including setting up
the JSON log output path and preloading support code.

#### Parameters

##### config

`Partial`\<`IConfiguration`\>

Partial Cucumber configuration provided by the user

#### Returns

`Promise`\<`IRunConfiguration`\>

A fully resolved and prepared Cucumber run configuration object

***

### runCucumber()

> `static` **runCucumber**(`options`, `environment?`): `Promise`\<`IRunResult`\>

Defined in: [modules/@specify-bdd/specify/src/lib/CucumberTool.ts:110](https://github.com/specify-bdd/specify-core/blob/c3c8ea2d9aaff082b901a629fe828faeb8afe9a8/modules/@specify-bdd/specify/src/lib/CucumberTool.ts#L110)

Execute the Cucumber test run. No tests run is considered an error.

#### Parameters

##### options

`IRunOptions`

The run options for the test execution

##### environment?

`IRunEnvironment`

Environment configuration

#### Returns

`Promise`\<`IRunResult`\>

The result of the Cucumber test run.

#### Throws

Will throw if no tests were executed or other internal errors occur.

# Specify Core

[![NPM Version](https://img.shields.io/npm/v/%40specify-bdd%2Fspecify)](https://www.npmjs.com/package/@specify-bdd/specify)
![Node LTS](https://img.shields.io/node/v-lts/%40specify-bdd%2Fspecify)
![NPM Unpacked Size](https://img.shields.io/npm/unpacked-size/%40specify-bdd%2Fspecify)
![GitHub License](https://img.shields.io/github/license/specify-bdd/specify-core)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/specify-bdd/specify-core/release.yml)

![CodeQL](https://github.com/specify-bdd/specify-core/actions/workflows/github-code-scanning/codeql/badge.svg)
![Dependabot](https://github.com/specify-bdd/specify-core/actions/workflows/dependabot/dependabot-updates/badge.svg)

BDD can be easy.  **Specify** brings together road-tested underlying technologies, thoughtful quality-of-life
improvements informed by years of experience, and a commitment to building open architecture extensible and hackable by
our users.  Built on top of an open-source foundation including BDD essentials like
[Cucumber](https://github.com/cucumber/cucumber-js) and [Selenium](https://www.selenium.dev/documentation/), Specify is
a suite of batteries-included tools designed to help engineers, QA, and product managers to collaborate smoothly and
effectively through behavior-driven development.  We hope that these utilities will be an asset to teams and businesses
that want to implement BDD but need a little help bringing everything and everyone together.

## Open-Source Packages
* [Specify](https://www.npmjs.com/package/@specify-bdd/specify)
  * [CLI Plugin](https://www.npmjs.com/package/@specify-bdd/plugin-cli)

## Setup

1. Install PNPM: `npm i -g pnpm`
2. Clone this monorepo: `git clone git@github.com:specify-bdd/specify-core.git <local repo path>`
3. Install dependencies and build: `cd <local repo path> && pnpm i`
4. Verify installation: `pnpm test`

## Development Workflow

1. Fetch latest changes: `git fetch origin`
2. Create a work branch: `git switch -c dev/<issue>/<short description> origin/develop`
3. Make changes
  * Rebuild manually: `pnpm build`
  * Rebuild automatically: `pnpm dev:watch`
  * Coercive lint: `pnpm lint:fix`
  * Test changes: `pnpm test`
4. Commit with a well-formed message: `git commit -m "[#<issue>] <change explanation>"`
5. Push branch upstream: `git push origin dev/<issue>/<short description>`
6. Open a pull request

## Related Projects

* [Cucumber](https://github.com/cucumber/cucumber-js)
* [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
* [Selenium WebDriver](https://www.selenium.dev/documentation/)

## Get Help

Having trouble with Specify?  We're here to help.

* [Ask a question](https://github.com/specify-bdd/specify-core/discussions/new?category=q-a)
* [Report an issue](https://github.com/specify-bdd/specify-core/issues/new?type=bug)

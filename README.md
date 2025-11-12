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

The first step in setting up a new Specify development environment is to clone the repo.

```shell
git clone git@github.com:specify-bdd/specify-core.git <local repo path>
```

Next, you should install dependencies.  Specify uses PNPM as its dependency manager, which you can use to simplify this
installation if you first install it globally.

```shell
npm i -g pnpm
cd <local repo path>
pnpm dev:install
```

This will not only install all dependencies but perform a Typescript build for you.

If you prefer not to install PNPM globally, the process is a little different.  Bear in mind that in any steps below
which use a `pnpm` command, you will need to use `npx pnpm` instead to run the repo's locally installed package.

```shell
cd <local repo path>
npm ci
npx pnpm dev:install
```

Finally, verify your setup by running unit and end-to-end tests.

```shell
pnpm test
```

## Development Workflow

The standard Specify dev workflow consists of four phases: branch, make changes, commit and push, and open a PR.

### Branch for Dev Work

Before starting any new development work, it's recommended that you fetch the latest changes from `origin` to ensure
that you're working with the most up-to-date code.

```shell
git fetch origin
```

All development work should be done in a dev work branch named after the GitHub issue it addresses.  The branch should
usually be based on `develop` unless there are extenuating circumstances, such as a need to build on the work of some
other dev work branch that hasn't yet been merged to `develop`.

```shell
git switch -c dev/<issue>/<hyphenated-short-description> origin/develop
```

### Make Changes

During development, you may want to test your changes locally by running Specify.  Before doing so, it's important to
remember to rebuild the distributable code, which is what Specify runs from.

```shell
pnpm build
```

To save yourself some trouble and avoid re-running this command after every code change, you can enable the dev watch
mode to have Specify rebuild itself any time you save.

```shell
pnpm dev:watch
```

Use Specify commands to run your code through any specific tests you need to ensure your new or modified functionality
works as you expect.  To learn more about how to use Specify, run the help command.

```shell
pnpm specify help
```

When you are finished with development and want to verify that you haven't created any regressions as part of your work,
you can run the full suite of unit, integration, and end-to-end tests with one simple command.

```shell
pnpm test
```

It is also strongly recommended that you perform a coercive lint on the codebase before considering your work complete.
This will reformat your code to conform to Specify's coding standards.

```shell
pnpm lint:fix
```

The lint, build, and test procedures are included as automated checks for every pull request, but running these checks
locally before you commit can save you time and effort.

### Commit and Push

When your work on an issue is done, or you simply want to record your progress toward that goal, you can stage your changes and commit to the local repo.

```shell
git add <paths of changes>...
git commit -m "[#<issue>] <change explanation>"
```

The standard commit message format begins with a GitHub issue number reference surrounded by square brackets, followed
by an explanation of the purpose of the changes you made.  Simply stating what changed in a manner that would be
redundant with looking at the commit diff is not recommended; instead, try to add context by explaining why these
changes were necessary and/or prudent.

After all work has been committed, it can be pushed to the `origin` repo for review.

```shell
git push origin dev/<issue>/<hyphenated-short-description>
```

### Open a Pull Request

The final step of the development workflow is to submit a pull request for code review.  Open a PR in GitHub with a name
explaining the changes you're making, and assign review to the `devs` user group.  Ordinarily your PR should target the
same branch you based your dev work branch on originally.  This would usually be `develop`, but if you based on unmerged
work which is still not present in `develop`, it is recommended that you target the base point of your work so that the
PR diff includes only the changes you made yourself.  If warranted, you may create the PR in draft mode and add comments
annotating your work before marking the PR as ready for review.

As reviewer feedback comes in, note action items in reply comments with the "task list" formatting, which provides a
checkbox you can fill in later when the feedback is addressed.  Iterate on the work as needed, repeating the steps of
the "Make Changes" and "Commit and Push" steps of this workflow until you and your reviewers reach consensus that the
changes address the issue in question to everyone's satisfaction.

When all relevant reviewers have approved the PR and all automated checks are passing, you may merge the PR.

## Related Projects

* [Cucumber](https://github.com/cucumber/cucumber-js)
* [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
* [Selenium WebDriver](https://www.selenium.dev/documentation/)

## Get Help

Having trouble with Specify?  We're here to help.

* [Ask a question](https://github.com/specify-bdd/specify-core/discussions/new?category=q-a)
* [Report an issue](https://github.com/specify-bdd/specify-core/issues/new?type=bug)

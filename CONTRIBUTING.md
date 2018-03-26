# Contributing

The following is a set of guidelines for contributing to eHealth Web.

## Development

After cloning repository, run `npm install` to fetch its dependencies. Then, you can run several commands:

* `npm start` runs servers and bundlers across all packages in watch mode.
* `npm test` runs the complete test suite.

You can run these commands for subset of packages with the `--scope` and `--ignore` flags, for example:

```sh
npm start -- --scope @ehealth/auth
```

This project is a [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) managed with [Lerna](https://github.com/lerna/lerna), so you can run any lerna commands using `npx`, for example:

```sh
npx lerna bootstrap
```

### Code style

This project uses [prettier](https://github.com/prettier/prettier) default code formatting rules applied to all supported files. The one exception is the `package.json` and `package-lock.json` files, the `npm` client is in charge of their formatting.

To ensure consistent code style, before commit all staged files will be formatted automatically.

### Adding new dependencies

Use lerna's [add](https://github.com/lerna/lerna#add) command to add a new dependency to one or many packages.

```sh
npx lerna add <name>[@version] [--dev]
```

Affected packages can be specified with the `--scope` and `--ignore` flags.

## Commit message guidelines

We follow [Conventional Commits](https://conventionalcommits.org) rules in our commit messages. This leads to more
readable messages that are easy to follow when looking through the project history. But also,
we use the git commit messages to generate the change log.

### Message format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain a reference to an issue if any. Use "connects" keyword (e.g. "connects #5") if issue should not be closed after commit is merged.

See the [commit history](https://github.com/edenlabllc/ehealth.web/commits) for the samples.

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

Must be one of the following:

* **build**: Changes that affect the build system or external dependencies
* **ci**: Changes to our CI configuration files and scripts
* **docs**: Documentation only changes
* **feat**: A new feature
* **fix**: A bug fix
* **perf**: A code change that improves performance
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **style**: Changes that do not affect the meaning of the code
* **test**: Adding missing tests or correcting existing tests

### Scope

The scope should be the name of the package affected (as perceived by the person reading the changelog generated from commit messages.

There are currently a few exceptions to the "use package name" rule:

* **packaging**: used for changes that change the npm package layout in all of our packages, e.g. public path changes, package.json changes done to all packages, changes to bundles, etc.
* **release**: used for increment package versions and updating the release notes in CHANGELOG.md
* none/empty string: useful for `style`, `test` and `refactor` changes that are done across all packages

### Subject

The subject contains a succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* don't capitalize the first letter
* no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about breaking changes and is also the place to reference GitHub issues.

Breaking changes should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

## Release

You can publish changes in the project with the `npm publish` command, which creates a new release of the updated packages. When run, this command does the following:

* Increments version and update corresponding fields in `lerna.json` and `package.json` files of updated packages.
* Updates all dependencies of the updated packages according to their version ranges.
* Creates a new git commit and tag for the new version.
* Builds, tests and publishes docker images for updated packages which able to be dockerized.
* Publishes updated packages to npm.
* Pushes the git changes to remote.

Actions above is the part of the continuous deployment workflow and will be performed automatically on new commits pushed to `master` and `*-stable` branches.

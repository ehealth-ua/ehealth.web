# Contributing

The following is a set of guidelines for contributing to eHealth Web.

## Development

After cloning repository, run `npm ci` to fetch its dependencies. Then, you can run several commands:

- `npm start` runs servers and bundlers across all packages in watch mode.
- `npm test` runs the complete test suite.

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

Please, follow this requirements:

- Prefer ES6 classes over prototypes.
- Use strict equality checks (=== and !==).
- Prefer arrow functions =>, over the function keyword except when defining classes.
- Use semicolons at the end of each statement.
- Prefer double quotes.
- Use PascalCase for classes, lowerCamelCase for variables and functions, SCREAMING_SNAKE_CASE for constants.
- Prefer template strings over string concatenation.
- Prefer promises over callbacks.
- Prefer array functions like map and forEach over for loops.
- Use const for declaring variables that will never be re-assigned, and let otherwise.
- Avoid var to declare variables.

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

- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code
- **test**: Adding missing tests or correcting existing tests

### Scope

The scope should be the name of the package affected (as perceived by the person reading the changelog generated from commit messages.

There are currently a few exceptions to the "use package name" rule:

- **packaging**: used for changes that change the npm package layout in all of our packages, e.g. public path changes, package.json changes done to all packages, changes to bundles, etc.
- **release**: used for increment package versions and updating the release notes in CHANGELOG.md
- none/empty string: useful for `style`, `test` and `refactor` changes that are done across all packages

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about breaking changes and is also the place to reference GitHub issues.

Breaking changes should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

## Release

You can publish changes in the project with the `npm publish` command, which creates a new release of the updated packages. When run, this command does the following:

- Increments version and update corresponding fields in `lerna.json` and `package.json` files of updated packages.
- Updates all dependencies of the updated packages according to their version ranges.
- Creates a new git commit and tag for the new version.
- Builds, tests and publishes docker images for updated packages which able to be dockerized.
- Publishes updated packages to npm.
- Pushes the git changes to remote.

Actions above is the part of the continuous deployment workflow and will be performed automatically on new commits pushed to `master` and `*-stable` branches.

## Proposing changes

Changes should be made through opening pull requests and should be reviewed by members of @edenlabllc/dev-frontend team.

### Branch Organization

The next branch types are using in this repo:

`master` branch always reflects the current development state, changes will be automatically deployed to the `dev` environment.

`*-stable` branches are maintaining for major versions, changes will be automatically deployed to the `demo` environment.

It's extremely important that your new branch is created off of `master` when working on a feature or a fix.

Changes you make on a branch don't affect the master branch, so you're free to experiment and commit changes, safe in the knowledge that your branch won't be merged until it's ready to be reviewed by someone you're collaborating with.

The different types of branches we may use are:

- Feature branches
- Bug branches

Each of these branches have a specific purpose and are bound to strict rules as to which branches may be their originating branch and which branches must be their merge targets. Each branch and its usage is explained below.

**Feature Branches**

Feature branches are used when developing a new feature or enhancement which has the potential of a development lifespan longer than a single deployment. When starting development, the deployment in which this feature will be released may not be known. No matter when the feature branch will be finished, it will always be merged back into the master branch.

During the lifespan of the feature development, you should watch the `master` branch to see if there have been commits since the feature was branched. Any and all changes to `master` should be merged into the feature before merging back to `master`; this can be done at various times during the project or at the end, but time to handle merge conflicts should be accounted for.

- Branch naming convention: `feat/<any-description>`

**Bug Branches**

Bug branches differ from feature branches only semantically. Bug branches will be created when there is a bug on the live site that should be fixed and merged into the next deployment. For that reason, a bug branch typically will not last longer than one deployment cycle. Additionally, bug branches are used to explicitly track the difference between bug development and feature development. No matter when the bug branch will be finished, it will always be merged back into `master`.

Although likelihood will be less, during the lifespan of the bug development, you should watch the `master` branch to see if there have been commits since the bug was branched. Any and all changes to `master` should be merged into the bug branch before merging back to `master`; this can be done at various times during the project or at the end, but time to handle merge conflicts should be accounted for.

- Branch naming convention: `fix/<any-description>`

## Steps to propose a pull request

1. Create a pull request to propose changes to a repository.
2. Fill pull request template form
3. Ask @edenlabllc/dev-frontend team to review your PR

## Pull request review rules

**Everyone**

- PR shouldn't be large. Thousands of lines can't be easily reviewed and merged with confidence. Keep is as simple as possible.
- Use [Conventional Commits](https://conventionalcommits.org) rules for naming your pull request. Because if you squash and merge your pull request, it will create commit from pull request title.
- Review rules is regulated by [Code of conduct](https://github.com/edenlabllc/ehealth.web/blob/master/CODE_OF_CONDUCT.md)
- Please do not create a Pull Request without creating an issue first.

**Having Your Code Reviewed**

- Be grateful for the reviewer's suggestions. ("Good call. I'll make that
  change.")
- A common axiom is "Don't take it personally. The review is of the code, not you." We used to include this, but now prefer to say what we mean: Be aware of [how hard it is to convey emotion online] and how easy it is to misinterpret feedback. If a review seems aggressive or angry or otherwise personal, consider if it is intended to be read that way and ask the person for clarification of intent, in person if possible.
- Keeping the previous point in mind: assume the best intention from the reviewer's comments.
- Explain why the code exists. ("It's like that because of these reasons. Would
  it be more clear if I rename this class/file/method/variable?")
- Extract some changes and refactorings into future tickets/stories.
- Push commits based on earlier rounds of feedback as isolated commits to the branch. Do not squash until the branch is ready to merge. Reviewers should be able to read individual updates based on their earlier feedback.
- Seek to understand the reviewer's perspective.
- Try to respond to every comment.
- Wait to merge the branch until continuous integration (Jenkins, Travis CI etc.) tells you the test suite is green in the branch.
- Merge once you feel confident in the code and its impact on the project.
- Final editorial control rests with the pull request author.

[how hard it is to convey emotion online]: https://www.fastcodesign.com/3036748/why-its-so-hard-to-detect-emotion-in-emails-and-texts

**Reviewing Code**

Understand why the change is necessary (fixes a bug, improves the user
experience, refactors the existing code). Then:

- Communicate which ideas you feel strongly about and those you don't.
- Identify ways to simplify the code while still solving the problem.
- If discussions turn too philosophical or academic, move the discussion offline
  to a regular Friday afternoon technique discussion. In the meantime, let the
  author make the final decision on alternative implementations.
- Offer alternative implementations, but assume the author already considered
  them. ("What do you think about using a custom validator here?")
- Seek to understand the author's perspective.
- Remember that you are here to provide feedback, not to be a gatekeeper.

## Hot fix

To create a hotfix, you need to create a branch from the master, apply a hotfix and create a PR back to master. For code consistency, you should apply the same commit to `*-stable` branch if needed. New release tag
should be deployed on demo, preprod, prod environment.

## Release process

Release preparation includes a final quality review by the SA team.
During the review, the SA team will conduct final checks to ensure the build meets the minimum acceptable standards and business requirements outlined in the release plan. Required release tag deploy to each environment (demo, proprod, prod), and then quality review repeats on each environment.
If the released tag contains some features that not in the release plan
and not hidden by `Feature Flag`, we can hide it or create `*-stable` branch from acceptable release tag in `master` and `cherry-pick` necessary commits to it.

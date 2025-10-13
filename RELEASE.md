# Release

This package uses [changesets](https://github.com/changesets/changesets/) to manage releases.

## Adding a changeset

To indicate that your changes should trigger a release, run `npm run changeset` before pushing your branch.

[Learn more](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md)

### Do I need to add a changeset?

Not every change requires a release. Only add a changeset if you are fixing a bug, adding a feature, or making a breaking change. You should not add changesets for chores or updates to documentation or tests or other changes that affect the API of the library.

## Reviewing changes

We use the [changeset bot](https://github.com/apps/changeset-bot) to notify reviewers if a pull request does not include a changeset. Because not all pull requests require a changeset, this will **not** prevent the pull request from being merged.

## Publishing the release

The [release workflow](./.github/workflows/release.yaml) uses the [changeset action](https://github.com/changesets/action) to automate publishing to NPM. This has two steps:

1. When a pull request with a changeset has been merged to the main branch, the action will create a new pull request that updates the package version and changelog.
1. Once the version PR is merged to the main branch, the package will be published to NPM with the updated version.

## What about semantic commit messages

Changesets does **not** use semantic commit messages, so they are not required for our automated release process to work. That said, we should continue to use them, especially for commits that are not part of a changeset, as they are an efficient way to convey the nature of the changes introduced by the commit.

## Releasing Archived Packages

If we need to make a fix to one of the archived packages we can manually bump the version and release. After making the code changes, we would do something like:

1. `cd` into the package's directory
1. test the changes
1. `npm run build`
1. `npm version patch`
1. `npm publish`

# Release Process

This project uses [semantic release](https://semantic-release.gitbook.io/semantic-release/) which is automated release tooling that uses commit messages to determine the correct semantic version for any given release.

The process of initiating a release is simple: merge a PR into the `master` or `beta` branches, and `semantic release` will look at the included commits, compute the next version, and release the packages to NPM.

## Semantic Commit Messages

This system is founded in the use of the [Angular Commit Message Format](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-format)

### Commit Message Format

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense. Not capitalized. No period at the end.
  │       │
  │       └─⫸ Commit Scope: hub-common | hub-content | hub-discussions | hub-downloads | hub-events | hub-initiatives | hub-search | hub-sites | hub-surveys | hub-teams (can also be left blank)
  │
  └─⫸ Commit Type: build|ci|docs|feat|fix|perf|refactor|test
```

The `<type>` and `<summary>` fields are mandatory, the `(<scope>)` field is optional.

##### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests

**Important Note:**

Not _all_ of the commit types above will result in a new release being published to Github and NPM. Specifically, `docs`, `refactor` and `test` _do not_ automatically trigger a release. If you need a release to be automatically published when you merge your pull request, please be sure to include at least one commit message using one of the other types listed above. If you find yourself in this situation _after_ having already merged, you can manually trigger a build by issuing an empty commit directly against the `master` or `beta` branches, e.g. `git commit --allow-empty -m "fix(): A descriptive patch message"` or `git commit --allow-empty -m "feat(): A descriptive minor message"`.

## Breaking Changes

To specify a breaking change, you need to use a multi-line commit message, and start a line with `BREAKING CHANGE`.

```
fix(): solve i18n issue in arcgis-hub-content-gallery

BREAKING CHANGE: i18n strings must be loaded from a new location
```

If you are writing commit messages at the console, you can do this by just hitting `enter` twice while writing the commit message, _before closing the quotes_.

```sh
$ git commit -m 'fix(): solve i18n issue in arcgis-hub-content-gallery

BREAKING CHANGE: i18n strings must be loaded from a new location'
```

Commit messages are run through `commitlint` using `husky` pre-commit hooks.

Please do not use `--no-verify` unless you are _really_ sure you must.

## Updating peerDependencies

When releasing a feature or a breaking change to a package, you _may_ need to manually update the `peerDependencies` of any packages that depend on the package you are releasing. 

**Example**: you've added a function to `@esri/hub-common` and _also_ use the new function in another package like `@esri/hub-sites`. The new function will be included in the next release of `@esri/hub-common` with a minor version bump, so in order to use that function in `@esri/hub-sites` you need to update it's peer dependency to point to the new version, which will not yet be published. The _safest_ way to do this is via two pull requests, first one to add the new function to `@esri/hub-common`, and once that has been published, a follow on PR to `@esri/hub-sites` to update the peer dependency and use the new function.

If you are at all unsure about whether or not you need to update `peerDependencies`, please ask @tomwayson.

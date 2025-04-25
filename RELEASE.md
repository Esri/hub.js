fixfix# PORTAL-11.5 Release Process

Mutli-Semantic release can not handle maintenance releases for old versions, so the release process for these long-lived PORTAL-XX.X branches is manual.

Basically, it's old-school npm publish

1. update the package version in the package.json file in the package you are going to release
1. `npm run build`
1. `cd packages/{package-to-release}`
1. `npm publish --tag portal115`
1. Repeat until all packages are released
1. `cd ../..` return to root directory
1. `git add -A .`
1. `git commit -m 'fix: Update package versions for patch release of 11.5`
1. `git push orign PORTAL-11.5`
1. 🎉

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

Since this is a long-lived branch, associated with a specific portal version (11.5) we should not do any actual "API breaking changes". We may have some type related changes which are technically breaking, but generally we can ignore those as long as we update the client.

## Updating peerDependencies

When releasing a feature or a breaking change to a package, you _may_ need to manually update the `peerDependencies` of any packages that depend on the package you are releasing.

**Example**: you've added a function to `@esri/hub-common` and _also_ use the new function in another package like `@esri/hub-sites`. The new function will be included in the next release of `@esri/hub-common` with a minor version bump, so in order to use that function in `@esri/hub-sites` you need to update it's peer dependency to point to the new version, which will not yet be published. The _safest_ way to do this is via two pull requests, first one to add the new function to `@esri/hub-common`, and once that has been published, a follow on PR to `@esri/hub-sites` to update the peer dependency and use the new function.

If you are at all unsure about whether or not you need to update `peerDependencies`, please ask @tomwayson.

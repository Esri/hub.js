# Release Process

All the packages on this branch have been archived.

If you need to make a fix to an archived package, the process goes something like:

1. `git checkout archive`
1. make your changes
1. get tests to pass
1. validate by symlinking or copying over to your application
1. `cd` into the package you are updating
1. `npm run build`
1. `npm version minor`
1. `npm publish`
1. create a tag with `@esri/<package-name>@<version>`
1. `git add .`
1. `git push --tags`

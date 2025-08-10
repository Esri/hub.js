1. Description:

1. Instructions for testing:

1. Closes Issues: #<number> (if appropriate)

1. [ ] Updated meaningful TSDoc to methods including Parameters and Returns, see [Documentation Guide](https://friendly-adventure-7w1eyl2.pages.github.io/storybook/?path=/story/guides-documentation--page)

1. [ ] used semantic commit messages
  
1. [ ] PR title follows semantic commit format (**CRITICAL** if the title is not in a semantic format, the release automation will not run!)

1. [ ] updated `peerDependencies` as needed. **CRITICAL** our automated release system can **not** be counted on to update `peerDependencies` so we _must_ do it manually in our PRs when needed. See the [updating peerDependencies](/RELEASE.md#Updating-peerDependencies) section of the release instructions for more details.
 
***CRITICAL** 
If you are making a breaking change, make sure to add the `BREAKING CHANGE` comment _in the merge commit message_. If this is not done, `semantic-release` will not do the right thing. 

If you find yourself in this position...
1) open a PR to master with a trivial change - fix a linting problem or something.
2) when you merge that, make sure you add the `BREAKING CHANGE` message in the merge commit.
3) then run `npm deprecate @esri/{package-name}@v{version-you-don't-want-out}`

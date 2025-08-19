# clean up from previous run
rm -rf ./src ./test

# get what we need from current the root files before we overwrite them
node ./support/monoreaper.js
mkdir ./packages/common/e2e/test-images
mv ./e2e/test-images/* ./packages/common/e2e/test-images

# remove root files that will be overwritten
rm ./package.json ./README.md ./CHANGELOG.md ./tsconfig.json
rm -rf ./e2e

# hoist hub-common to the root
rm -rf ./packages/common/dist
mv ./packages/common/* .

# remove packages and other root folders that are no longer needed
rm -rf ./packages ./archive .eslintrc-baseline.js ./support/generate-eslint-baseline.js

# update dependencies
npm i

# let user know the next steps
echo "Monoreaper has successfully hoisted hub-common to the root and deleted other packages."
echo "Next steps:"
echo "1. Review the changes made to the project structure."
echo "2. git add ."
echo "3. npm run lint"
echo "4. npm run build"
echo "5. npm run format:check"
echo "TODO: precommit, tests, publish, docs"

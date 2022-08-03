#!/bin/bash

# Manually build and push the release to github
# This is only needed if the release process via `npm run release:publish` failed
# ENSURE YOU HAVE SOMETING IN THE CHANGELOG SECTION FOR YOUR RELEASE

# Change to your version number
$VERSION=3.6.7
# create a ZIP archive of the dist files
TEMP_FOLDER=hub-js-v$VERSION;
mkdir $TEMP_FOLDER
zip -r $TEMP_FOLDER.zip $TEMP_FOLDER
rm -rf $TEMP_FOLDER

# Run gh-release to create a new release with our changelog changes and ZIP archive
gh-release --t v$VERSION --repo hub.js --owner Esri -a $TEMP_FOLDER.zip

# Delete the ZIP archive
rm $TEMP_FOLDER.zip
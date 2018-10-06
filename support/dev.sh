#!/bin/bash

# extract scope and build type from the command line args
SCOPE=$1
BUILD_TYPE=$2

# run the dev script for that build type in the scoped packages
  lerna run --scope "$SCOPE" dev:$BUILD_TYPE --parallel

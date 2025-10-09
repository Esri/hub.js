# !/bin/bash

# from the root run `sh ./support/archive-packages.sh`

# move the packages to an archive folder
mkdir -p archive/downloads && mv packages/downloads archive/downloads 
mkdir -p archive/events && mv packages/events archive/events   
mkdir -p archive/initiatives && mv packages/initiatives archive/initiatives 
mkdir -p archive/search && mv packages/search archive/search     
mkdir -p archive/sites && mv packages/sites archive/sites 
mkdir -p archive/surveys && mv packages/surveys archive/surveys 
mkdir -p archive/teams && mv packages/teams archive/teams

# next steps

# git add .
# npm i

# the following commands should run
# npm run build
# npm test
# npm run lint
# npm run madge:circular
# npm run docs:build

# TODO:
# add changesets and update release scripts
# remove unused tooling (lerna, semantic, commitizen, etc)

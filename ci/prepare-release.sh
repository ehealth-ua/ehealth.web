#!/bin/sh
git config --global user.email "deploy@travis-ci.org"
git config --global user.name "Deployment Bot"
git config --global credential.helper "store"
echo "https://${GITHUB_TOKEN}:@github.com" > $HOME/.git-credentials
git checkout $TRAVIS_BRANCH
echo $DOCKER_PASSWORD | docker login --username $DOCKER_USERNAME --password-stdin

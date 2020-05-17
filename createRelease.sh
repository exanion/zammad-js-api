#!/bin/bash

# Create a release branch (release-x.y.z) for deploying the package
# Usage: ./createRelease.sh <version-number>

if [ -z "$1" ]
then
    echo "Usage: ./createRelease.sh <version-number>"
    exit 1
fi

if [[ ! "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]
then
    echo "Given version number is not valid."
    echo "Version number is supposed to be x.y.z"
    echo "You entered $1"
    exit 1;
fi
version=$1

echo "This script will create a release branch from the current branch"
echo "Make sure that the current branch is clean and all changes are commited!"
read -p "Continue? [y/N]: " continue
if [ "$continue" != "y" ] 
then
    echo "Aborting..."
    exit 0
fi

git branch "release-$version"
git checkout "release-$version"

npm --no-git-tag-version version "$version"
echo "$version" > VERSION
git add VERSION
git add package*.json

git commit -m "Created release branch for version $version"
git tag "$version"

read -p "Branch created successfully. Push now to origin? [y/N] " pushnow
if [ "$pushnow" == "y" ]
then
    echo "Pushing to origin..."
    git push -u origin "release-$version"
    git push --tags
fi

echo "Created new branch \"release-$version\". Make sure that all builds and tests succeed, then merge into master!"
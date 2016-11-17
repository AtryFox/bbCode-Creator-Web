#!/usr/bin/env bash

git reset HEAD --hard
git pull
git rev-parse --short=4 HEAD > version
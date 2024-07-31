#!/bin/sh

cp -r ./node_modules/@kinpeter/pk-common/enums ./src/app/constants/
cp ./node_modules/@kinpeter/pk-common/utils/regex.ts ./src/app/constants/
prettier --write "src/app/constants"
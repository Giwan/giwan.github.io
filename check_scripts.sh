#!/bin/bash
npm run lint > /tmp/lint.log 2>&1
L=$?
npm test > /tmp/test.log 2>&1
T=$?
npm run build:pwa > /tmp/build.log 2>&1
B=$?
echo "LINT:$L" > /tmp/results.txt
echo "TEST:$T" >> /tmp/results.txt
echo "BUILD:$B" >> /tmp/results.txt

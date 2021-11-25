#!/usr/bin/node

const getMergeArgs = require('./merge/args')
const merge = require('./merge/merge')

const mergeArgs = getMergeArgs.get(process.argv)

merge.run(mergeArgs.in, mergeArgs.out, mergeArgs.p, mergeArgs.s)

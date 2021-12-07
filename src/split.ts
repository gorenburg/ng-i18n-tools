#!/usr/bin/env node

const getSplitArgs = require('./split/args')
const split = require('./split/split')

const splitArgs = getSplitArgs.get(process.argv)
split.run(splitArgs.lp, splitArgs.acf, splitArgs.fnc)

#!/usr/bin/env node
"use strict";
const getSplitArgs = require('./split/args');
const split = require('./split/split');
const splitArgs = getSplitArgs.get(process.argv);
split.run(splitArgs.lp, splitArgs.acf, splitArgs.fnc);

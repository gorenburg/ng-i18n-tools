#!/usr/bin/node
"use strict";
const getSyncArgs = require('./sync/args');
const sync = require('./sync/sync');
const syncArgs = getSyncArgs.get(process.argv);
sync.run(syncArgs.lp, syncArgs.acf);

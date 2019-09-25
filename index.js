'use strict';

const optimist = require('optimist');
const debug = require('debug')('http-mitm-proxy:bin');
const Proxy = require('./libs/main');

const proxy = Proxy();

const args = optimist
    .alias('h', 'help')
    .alias('h', '?')
    .options('port', {
        default: 8081,
        describe: 'HTTP Port.'
    })
    .alias('p', 'port')
    .options('host', {
        describe: 'HTTP Listen Interface.'
    })
    .argv;

proxy.listen(args, function (error) {
    if (error) {
        return process.exit(1);
    }
    debug('Proxy listening on ' + 8081);
});

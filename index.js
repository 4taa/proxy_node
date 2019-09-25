'use strict';

const optimist = require('optimist');
const debug = require('debug')('http-mitm-proxy:bin');
const fs = require('fs');
const Proxy = require('./libs/main');

const proxy = Proxy();

const args = optimist
    .alias('h', 'help')
    .alias('h', '?')
    .options('host', {
        describe: 'HTTP Listen Interface.'
    })
    .argv;

args.port = 8081;

if (args.host === 'www.google.com') {
    proxy.onRequest(function(ctx, callback) {
        if (ctx.clientToProxyRequest.headers.host == 'www.google.com') {
            ctx.use(Proxy.gunzip);
            ctx.onResponseData(function(ctx, chunk, callback) {
                chunk = new Buffer(chunk.toString().replace(/<H1.*?<\/H1>/g, '<h1>Replaced google!</h1>'));
                return callback(null, chunk);
            });
        }
        return callback();
    });
    args.host = '';
} else if (args.host === 'www.mail.ru') {
    proxy.onRequest(function(ctx, callback) {
        fs.writeFile('./reqLog.txt', ctx, (error) => {
            error ? console.log('Smth went wrong', error) : console.log('Request log saved');
        })
        if (ctx.clientToProxyRequest.headers.host == 'www.mail.ru') {
            ctx.use(Proxy.gunzip);
            ctx.onResponseData(function(ctx, chunk, callback) {
                chunk = new Buffer(chunk.toString().replace(/<(H|h)1.*?<\/(H|h)1>/g, '<h1>Replaced mail!</h1>'));
                return callback(null, chunk);
            });
        }
        return callback();
    });
    args.host = '';
} else {
    proxy.onRequest(function(ctx, callback) {
        callback();
    });
    args.host = '';
}

proxy.onRequestData(function(ctx, chunk, callback) {
    return callback(null, chunk);
});
  
proxy.onResponse(function(ctx, callback) {
    return callback(null);
});

proxy.onResponseData(function(ctx, chunk, callback) {
    return callback(null, chunk);
});

proxy.onError(function(ctx, err, errorKind) {
    const url = (ctx && ctx.clientToProxyRequest) ? ctx.clientToProxyRequest.url : '';
    console.error(errorKind + ' on ' + url + ':', err);
})

proxy.listen(args, function(error) {
    if (error) {
        return process.exit(1);
    }
    debug('Proxy listening on ' + 8081);
});

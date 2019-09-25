'use strict';

const optimist = require('optimist');
const debug = require('debug')('http-mitm-proxy:bin');
const http = require('http');
const https = require('https');
const fs = require('fs');
const CircularJSON = require('circular-json');
const js_beautify = require('js-beautify');
const Proxy = require('./libs/main');

const proxy = Proxy();

const args = optimist
    .alias('h', 'help')
    .alias('h', '?')
    .options('host', {
        describe: 'HTTP Listen Interface.'
    })
    .options('do-request', {
        describe: 'Request timestamp'
    })
    .argv;

args.port = 8081;

function errorHandler(error) {
    error ? console.log('Error on add log', error) : console.log('OK add log');
}

if (args.host === 'www.google.com' && !args['do-request']) {
    proxy.onRequest(function(ctx, callback) {
        if (ctx.clientToProxyRequest.headers.host == 'www.google.com') {
            ctx.use(Proxy.gunzip);
            const date = Date.now();
            fs.appendFileSync('./reqLog.txt', `\n===== Req log for google - callback =====\n`, (error) => errorHandler(error));
            fs.appendFileSync('./reqLog.txt', `>Date ${date}\n`, (error) => errorHandler(error));
            fs.appendFileSync('./reqLog.txt', callback.toString(), (error) => errorHandler(error));
            fs.appendFileSync('./reqLog.txt', `\n===== Req log for google - callback ends =====\n`, (error) => errorHandler(error));
            fs.appendFileSync('./reqLog.txt', `\n===== Req log for google - ctx =====\n`, (error) => errorHandler(error));
            fs.appendFileSync('./reqLog.txt', CircularJSON.stringify(ctx), (error) => errorHandler(error));
            fs.appendFileSync('./reqLog.txt', `>Date ${date}\n`, (error) => errorHandler(error));
            fs.appendFileSync('./reqLog.txt', `\n===== Req log for google - ctx ends =====\n`, (error) => errorHandler(error));
            fs.appendFileSync('./resLog.txt', `\n=======================================\n`, (error) => errorHandler(error));
            ctx.onResponseData(function(ctx, chunk, callback) {
                fs.appendFileSync('./resLog.txt', `\n===== ResData log for google - callback =====\n`, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', `>Date ${Date.now()}\n`, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', callback.toString(), (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', `\n===== ResData log for google - callback ends =====\n`, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', `\n===== ResData log for google - ctx =====\n`, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', CircularJSON.stringify(ctx), (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', `\n===== ResData log for google - ctx ends =====\n`, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', `\n===== ResData log for google - chunk =====\n`, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', chunk, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', `\n===== ResData log for google - chunk ends =====\n`, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', `\n=======================================\n`, (error) => errorHandler(error));
                chunk = new Buffer(chunk.toString().replace(/<H1.*?<\/H1>/g, '<h1>Replaced google!</h1>'));
                return callback(null, chunk);
            });
        }
        return callback();
    });
    args.host = '';
} else if (args.host === 'www.mail.ru' && !args['do-request']) {
    proxy.onRequest(function(ctx, callback) {
        if (ctx.clientToProxyRequest.headers.host == 'www.mail.ru') {
            ctx.use(Proxy.gunzip);
            fs.appendFileSync('./reqLog.txt', `\n===== Res log for mail - callback =====\n`, (error) => errorHandler(error));
            fs.appendFileSync('./reqLog.txt', `>Date ${Date.now()}\n`, (error) => errorHandler(error));
            fs.appendFileSync('./reqLog.txt', callback.toString(), (error) => errorHandler(error));
            fs.appendFileSync('./reqLog.txt', `\n===== Res log for mail - callback ends =====\n`, (error) => errorHandler(error));
            fs.appendFileSync('./reqLog.txt', `\n===== Res log for mail - ctx =====\n`, (error) => errorHandler(error));
            fs.appendFileSync('./reqLog.txt', CircularJSON.stringify(ctx), (error) => errorHandler(error));
            fs.appendFileSync('./reqLog.txt', `\n===== Res log for mail - ctx ends =====\n`, (error) => errorHandler(error));
            fs.appendFileSync('./resLog.txt', `\n=======================================\n`, (error) => errorHandler(error));
            ctx.onResponseData(function(ctx, chunk, callback) {
                fs.appendFileSync('./resLog.txt', `\n===== ResData log for mail - callback =====\n`, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', `>Date ${Date.now()}\n`, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', callback.toString(), (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', `\n===== ResData log for mail - callback ends =====\n`, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', `\n===== ResData log for mail - ctx =====\n`, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', CircularJSON.stringify(ctx), (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', `\n===== ResData log for mail - ctx ends =====\n`, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', `\n===== ResData log for mail - chunk =====\n`, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', chunk, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', `\n===== ResData log for mail - chunk ends =====\n`, (error) => errorHandler(error));
                fs.appendFileSync('./resLog.txt', `\n=======================================\n`, (error) => errorHandler(error));
                chunk = new Buffer(chunk.toString().replace(/<(H|h)1.*?<\/(H|h)1>/g, '<h1>Replaced mail!</h1>'));
                return callback(null, chunk);
            });
        }
        return callback();
    });
    args.host = '';
} else if (!args['do-request']) {
    proxy.onRequest(function(ctx, callback) {
        fs.appendFileSync('./reqLog.txt', `\n===== Req log - callback =====\n`, (error) => errorHandler(error));
        fs.appendFileSync('./reqLog.txt', `>Date ${Date.now()}\n`, (error) => errorHandler(error));
        fs.appendFileSync('./reqLog.txt', callback.toString(), (error) => errorHandler(error));
        fs.appendFileSync('./reqLog.txt', `\n===== Req log - callback ends =====\n`, (error) => errorHandler(error));
        fs.appendFileSync('./reqLog.txt', `\n===== Req log - ctx =====\n`, (error) => errorHandler(error));
        fs.appendFileSync('./reqLog.txt', CircularJSON.stringify(ctx), (error) => errorHandler(error));
        fs.appendFileSync('./reqLog.txt', `\n===== Req - ctx ends =====\n`, (error) => errorHandler(error));
        fs.appendFileSync('./resLog.txt', `\n=======================================\n`, (error) => errorHandler(error));
        callback();
    });
    args.host = '';
} else if (args['do-request'] && typeof args['do-request'] === 'number') {
    args.host = '';
    const a = fs.readFileSync('./reqLog.txt').toString().split('\n').join('');
    const reg = new RegExp(String(`=====>Date ${args['do-request']}(.*)>Date ${args['do-request']}=====`));
    const re = new RegExp(String(`>Date ${args['do-request']}`));
    const match = a.match(reg)

    fs.writeFileSync('./reqToDo.txt', '', (error) => errorHandler(error));
    fs.appendFileSync('./reqToDo.txt', match[0], (error) => errorHandler(error));
    let b = fs.readFileSync('./reqToDo.txt').toString().split('\n').join('');
    while (re.test(b)) {
        b = fs.readFileSync('./reqToDo.txt').toString().split('\n').join('');
        fs.writeFileSync('./reqToDo.txt', b.replace(`>Date ${args['do-request']}`, ''), (error) => errorHandler(error));
    }
    const arr = b.split('=====');
    arr.forEach((elem, index, array) => {
        /Req\ log\ for/.test(elem) ? array[index] = '' : console.log();
    })
    fs.writeFileSync('./parsed.js', arr.join('\n\n'), (error) => errorHandler(error));

    const reading = fs.readFileSync('./parsed.js').toString().split('\n');
    const res = [];

    for (let i = 0; i < reading.length; i++) {
        if (reading[i] === '') {
            continue;
        } else {
            res.push(reading[i]);
        }
    }

    res[0] = res[0].replace(/function\ \(/, 'module.exports = function callbackRequest(');
    res[1] = 'ctx = ' + res[1];
    res[1] = res[1].replace(/ctx\ \=\ /, 'module.exports = ');

    fs.writeFileSync('./parsedCtx.js', res[1], (error) => errorHandler(error));
    fs.writeFileSync('./parsedCallback.js', res[0], (error) => errorHandler(error));
    fs.writeFileSync('./ctx.json', res[1], (error) => errorHandler(error));

    fs.writeFileSync('./parsedCtx.js', js_beautify(fs.readFileSync('./parsedCtx.js').toString()));
    fs.writeFileSync('./parsedCallback.js', js_beautify(fs.readFileSync('./parsedCallback.js').toString()));

    const callbackRequest = require('./parsedCallback');
    const ctx = require('./parsedCtx');
    console.log(ctx)
    console.log(callbackRequest.toString());
    process.exit(0);
}

proxy.onRequestData(function(ctx, chunk, callback) {
    const date = Date.now();
    fs.appendFileSync('./reqLog.txt', `\n===== ReqData log - callback =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./reqLog.txt', `>Date ${date}\n`, (error) => errorHandler(error));
    fs.appendFileSync('./reqLog.txt', callback.toString(), (error) => errorHandler(error));
    fs.appendFileSync('./reqLog.txt', `\n===== ReqData log - callback ends =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./reqLog.txt', `\n===== ReqData log - ctx =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./reqLog.txt', CircularJSON.stringify(ctx), (error) => errorHandler(error));
    fs.appendFileSync('./reqLog.txt', `\n===== ReqData - ctx ends =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `\n===== ReqData log - chunk =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', chunk, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `\n===== ReqData - chunk ends =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./reqLog.txt', `>Date ${date}\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `\n=======================================\n`, (error) => errorHandler(error));
    return callback(null, chunk);
});
  
proxy.onResponse(function(ctx, callback) {
    fs.appendFileSync('./resLog.txt', `\n===== Res log - callback =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `>Date ${Date.now()}\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', callback.toString(), (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `\n===== Res log - callback ends =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `\n===== Res log - ctx =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', CircularJSON.stringify(ctx), (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `\n===== Res - ctx ends =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `\n=======================================\n`, (error) => errorHandler(error));
    return callback(null);
});

proxy.onResponseData(function(ctx, chunk, callback) {
    console.log('resdata')
    fs.appendFileSync('./resLog.txt', `\n===== ResData log - callback =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `>Date ${Date.now()}\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', callback.toString(), (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `\n===== ResData log - callback ends =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `\n===== ResData log - ctx =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', CircularJSON.stringify(ctx), (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `\n===== ResData - ctx ends =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `\n===== ResData log - chunk =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', chunk, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `\n===== ResData - chunk ends =====\n`, (error) => errorHandler(error));
    fs.appendFileSync('./resLog.txt', `\n=======================================\n`, (error) => errorHandler(error));
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

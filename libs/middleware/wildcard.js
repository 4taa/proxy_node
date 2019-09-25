'use strict';

const HOSTNAME_REGEX = /^(.+)(\.[^\.]{4,}(\.[^\.]{1,3})*\.[^\.]+)$/;

module.exports = {
    onCertificateRequired: function (hostname, callback) {
        var rootHost = hostname;
        if (HOSTNAME_REGEX.test(hostname)) {
            rootHost = hostname.replace(/^[^\.]+\./, '');
        }
        return callback(null, {
            keyFile: this.sslCaDir + '/keys/_.' + rootHost + '.key',
            certFile: this.sslCaDir + '/certs/_.' + rootHost + '.pem',
            hosts: ['*.' + rootHost, rootHost]
        });
    }
};
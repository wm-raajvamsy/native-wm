#!/usr/bin/env node

const http = require('http');
const httpProxy = require('http-proxy');
const axios = require('axios');
const request = require('request');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const basePath = '/';

function streamToString(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        stream.on('error', reject);
    });
}

function launchServiceProxy(previewUrl, proxyPort, webPreviewPort) {
    const proxyUrl = `http://localhost:${proxyPort}`;
    const proxy = httpProxy.createProxyServer({});

    http.createServer(function (req, res) {
        try {
            let tUrl = req.url;
            if (req.url.startsWith(basePath)) {
                tUrl = tUrl.replace(basePath, '');
            }
            tUrl = (tUrl.startsWith('/') ? '' : '/') + tUrl;
            tUrl = `http://localhost:${webPreviewPort}${tUrl}`;

            if (req.url.endsWith('index.html')) {
                axios.get(tUrl).then(body => {
                    res.end(body.data
                        .replace('/index.bundle?', `./index.bundle?minify=true&`));
                });
                return;
            }

            if (req.url === '/') {
                res.writeHead(302, { 'Location': `${basePath}index.html` });
                res.end();
            } else if (req.url.startsWith(basePath + '_/_')
                || req.url.startsWith(basePath + '_')) {
                req.url = req.url.replace(basePath + '_/_', '')
                    .replace(basePath + '_', '');
                proxy.web(req, res, {
                    target: previewUrl,
                    secure: false,
                    xfwd: false,
                    changeOrigin: true,
                    cookiePathRewrite: {
                        "*": ""
                    }
                });
            } else if (req.url.includes('/services/') || req.url.includes('/resources/')) {
                // WMS-EXPOROUTER: Expo Router's dev server serves each page at its own route
                // path (e.g. /Main), and appConfig.url there is same-origin without the classic
                // web build's /_/_ prefix trick (that trick relies on the served page's own URL
                // containing /rn-bundle, which Expo Router's routes never do) — so backend calls
                // (services AND resources — e.g. i18n locale files) arrive here as
                // /Main/services/servicedefs or /Main/resources/i18n/en.json instead of
                // /_/_/services/servicedefs. Strip everything before whichever marker is present
                // so this still forwards to previewUrl's real API path, the same target the
                // /_/_ branch above reaches for classic mode. Found by actually running an Expo
                // Router app through this proxy, not assumed — /resources/ was added after
                // /services/ alone left locale-file loading broken the same way.
                const marker = req.url.includes('/services/') ? '/services/' : '/resources/';
                req.url = req.url.substring(req.url.indexOf(marker));
                proxy.web(req, res, {
                    target: previewUrl,
                    secure: false,
                    xfwd: false,
                    changeOrigin: true,
                    cookiePathRewrite: {
                        "*": ""
                    }
                });
            } else {
                req.headers.origin = `http://localhost:${webPreviewPort}`;
                const url = req.url;
                if (url.indexOf('/index.bundle') > 0 && req.headers && req.headers.referer) {
                    let sourceMap = req.headers.referer.replace('/index.html', '') + '/index.map';
                    if (url.indexOf('?') > 0) {
                        sourceMap += url.substring(url.indexOf('?'));
                    }
                    res.setHeader('SourceMap', sourceMap);
                }
                res.setHeader('Content-Location', url);
                if (url.indexOf('/index.bundle') > 0) {
                    streamToString(request(tUrl)).then(content => {
                        content = content.replace(/"\/assets\/\?unstable_path=/g, `"/${basePath}/assets/?unstable_path=`);
                        res.write(content);
                        res.end();
                    });
                } else {
                    req.pipe(request(tUrl, function (error, res, body) {
                        //error && console.log(error);
                    })).pipe(res);
                }
            }
        } catch (e) {
            res.writeHead(500);
            console.error(e);
        }
    }).listen(proxyPort);

    proxy.on('proxyReq', function (proxyReq, req, res, options) {
        proxyReq.setHeader('sec-fetch-mode', 'no-cors');
        proxyReq.setHeader('origin', previewUrl);
        proxyReq.setHeader('referer', previewUrl);
    });
    proxy.on('error', function (e) {
        console.error(e);
    });
    proxy.on('proxyRes', function (proxyRes, req, res, options) {
        var cookies = proxyRes.headers['set-cookie'];
        if (cookies) {
            cookies = typeof cookies === 'string' ? [cookies] : cookies;
            cookies = cookies.map(c => c.replace(/;?\sSecure/, ''));
            proxyRes.headers['set-cookie'] = cookies;
        }
    });

    console.log(`Service proxy launched at ${proxyUrl} .`);
}

const argv = yargs(hideBin(process.argv))
    .option('previewUrl', {
        alias: 'p',
        type: 'string',
        demandOption: true,
        describe: 'Target preview URL to proxy requests to'
    })
    .option('proxyPort', {
        type: 'number',
        default: 19009,
        describe: 'Port the proxy server listens on'
    })
    .option('webPreviewPort', {
        type: 'number',
        default: 8081,
        describe: 'Local web preview server port'
    })
    .help()
    .argv;

launchServiceProxy(argv.previewUrl, argv.proxyPort, argv.webPreviewPort);

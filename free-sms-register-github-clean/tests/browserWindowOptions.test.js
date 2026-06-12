const test = require('node:test');
const assert = require('node:assert/strict');

const {
    parseBrowserWindowPair,
    buildBrowserLaunchArgs,
} = require('../src/browserWindowOptions');

test('parseBrowserWindowPair accepts negative position coordinates', () => {
    assert.deepEqual(parseBrowserWindowPair('-1080,0'), { first: -1080, second: 0 });
});

test('parseBrowserWindowPair accepts positive window size', () => {
    assert.deepEqual(parseBrowserWindowPair('1000,900'), { first: 1000, second: 900 });
});

test('parseBrowserWindowPair rejects invalid values', () => {
    assert.equal(parseBrowserWindowPair('abc,900'), null);
    assert.equal(parseBrowserWindowPair('1000'), null);
    assert.equal(parseBrowserWindowPair(''), null);
});

test('buildBrowserLaunchArgs adds Chrome window position and size flags', () => {
    const args = buildBrowserLaunchArgs({
        position: '-1080,0',
        size: '1000,900',
    });

    assert.deepEqual(args, [
        '--no-sandbox',
        '--disable-gpu',
        '--lang=zh-CN',
        '--window-position=-1080,0',
        '--window-size=1000,900',
    ]);
});

test('buildBrowserLaunchArgs ignores invalid window values', () => {
    const args = buildBrowserLaunchArgs({
        position: 'left,0',
        size: '1000',
    });

    assert.deepEqual(args, [
        '--no-sandbox',
        '--disable-gpu',
        '--lang=zh-CN',
    ]);
});

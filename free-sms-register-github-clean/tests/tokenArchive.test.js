const test = require('node:test');
const assert = require('node:assert/strict');

const {
    countCurrentBatchTokens,
    getCurrentBatchTokenName,
    getNextTokenArchiveBatch,
    isBatchTokenFile,
} = require('../src/tokenArchive');

test('getNextTokenArchiveBatch uses one next number for the startup batch', () => {
    const batch = getNextTokenArchiveBatch([
        'codex-new@example.com-free.json',
        '1_codex-old-a@example.com-free.json',
        '1_codex-old-b@example.com-free.json',
        '2_codex-older@example.com-free.json',
        'old_codex-legacy@example.com-free.json',
        'notes.txt',
    ]);

    assert.equal(batch, 3);
});

test('getNextTokenArchiveBatch starts at one when no numeric archive exists', () => {
    const batch = getNextTokenArchiveBatch([
        'codex-current@example.com-free.json',
        'old_codex-legacy@example.com-free.json',
    ]);

    assert.equal(batch, 1);
});

test('getCurrentBatchTokenName adds the current startup batch to new tokens', () => {
    assert.equal(
        getCurrentBatchTokenName('codex-new@example.com-free.json', 5),
        '5_codex-new@example.com-free.json'
    );
});

test('getCurrentBatchTokenName keeps legacy active names without a current batch', () => {
    assert.equal(
        getCurrentBatchTokenName('codex-new@example.com-free.json', 0),
        'codex-new@example.com-free.json'
    );
});

test('isBatchTokenFile matches only tokens from the requested batch', () => {
    assert.equal(isBatchTokenFile('5_codex-new@example.com-free.json', 5), true);
    assert.equal(isBatchTokenFile('4_codex-old@example.com-free.json', 5), false);
    assert.equal(isBatchTokenFile('codex-active@example.com-free.json', 5), false);
    assert.equal(isBatchTokenFile('old_codex-legacy@example.com-free.json', 5), false);
});

test('countCurrentBatchTokens only counts tokens from the current batch', () => {
    assert.equal(countCurrentBatchTokens([
        '5_codex-new@example.com-free.json',
        'codex-previous@example.com-free.json',
        '4_codex-old@example.com-free.json',
        'old_codex-legacy@example.com-free.json',
    ], 5), 1);
});

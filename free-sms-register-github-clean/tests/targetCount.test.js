const test = require('node:test');
const assert = require('node:assert/strict');

const {
    parseTargetCountArg,
    resolveTargetCount,
    formatTargetCount,
    formatProgress,
} = require('../src/targetCount');

test('parseTargetCountArg returns numeric command line target', () => {
    assert.equal(parseTargetCountArg(['5']), 5);
    assert.equal(parseTargetCountArg(['--country=US', '12']), 12);
});

test('resolveTargetCount prompts when no numeric argument exists and empty input means forever', async () => {
    const prompts = [];
    const target = await resolveTargetCount([], {
        isInteractive: true,
        question: async (prompt) => {
            prompts.push(prompt);
            return '';
        },
    });

    assert.equal(target, Infinity);
    assert.equal(prompts.length, 1);
    assert.match(prompts[0], /直接回车/);
});

test('resolveTargetCount keeps asking until interactive input is a positive integer', async () => {
    const answers = ['abc', '0', '3'];
    const messages = [];

    const target = await resolveTargetCount([], {
        isInteractive: true,
        question: async () => answers.shift(),
        log: (message) => messages.push(message),
    });

    assert.equal(target, 3);
    assert.equal(messages.length, 2);
    assert.match(messages[0], /正整数/);
});

test('resolveTargetCount defaults to one in non-interactive mode', async () => {
    const target = await resolveTargetCount([], { isInteractive: false });
    assert.equal(target, 1);
});

test('format helpers describe finite and forever runs', () => {
    assert.equal(formatTargetCount(4), '4');
    assert.equal(formatTargetCount(Infinity), '无限，Ctrl+C 停止');
    assert.equal(formatProgress(2, 4), '[进度] 2 / 4');
    assert.equal(formatProgress(2, Infinity), '[进度] 已完成 2，继续运行中...');
});

const test = require('node:test');
const assert = require('node:assert/strict');

const {
    buildTokenDomainStats,
    formatTokenDomainStatsTable,
} = require('../src/tokenDomainStats');

test('buildTokenDomainStats counts configured domains from any token filename prefix', () => {
    const stats = buildTokenDomainStats([
        'codex-a@example.xyz-free.json',
        '1_codex-b@example.xyz-free.json',
        'old_codex-c@example.cfd-free.json',
        '9_old_codex-d@example.me-free.json',
        'codex-e@unknown.example-free.json',
        'notes.json',
    ], ['example.xyz', 'example.cfd', 'example.me']);

    assert.deepEqual(stats.rows, [
        { domain: 'example.xyz', count: 2, percent: '50.00%' },
        { domain: 'example.cfd', count: 1, percent: '25.00%' },
        { domain: 'example.me', count: 1, percent: '25.00%' },
    ]);
    assert.equal(stats.total, 4);
    assert.equal(stats.ignored, 2);
});

test('buildTokenDomainStats keeps configured zero-count domains in output', () => {
    const stats = buildTokenDomainStats([
        'old_codex-a@example.xyz-free.json',
    ], ['example.xyz', 'example.qzz.io']);

    assert.deepEqual(stats.rows, [
        { domain: 'example.xyz', count: 1, percent: '100.00%' },
        { domain: 'example.qzz.io', count: 0, percent: '0.00%' },
    ]);
    assert.equal(stats.total, 1);
});

test('formatTokenDomainStatsTable renders a CLI table', () => {
    const table = formatTokenDomainStatsTable({
        rows: [
            { domain: 'example.xyz', count: 2, percent: '66.67%' },
            { domain: 'wudili.example.cc', count: 1, percent: '33.33%' },
        ],
        total: 3,
        ignored: 1,
    });

    assert.equal(table, [
        '',
        '[统计] tokens 目录账号域名分布',
        '域名           | 数量 | 占全部账号',
        '-------------- | ---- | ----------',
        'example.xyz      | 2    | 66.67%',
        'wudili.example.cc | 1    | 33.33%',
        '',
        '总计: 3',
    ].join('\n'));
});

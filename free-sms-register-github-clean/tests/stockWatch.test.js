const test = require('node:test');
const assert = require('node:assert/strict');

const {
    DEFAULT_STOCK_WATCH_INTERVAL_MS,
    parseStockWatchArgs,
    formatCountryPriceTable,
    formatOperatorOptionTable,
    formatStockWatchInterval,
    logAggregateStockSkip,
    logStockCountrySelection,
    shouldShowOperatorDetails,
} = require('../src/stockWatch');

test('parseStockWatchArgs enables stock watch with a ten minute default interval', () => {
    const options = parseStockWatchArgs(['--stock-watch']);

    assert.deepEqual(options, {
        enabled: true,
        intervalMs: DEFAULT_STOCK_WATCH_INTERVAL_MS,
    });
});

test('parseStockWatchArgs ignores invalid custom intervals', () => {
    assert.equal(parseStockWatchArgs([]).enabled, false);
    assert.equal(parseStockWatchArgs(['--stock-watch', '--stock-interval-minutes=0']).intervalMs, DEFAULT_STOCK_WATCH_INTERVAL_MS);
    assert.equal(parseStockWatchArgs(['--stock-watch', '--stock-interval-minutes=abc']).intervalMs, DEFAULT_STOCK_WATCH_INTERVAL_MS);
});

test('parseStockWatchArgs accepts positive minute interval override', () => {
    assert.equal(parseStockWatchArgs(['--stock-watch', '--stock-interval-minutes=2']).intervalMs, 120000);
});

test('formatStockWatchInterval describes minute intervals', () => {
    assert.equal(formatStockWatchInterval(10 * 60 * 1000), '10 分钟');
    assert.equal(formatStockWatchInterval(90 * 1000), '90 秒');
});

test('formatCountryPriceTable matches the registration stock table style', () => {
    const table = formatCountryPriceTable([
        { isoCode: 'GB', name: '英国', dialCode: '44', heroSmsCountry: 16, price: 0.1, count: 12 },
        { isoCode: 'US', name: '美国', dialCode: '1', heroSmsCountry: 187, price: null, count: null },
    ]);

    assert.equal(table, [
        '',
        '[SMS] HeroSMS 最便宜国家 Top 列表',
        '序号 | ISO | 国家 | 区号 | HeroSMS | 价格($) | 库存',
        '---- | --- | ---- | ---- | ------- | ------- | ----',
        '1    | GB  | 英国         | +44   | 16      | 0.100   | 12',
        '2    | US  | 美国         | +1    | 187     | -       | -',
    ].join('\n'));
});

test('formatOperatorOptionTable matches the registration operator table style', () => {
    const table = formatOperatorOptionTable([
        { label: '任何运营商', price: 0.1, count: 3, note: '国家聚合库存' },
        { operator: 'ee', label: 'ee', price: 0.0921, count: 7, note: '运营商聚合库存' },
    ], { name: '英国' });

    assert.equal(table, [
        '',
        '[SMS] 英国 可选运营商 / 报价列表',
        '序号 | 运营商 | 价格($) | 库存 | 说明',
        '---- | ------ | ------- | ---- | ----',
        '1    | 任何运营商  | 0.1000  | 3    | 国家聚合库存',
        '2    | ee     | 0.0921  | 7    | 运营商聚合库存',
    ].join('\n'));
});

test('stock watch suppresses automatic selection and aggregate skip notices', () => {
    const messages = [];
    const log = (message) => messages.push(message);

    logStockCountrySelection({ stockOnly: true, country: { name: '英国', dialCode: '44' }, log });
    logAggregateStockSkip({ stockOnly: true, country: { name: '英国' }, aggregateCount: 118, log });

    assert.deepEqual(messages, []);
});

test('normal registration mode keeps aggregate skip notice', () => {
    const messages = [];
    const log = (message) => messages.push(message);

    logAggregateStockSkip({ stockOnly: false, country: { name: '英国' }, aggregateCount: 118, log });

    assert.deepEqual(messages, [
        '[SMS] 英国 当前聚合库存 118，不触发二次运营商选择',
    ]);
});

test('stock watch only shows country stock table without operator details', () => {
    assert.equal(shouldShowOperatorDetails({ stockOnly: true }), false);
    assert.equal(shouldShowOperatorDetails({ stockOnly: false }), true);
});

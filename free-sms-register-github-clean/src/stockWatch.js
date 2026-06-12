const DEFAULT_STOCK_WATCH_INTERVAL_MS = 10 * 60 * 1000;

function parseStockWatchArgs(args = []) {
    const enabled = args.includes('--stock-watch');
    const intervalArg = args.find(arg => String(arg || '').startsWith('--stock-interval-minutes='));
    const intervalMinutes = intervalArg
        ? Number.parseFloat(String(intervalArg).split('=')[1])
        : null;
    const intervalMs = Number.isFinite(intervalMinutes) && intervalMinutes > 0
        ? Math.round(intervalMinutes * 60 * 1000)
        : DEFAULT_STOCK_WATCH_INTERVAL_MS;

    return { enabled, intervalMs };
}

function formatStockWatchInterval(intervalMs) {
    const seconds = Math.round(Number(intervalMs) / 1000);
    if (seconds > 0 && seconds % 60 === 0) {
        return `${seconds / 60} 分钟`;
    }
    return `${seconds} 秒`;
}

function formatCountryPriceTable(rows, title = '[SMS] HeroSMS 最便宜国家 Top 列表') {
    const lines = [
        '',
        title,
        '序号 | ISO | 国家 | 区号 | HeroSMS | 价格($) | 库存',
        '---- | --- | ---- | ---- | ------- | ------- | ----',
    ];

    rows.forEach((row, index) => {
        const price = row.price !== null && row.price !== undefined && Number.isFinite(Number(row.price)) ? Number(row.price).toFixed(3) : '-';
        const stock = row.count !== null && row.count !== undefined && Number.isFinite(Number(row.count)) ? String(row.count) : '-';
        lines.push(`${String(index + 1).padEnd(4)} | ${row.isoCode.padEnd(3)} | ${row.name.padEnd(10)} | +${String(row.dialCode).padEnd(4)} | ${String(row.heroSmsCountry).padEnd(7)} | ${price.padEnd(7)} | ${stock}`);
    });

    return lines.join('\n');
}

function formatOperatorOptionTable(rows, country) {
    const lines = [
        '',
        `[SMS] ${country.name} 可选运营商 / 报价列表`,
        '序号 | 运营商 | 价格($) | 库存 | 说明',
        '---- | ------ | ------- | ---- | ----',
    ];

    rows.forEach((row, index) => {
        const price = row.price !== null && row.price !== undefined && Number.isFinite(Number(row.price)) ? Number(row.price).toFixed(4) : '-';
        const stock = row.count !== null && row.count !== undefined && Number.isFinite(Number(row.count)) ? String(row.count) : '-';
        const note = row.note || '';
        lines.push(`${String(index + 1).padEnd(4)} | ${String(row.label).padEnd(6)} | ${price.padEnd(7)} | ${stock.padEnd(4)} | ${note}`);
    });

    return lines.join('\n');
}

function printCountryPriceTable(rows, title) {
    console.log(formatCountryPriceTable(rows, title));
}

function printOperatorOptionTable(rows, country) {
    console.log(formatOperatorOptionTable(rows, country));
}

function logStockCountrySelection({ stockOnly = false, country, log = console.log } = {}) {
    if (stockOnly || !country) return;
    log(`[SMS] 库存模式仅展示，不进入国家选择；当前默认: ${country.name} (+${country.dialCode})`);
}

function logAggregateStockSkip({ stockOnly = false, country, aggregateCount, log = console.log } = {}) {
    if (stockOnly || !country) return;
    log(`[SMS] ${country.name} 当前聚合库存 ${aggregateCount}，不触发二次运营商选择`);
}

function shouldShowOperatorDetails({ stockOnly = false } = {}) {
    return !stockOnly;
}

module.exports = {
    DEFAULT_STOCK_WATCH_INTERVAL_MS,
    parseStockWatchArgs,
    formatCountryPriceTable,
    formatOperatorOptionTable,
    formatStockWatchInterval,
    printCountryPriceTable,
    printOperatorOptionTable,
    logStockCountrySelection,
    logAggregateStockSkip,
    shouldShowOperatorDetails,
};

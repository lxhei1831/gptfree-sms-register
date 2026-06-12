function normalizeDomains(domains) {
    const seen = new Set();
    return (Array.isArray(domains) ? domains : [])
        .map(domain => String(domain || '').trim().replace(/^@/, '').toLowerCase())
        .filter(domain => {
            if (!domain || seen.has(domain)) return false;
            seen.add(domain);
            return true;
        });
}

function extractTokenEmailDomain(filename, configuredDomains) {
    const name = String(filename || '').toLowerCase();
    if (!name.endsWith('.json')) return '';

    const domains = [...configuredDomains].sort((a, b) => b.length - a.length);
    for (const domain of domains) {
        if (name.includes(`@${domain}-free.json`)) {
            return domain;
        }
    }
    return '';
}

function buildTokenDomainStats(files, domains) {
    const configuredDomains = normalizeDomains(domains);
    const counts = new Map(configuredDomains.map(domain => [domain, 0]));
    let ignored = 0;

    for (const file of Array.isArray(files) ? files : []) {
        const domain = extractTokenEmailDomain(file, configuredDomains);
        if (!domain) {
            ignored += 1;
            continue;
        }
        counts.set(domain, (counts.get(domain) || 0) + 1);
    }

    const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
    const rows = configuredDomains.map(domain => {
        const count = counts.get(domain) || 0;
        const percent = total > 0 ? `${((count / total) * 100).toFixed(2)}%` : '0.00%';
        return { domain, count, percent };
    });

    return { rows, total, ignored };
}

function displayWidth(value) {
    return [...String(value || '')].reduce((width, char) => {
        return width + (char.charCodeAt(0) > 127 ? 2 : 1);
    }, 0);
}

function padDisplay(value, width) {
    const text = String(value || '');
    return text + ' '.repeat(Math.max(0, width - displayWidth(text)));
}

function formatTokenDomainStatsTable(stats) {
    const rows = Array.isArray(stats?.rows) ? stats.rows : [];
    const domainWidth = Math.max(displayWidth('域名'), ...rows.map(row => displayWidth(row.domain)));
    const countWidth = Math.max(4, displayWidth('数量'), ...rows.map(row => displayWidth(row.count)));
    const lines = [
        '',
        '[统计] tokens 目录账号域名分布',
        `${padDisplay('域名', domainWidth)} | ${padDisplay('数量', countWidth)} | 占全部账号`,
        `${'-'.repeat(domainWidth)} | ${'-'.repeat(countWidth)} | ----------`,
    ];

    for (const row of rows) {
        lines.push(`${padDisplay(row.domain, domainWidth)} | ${padDisplay(row.count, countWidth)} | ${row.percent}`);
    }

    lines.push('', `总计: ${stats?.total || 0}`);
    return lines.join('\n');
}

module.exports = {
    buildTokenDomainStats,
    formatTokenDomainStatsTable,
};

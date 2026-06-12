function getNextTokenArchiveBatch(files) {
    const maxBatch = (Array.isArray(files) ? files : []).reduce((max, file) => {
        const match = String(file || '').match(/^(\d+)_codex-.*-free(?:_\d+)?\.json$/);
        if (!match) return max;
        return Math.max(max, parseInt(match[1], 10) || 0);
    }, 0);

    return maxBatch + 1;
}

function getCurrentBatchTokenName(file, batch) {
    const numericBatch = parseInt(batch, 10) || 0;
    if (numericBatch <= 0) return file;
    return `${numericBatch}_${file}`;
}

function isBatchTokenFile(file, batch) {
    const numericBatch = parseInt(batch, 10) || 0;
    if (numericBatch <= 0 || typeof file !== 'string') return false;
    return file.startsWith(`${numericBatch}_codex-`) && file.endsWith('-free.json');
}

function countCurrentBatchTokens(files, batch) {
    return (Array.isArray(files) ? files : [])
        .filter(file => isBatchTokenFile(file, batch))
        .length;
}

module.exports = {
    countCurrentBatchTokens,
    getCurrentBatchTokenName,
    getNextTokenArchiveBatch,
    isBatchTokenFile,
};

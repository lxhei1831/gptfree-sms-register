function parseTargetCountArg(args = []) {
    const numericArg = args.find(arg => /^\d+$/.test(String(arg || '').trim()));
    if (!numericArg) return null;
    const value = parseInt(numericArg, 10);
    return value > 0 ? value : null;
}

async function resolveTargetCount(args = [], options = {}) {
    const fromArgs = parseTargetCountArg(args);
    if (fromArgs) return fromArgs;

    const isInteractive = options.isInteractive ?? !!process.stdin.isTTY;
    if (!isInteractive) return Infinity;

    const question = options.question;
    if (typeof question !== 'function') return Infinity;

    const log = typeof options.log === 'function' ? options.log : console.log;

    while (true) {
        const answer = String(await question('请输入要跑几轮的数字，直接回车表示一直运行（Ctrl+C 停止）: ') || '').trim();
        if (!answer) return Infinity;

        if (/^\d+$/.test(answer)) {
            const value = parseInt(answer, 10);
            if (value > 0) return value;
        }

        log('[输入] 请输入正整数，或直接回车一直运行。');
    }
}

function formatTargetCount(targetCount) {
    return Number.isFinite(targetCount) ? String(targetCount) : '无限，Ctrl+C 停止';
}

function formatProgress(currentCount, targetCount) {
    if (Number.isFinite(targetCount)) {
        return `[进度] ${currentCount} / ${targetCount}`;
    }
    return `[进度] 已完成 ${currentCount}，继续运行中...`;
}

module.exports = {
    parseTargetCountArg,
    resolveTargetCount,
    formatTargetCount,
    formatProgress,
};

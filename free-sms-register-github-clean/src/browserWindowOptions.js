const BASE_BROWSER_ARGS = ['--no-sandbox', '--disable-gpu', '--lang=zh-CN'];

function parseBrowserWindowPair(value) {
    const normalized = String(value || '').trim();
    const match = normalized.match(/^(-?\d+)\s*,\s*(-?\d+)$/);
    if (!match) return null;

    return {
        first: parseInt(match[1], 10),
        second: parseInt(match[2], 10),
    };
}

function buildBrowserLaunchArgs(options = {}) {
    const args = [...BASE_BROWSER_ARGS];
    const position = parseBrowserWindowPair(options.position);
    const size = parseBrowserWindowPair(options.size);

    if (position) {
        args.push(`--window-position=${position.first},${position.second}`);
    }

    if (size && size.first > 0 && size.second > 0) {
        args.push(`--window-size=${size.first},${size.second}`);
    }

    return args;
}

function resolveViewportSize(sizeValue, fallback = { width: 1280, height: 900 }) {
    const size = parseBrowserWindowPair(sizeValue);
    if (!size || size.first <= 0 || size.second <= 0) return fallback;

    return {
        width: size.first,
        height: size.second,
    };
}

module.exports = {
    BASE_BROWSER_ARGS,
    parseBrowserWindowPair,
    buildBrowserLaunchArgs,
    resolveViewportSize,
};

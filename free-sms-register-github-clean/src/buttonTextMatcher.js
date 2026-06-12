const PHONE_LOGIN_BUTTON_TEXTS = [
    '手机登录',
    '使用电话号码继续',
    '继续使用电话号码',
    '电话号码继续',
    '电话号码登录',
    'Continue with phone',
    'Continue with phone number',
    'Use phone number',
    'Phone number',
];

function normalizeButtonText(value = '') {
    return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function buttonTextMatches(value = '', candidates = []) {
    const normalizedValue = normalizeButtonText(value);
    if (!normalizedValue) return false;
    return candidates.some(candidate => {
        const normalizedCandidate = normalizeButtonText(candidate);
        return normalizedCandidate && normalizedValue.includes(normalizedCandidate);
    });
}

module.exports = {
    PHONE_LOGIN_BUTTON_TEXTS,
    normalizeButtonText,
    buttonTextMatches,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_POSITIVE_EMOJIS = void 0;
exports.parsePositiveEmojis = parsePositiveEmojis;
exports.hasPositiveEmoji = hasPositiveEmoji;
exports.countPositiveEmojis = countPositiveEmojis;
exports.DEFAULT_POSITIVE_EMOJIS = [
    '😊', '🎉', '✨', '🚀', '💫', '🌟', '🔥', '💯',
    '🎊', '🥳', '🎈', '🌈', '💖', '🎯', '⭐', '🎭',
    '🎪', '🎨', '🎸', '🎵', '🎶', '🎤', '🎼', '🎹',
    '🎺', '🎷', '🥁', '🎲', '🎮', '🕹️', '🎳', '🎪',
    '🚁', '🛸', '🌠', '💎', '🏆', '🥇', '🎖️', '🏅',
    '🎁', '🎀', '🌺', '🌸', '🌼', '🌻', '🌷', '🌹',
    '🦄', '🌙', '☀️', '⚡', '🔆', '💥', '✊', '👏',
    '🙌', '👍', '👌', '🤝', '💪', '🎊', '🥰', '😍'
];
function parsePositiveEmojis(input) {
    if (!input || typeof input !== 'string') {
        return [...exports.DEFAULT_POSITIVE_EMOJIS];
    }
    return input.split(',').map(emoji => emoji.trim()).filter(Boolean);
}
function hasPositiveEmoji(text, positiveEmojis) {
    if (!text || typeof text !== 'string') {
        return false;
    }
    return positiveEmojis.some(emoji => text.includes(emoji));
}
function countPositiveEmojis(text, positiveEmojis) {
    if (!text || typeof text !== 'string') {
        return 0;
    }
    return positiveEmojis.reduce((count, emoji) => {
        const matches = text.match(new RegExp(emoji, 'g'));
        return count + (matches ? matches.length : 0);
    }, 0);
}
//# sourceMappingURL=emojis.js.map
export const DEFAULT_POSITIVE_EMOJIS: readonly string[] = [
  '😊', '🎉', '✨', '🚀', '💫', '🌟', '🔥', '💯',
  '🎊', '🥳', '🎈', '🌈', '💖', '🎯', '⭐', '🎭',
  '🎪', '🎨', '🎸', '🎵', '🎶', '🎤', '🎼', '🎹',
  '🎺', '🎷', '🥁', '🎲', '🎮', '🕹️', '🎳', '🎪',
  '🚁', '🛸', '🌠', '💎', '🏆', '🥇', '🎖️', '🏅',
  '🎁', '🎀', '🌺', '🌸', '🌼', '🌻', '🌷', '🌹',
  '🦄', '🌙', '☀️', '⚡', '🔆', '💥', '✊', '👏',
  '🙌', '👍', '👌', '🤝', '💪', '🎊', '🥰', '😍'
];

export function parsePositiveEmojis(input?: string): string[] {
  if (!input || typeof input !== 'string') {
    return [...DEFAULT_POSITIVE_EMOJIS];
  }

  return input.split(',').map(emoji => emoji.trim()).filter(Boolean);
}

export function hasPositiveEmoji(text: string | null | undefined, positiveEmojis: string[]): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  return positiveEmojis.some(emoji => text.includes(emoji));
}

export function countPositiveEmojis(text: string | null | undefined, positiveEmojis: string[]): number {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  return positiveEmojis.reduce((count, emoji) => {
    const matches = text.match(new RegExp(emoji, 'g'));
    return count + (matches ? matches.length : 0);
  }, 0);
}
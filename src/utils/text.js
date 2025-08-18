export function limitWords(text, limit = 10) {
  if (!text) return '';
  const words = text.split(' ');
  return words.slice(0, limit).join(' ') + (words.length > limit ? '...' : '');
}

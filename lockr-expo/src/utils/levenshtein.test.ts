import { levenshtein, normalizeText, fuzzyMatch } from './levenshtein';

test('levenshtein distance basic', () => {
  expect(levenshtein('kitten', 'sitting')).toBe(3);
  expect(levenshtein('', 'abc')).toBe(3);
  expect(levenshtein('abc', '')).toBe(3);
});

test('normalizeText and fuzzyMatch', () => {
  const a = 'I am stupid enough to waste more time. Please give me another 15 minutes.';
  const b = 'i am stupid enough to waste more time please give me another 15 minutes';
  expect(normalizeText(a)).toBe(b);
  expect(fuzzyMatch(a, b, 0)).toBe(true);
});

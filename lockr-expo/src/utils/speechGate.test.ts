import { evaluatePhrase } from '../services/speechGate';

test('speech gate thresholds', () => {
  const target = 'I am stupid enough to waste more time. Please give me another 15 minutes.';
  const ok = evaluatePhrase('i am stupid enough to waste more time please give me another 15 minutes', target, 'strict');
  expect(ok).toBe(true);
});

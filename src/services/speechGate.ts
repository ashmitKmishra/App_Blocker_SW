import { fuzzyMatch } from '../utils/levenshtein';

export type VoiceStrictness = 'strict' | 'normal' | 'lenient';

export function strictnessToDistance(strictness: VoiceStrictness) {
  switch (strictness) {
    case 'strict':
      return 2; // allow 2 edits
    case 'normal':
      return 6;
    case 'lenient':
      return 12;
  }
}

export function evaluatePhrase(transcript: string, target: string, strictness: VoiceStrictness) {
  const max = strictnessToDistance(strictness);
  return fuzzyMatch(transcript, target, max);
}

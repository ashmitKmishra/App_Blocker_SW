import { evaluatePhrase, VoiceStrictness } from './speechGate';
import SpeechModule from '../modules/SpeechModule';

export type SpeechResult = { transcript: string; confidence?: number };

export default class SpeechService {
  // Start continuous listening - stub
  async startListening(): Promise<SpeechResult> {
    return { transcript: '' };
  }

  stopListening() {
    // TODO
  }

  async isOnDeviceAvailable(): Promise<boolean> {
    return true;
  }

  // Listen once with native module if available, else fallback to prompt (JS stub)
  async listenOnce(timeoutMs = 8000): Promise<SpeechResult> {
    return new Promise(async (resolve) => {
      let settled = false;
      const onResult = (t: string) => {
        if (settled) return;
        settled = true;
        resolve({ transcript: t });
      };
      try {
        // try native SpeechModule if implemented
        if (SpeechModule && SpeechModule.startListening) {
          SpeechModule.startListening((transcript: string) => onResult(transcript));
        }
      } catch (e) {
        // ignore
      }
      setTimeout(() => {
        if (!settled) {
          settled = true;
          resolve({ transcript: '' });
        }
      }, timeoutMs);
    });
  }

  // Utility: evaluate transcript against the target extreme phrase
  evaluateTranscript(transcript: string, target: string, strictness: VoiceStrictness) {
    return evaluatePhrase(transcript, target, strictness);
  }
}

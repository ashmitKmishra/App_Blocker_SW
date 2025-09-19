// SpeechModule stub: should bridge to Android SpeechRecognizer or iOS SFSpeechRecognizer.
export type SpeechCallback = (transcript: string, confidence?: number) => void;

export default {
  async requestMicrophonePermission(): Promise<boolean> {
    return false;
  },
  async hasMicrophonePermission(): Promise<boolean> {
    return false;
  },
  startListening(callback: SpeechCallback) {
    // native should call callback repeatedly or once with final transcript
  },
  stopListening() {
    // native stop
  }
};

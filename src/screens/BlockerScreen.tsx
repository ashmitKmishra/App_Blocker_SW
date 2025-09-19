import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../state/store';
import OverlayBlocker from '../components/OverlayBlocker';
import MicGateCard from '../components/MicGateCard';
import speechService from '../services/speechService';
import { addExtraToday } from '../state/slices/quotasSlice';
import { unlockUntil, recordDenied } from '../state/slices/sessionSlice';

export default function BlockerScreen({ navigation }: any) {
  const quotas = useSelector((s: RootState) => s.quotas);
  const session = useSelector((s: RootState) => s.session);
  const mode = useSelector((s: RootState) => s.mode.current);
  const settings = useSelector((s: RootState) => s.settings);
  const dispatch = useDispatch();

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus] = useState<'idle' | 'failed' | 'success'>('idle');
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);

  const remaining = Math.max(0, quotas.dailyBudgetSec - quotas.dailyUsedSec + quotas.extraTodaySec);

  const onMicPress = async () => {
    if (cooldownUntil && Date.now() < cooldownUntil) return;
    setListening(true);
    setStatus('idle');
    const svc = new speechService();
    const res = await svc.listenOnce(8000);
    setListening(false);
    setTranscript(res.transcript || '');
    const target = 'I am stupid enough to waste more time. Please give me another 15 minutes.';
    const ok = svc.evaluateTranscript(res.transcript || '', target, settings.voiceStrictness);
    if (ok) {
      setStatus('success');
      // unlock for 15 minutes
      const ends = Math.floor(Date.now() / 1000) + 15 * 60;
      dispatch(unlockUntil(ends) as any);
      // navigate back to Home
      navigation.navigate('Home');
    } else {
      setStatus('failed');
      dispatch(recordDenied() as any);
      // incrementally apply cooldowns based on failed count
      const failed = (session.failedSpeechCount || 0) + 1;
      let cd = 15 * 1000;
      if (failed >= 3) cd = 120 * 1000;
      setCooldownUntil(Date.now() + cd);
    }
  };

  if (mode === 'EXTREME') {
    return (
      <View style={styles.container}>
        <MicGateCard listening={listening} onPress={onMicPress} transcript={transcript} status={status} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OverlayBlocker
        remainingSec={remaining}
        onRemind={() => {
          // TODO: schedule reminder
        }}
        onAddTime={() => dispatch(addExtraToday(10 * 60) as any)}
        onClose={() => {
          // TODO: close app via native module
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 }
});

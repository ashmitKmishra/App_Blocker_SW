import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AppRow from '../components/AppRow';
import { addApp, toggleApp } from '../state/slices/guardedAppsSlice';
import { RootState } from '../state/store';

type AppItem = { id: string; name: string; packageName: string };

const DUMMY_APPS: AppItem[] = [
  { id: 'com.facebook.katana', name: 'Facebook', packageName: 'com.facebook.katana' },
  { id: 'com.instagram.android', name: 'Instagram', packageName: 'com.instagram.android' },
  { id: 'com.twitter.android', name: 'Twitter', packageName: 'com.twitter.android' }
];

export default function SelectAppsScreen() {
  const dispatch = useDispatch();
  const apps = useSelector((s: RootState) => s.guardedApps.apps);

  const ensureApp = (a: any) => {
    if (!apps.find((x: any) => x.id === a.id)) dispatch(addApp(a) as any);
    dispatch(toggleApp({ id: a.id }) as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select apps to guard</Text>
      <FlatList
        data={DUMMY_APPS}
        keyExtractor={(i: AppItem) => i.id}
        renderItem={({ item }: { item: AppItem }) => <AppRow app={item as any} onToggle={() => ensureApp(item)} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  row: { padding: 12, borderRadius: 12, backgroundColor: '#f4f4f6', marginBottom: 8 },
  rowText: { fontSize: 16 }
});

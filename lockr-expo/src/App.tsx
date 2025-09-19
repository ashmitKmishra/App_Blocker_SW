import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './state/store';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import SelectAppsScreen from './screens/SelectAppsScreen';
import ModeConfigScreen from './screens/ModeConfigScreen';
import BlockerScreen from './screens/BlockerScreen';
import SettingsScreen from './screens/SettingsScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { navigationRef } from './navigation/NavigationService';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName="Welcome">
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="SelectApps" component={SelectAppsScreen} />
              <Stack.Screen name="ModeConfig" component={ModeConfigScreen} />
              <Stack.Screen name="Blocker" component={BlockerScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}


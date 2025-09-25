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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{
            headerStyle: { backgroundColor: '#667eea' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Lockr Dashboard' }}
          />
          <Stack.Screen 
            name="SelectApps" 
            component={SelectAppsScreen} 
            options={{ title: 'Select Apps to Guard' }}
          />
          <Stack.Screen 
            name="ModeConfig" 
            component={ModeConfigScreen} 
            options={{ title: 'Configure Mode' }}
          />
          <Stack.Screen 
            name="Blocker" 
            component={BlockerScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}


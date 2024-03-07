import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import { saveAlert } from './src/services/AlertsService';

import * as Notifications from 'expo-notifications';

import theme from './Theme';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

export default function App() {

  function processNotification(notification) {
    const alert = {
      ...notification.request.content.data,
      date: Date.now()
    }
    saveAlert(alert);
  }

  Notifications.addNotificationReceivedListener(processNotification);

  Notifications.addNotificationResponseReceivedListener(processNotification);

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}



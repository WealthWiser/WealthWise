import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/redux/store';
import {MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { Colors } from './src/utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.blueMid,
      accent: Colors.neutralBackground,
  },
};
  return (
    <ReduxProvider store={store}>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutralBackground }}>
        <PaperProvider theme={theme}>
          <StatusBar barStyle="dark-content" backgroundColor={Colors.neutralBackground} />
          <AppNavigator />
        </PaperProvider>
      </SafeAreaView>
    </ReduxProvider>
  );
}

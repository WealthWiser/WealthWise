import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/redux/store';
import {MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { Colors } from './src/utils/theme';

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
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
    </ReduxProvider>
  );
}

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/redux/store';
import {MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#0077b6', // Wealthy blue
      accent: '#90e0ef',
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

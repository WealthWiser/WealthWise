import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { useSelector } from 'react-redux';
import { store } from './src/redux/store';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { Colors } from './src/utils/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ This one uses hooks (inside Provider)
const MainApp = () => {
  const statusBarColors = useSelector((state) => state.statusBarColor);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.blueMid,
      accent: Colors.neutralBackground,
    },
  };

  return (
    <>
      <SafeAreaView style={{flex: 0, backgroundColor: statusBarColors.StatusBarcolorTop }} edges={['top']} />
      <SafeAreaView style={{flex: 1,backgroundColor: statusBarColors.StatusBarcolorBot, position:'relative' }} edges={['bottom']}>
        <PaperProvider theme={theme}>
          <StatusBar barStyle={statusBarColors.StatusBarTextStyle} translucent/>
          <AppNavigator />
        </PaperProvider>
      </SafeAreaView>
    </>
  );
};

// ✅ Wrap MainApp in ReduxProvider
export default function App() {
  return (
    <ReduxProvider store={store}>
      <MainApp />
    </ReduxProvider>
  );
}

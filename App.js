import React, {useEffect} from 'react';
import { Provider as ReduxProvider, useDispatch  } from 'react-redux';
import { useSelector } from 'react-redux';
import { store } from './src/redux/store';
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'react-native';
import { Colors } from './src/utils/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { bootstrapAuth } from './src/auth/bootstrapAuth';
import { ThemeProvider, useTheme } from './src/Theme/ThemeProvider';

const Bootstrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    bootstrapAuth(dispatch);
  }, []);

  return <AppNavigator />;
};

const MainApp = () => {
  const statusBarColors = useSelector((state) => state.statusBarColor);
  const {colors, isDark} = useTheme();
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
      {/* <SafeAreaView style={{flex: 0, backgroundColor: statusBarColors.StatusBarcolorTop }} edges={['top']} /> */}
      {/* <SafeAreaView style={{flex: 1,backgroundColor: statusBarColors.StatusBarcolorBot, position:'relative' }} edges={['bottom']}> */}
        <PaperProvider theme={theme}>
          <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor='transparent'
          translucent
          />
          <Bootstrapper />
        </PaperProvider>
      {/* </SafeAreaView> */}
    </>
  );
};


export default function App() {
  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <MainApp />
        </ThemeProvider>
      </SafeAreaProvider>
    </ReduxProvider>
  );
}

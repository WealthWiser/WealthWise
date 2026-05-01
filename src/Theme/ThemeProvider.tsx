import { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { createTheme } from './themes';
import React from 'react';

const ThemeContext = createContext(null);

type Props = {
  children?: React.ReactNode;
}

export const ThemeProvider : React.FC = ({children }: Props) =>{
  const scheme = useColorScheme(); // 'light' | 'dark' | null
  console.log("Color Scheme: ", scheme);
  const theme:any = useMemo(() => {
    return createTheme(scheme ?? 'light')
  },[scheme]);
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
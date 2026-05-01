import { lightColors } from './colors.light';
import { darkColors } from './colors.dark';

export const createTheme = (scheme = 'light') => ({
  isDark: scheme ===   'dark',
  colors: scheme === 'dark' ? darkColors : lightColors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  fontSizes: {
    sm: 12,
    md: 16,
    lg: 20,
  },
  fonts: {
    regular: 'System',
  },
});
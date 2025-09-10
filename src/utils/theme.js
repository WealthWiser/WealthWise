// utils/theme.js

const Colors = {
  // Primary Shades
  primary: '#2DA0F8',
  primaryLight: '#59BCF3',
  primaryMid: '#2DA0F8', 
  primaryDark: '#0E8BF9',
  primaryDeep: '#10266F',

  // Backgrounds
  background: '#FFFFFF',
  backgroundLight: '#F8FCFF',
  backgroundAlt: '#CDE9FF',
  neutralBackground: '#F5F5F5', 

  // Text Colors
  textPrimary: '#262E5B',
  textDark: '#000000',
  textLight: '#FFFFFF',

  // Neutral Grays
  grayDark: '#4A4A4A',  
  grayLight: '#B0B0B0',  

  // Accent Colors
  accentPink: '#EA4C89',
  accentCoral: '#FE7169',
  accentTeal: '#43BCA8',

  // Extras
  blueMid: '#2DA0F8', 
  gold: '#FFD700',    

  // Required for Paper / general use
  black: '#000000',  
  white: '#FFFFFF',
};

const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

const Fonts = {
  primary: 'Lato-Regular',
  heading: 'Lato-Bold',
  fallback: 'Lato-BlackItalic',
};

const FontWeights = {
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
};

export { Colors, Spacing, FontSizes, Fonts, FontWeights };
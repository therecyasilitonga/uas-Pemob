export const colors = {
  primary: '#5B6CFF',
  primaryDark: '#4048C9',
  primaryLight: '#EEF0FF',
  accent: '#FF6B81',
  accentLight: '#FFE7EB',
  success: '#1FAA6D',
  successLight: '#E4F7EE',
  warning: '#F5A623',
  warningLight: '#FEF3E2',
  danger: '#E9483F',
  dangerLight: '#FDEAE9',
  background: '#F4F6FB',
  surface: '#FFFFFF',
  border: '#E7E9F3',
  text: '#1B1D2A',
  textMuted: '#6B7080',
  textInverse: '#FFFFFF',
  overlay: 'rgba(27, 29, 42, 0.55)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '800', color: colors.text },
  h2: { fontSize: 22, fontWeight: '800', color: colors.text },
  h3: { fontSize: 17, fontWeight: '700', color: colors.text },
  body: { fontSize: 14, fontWeight: '400', color: colors.text },
  bodyBold: { fontSize: 14, fontWeight: '700', color: colors.text },
  caption: { fontSize: 12, fontWeight: '500', color: colors.textMuted },
};

export const shadow = {
  card: {
    shadowColor: '#1B1D2A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  soft: {
    shadowColor: '#1B1D2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
};

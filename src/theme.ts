// Tokens from the Claude Design spec sheet (Verter v1).
export const palette = {
  light: {
    bg: '#F4F6FA',
    card: '#FFFFFF',
    line: '#E3E8F0',
    cardOutline: 'transparent',
    swapOutline: 'transparent',
    ink: '#0B1220',
    ink2: '#4A5568',
    ink3: '#6B7689',
    brandInk: '#1F6FEB',
    chipOnBg: '#E8F0FE',
    chipOnInk: '#1550C0',
    chipOnLine: '#1F6FEB',
    clearBg: '#E9EDF3',
    swapBg: '#FFFFFF',
    warnBg: '#FFF4D6',
    warnLine: '#EFCB6A',
    warnInk: '#6B4300',
  },
  dark: {
    bg: '#0B0F17',
    card: '#161B26',
    line: '#262F40',
    cardOutline: '#202838',
    swapOutline: '#2A3344',
    ink: '#F5F7FB',
    ink2: '#A9B3C4',
    ink3: '#7C879B',
    brandInk: '#5A97FF',
    chipOnBg: '#17305C',
    chipOnInk: '#D6E4FF',
    chipOnLine: '#3B8BFF',
    clearBg: '#262D3B',
    swapBg: '#1E2532',
    warnBg: '#2B2310',
    warnLine: '#5A4714',
    warnInk: '#FFD36B',
  },
};

export type Colors = typeof palette.light;

export const brand = { from: '#1F6FEB', to: '#1550C0' };

export const font = {
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
};

// Shadows only apply in light mode; dark mode uses 1pt outlines instead.
export const shadow = {
  card: {
    shadowColor: '#101828',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  result: {
    shadowColor: '#1F6FEB',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  swap: {
    shadowColor: '#101828',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
};

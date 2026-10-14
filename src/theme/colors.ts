// Color tokens from the Claude Design spec sheet (Verter v1).
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
    redInk: '#D93036',
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
    redInk: '#FF6369',
    warnBg: '#2B2310',
    warnLine: '#5A4714',
    warnInk: '#FFD36B',
  },
};

export type Colors = typeof palette.light;

// Same in both schemes: the result card gradient and text on top of it.
export const brand = { from: '#1F6FEB', to: '#1550C0', onBrand: '#FFFFFF' };

// Warning triangle fill and glyph.
export const warnIcon = { fill: '#FCC419', glyph: '#3A2600' };

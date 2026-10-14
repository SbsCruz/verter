export type Currency = 'COP' | 'USD';

export const CURRENCIES: Record<Currency, { flag: string; name: string }> = {
  COP: { flag: '🇨🇴', name: 'Colombian peso' },
  USD: { flag: '🇺🇸', name: 'US dollar' },
};

export const otherCurrency = (currency: Currency): Currency => (currency === 'COP' ? 'USD' : 'COP');

// Input limits: COP is whole pesos, USD allows 2 decimals on top of these digits.
export const MAX_COP_DIGITS = 10;
export const MAX_USD_DIGITS = 7;

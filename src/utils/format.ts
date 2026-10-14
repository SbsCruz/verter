import { Currency, MAX_COP_DIGITS, MAX_USD_DIGITS } from '@/constants/currencies';

// Inserts a grouping separator every three digits: "45000" -> "45.000".
export function group(digits: string, sep: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

// Turns whatever the user typed into a clean raw value.
// COP: whole pesos only ("45.000" -> "45000"). USD: digits plus up to 2 decimals.
export function sanitize(text: string, currency: Currency): string {
  if (currency === 'COP') {
    return text.replace(/\D/g, '').replace(/^0+/, '').slice(0, MAX_COP_DIGITS);
  }
  const cleaned = text.replace(/[^\d.]/g, '');
  const [int = '', ...rest] = cleaned.split('.');
  const intPart = int.replace(/^0+(?=\d)/, '').slice(0, MAX_USD_DIGITS);
  if (rest.length === 0) return intPart;
  return `${intPart || '0'}.${rest.join('').slice(0, 2)}`;
}

// Formats a raw value for display inside the input while typing.
export function formatInput(raw: string, currency: Currency): string {
  if (!raw) return '';
  if (currency === 'COP') return group(raw, '.');
  const [int, dec] = raw.split('.');
  return dec === undefined ? group(int, ',') : `${group(int, ',')}.${dec}`;
}

export function toNumber(raw: string): number {
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

// Formats a computed amount without the "$": 45000 -> "45.000", 14.07 -> "14.07".
export function formatNumber(value: number, currency: Currency): string {
  if (currency === 'COP') return group(String(Math.round(value)), '.');
  const [int, dec] = value.toFixed(2).split('.');
  return `${group(int, ',')}.${dec}`;
}

// Raw value (as sanitize would produce) for a computed amount, used when swapping.
export function toRaw(value: number, currency: Currency): string {
  if (value <= 0) return '';
  if (currency === 'COP') return String(Math.round(value));
  return value.toFixed(2).replace(/\.?0+$/, '');
}

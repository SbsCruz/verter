import { Currency, MAX_COP_DIGITS } from './format';

export type Chip = {
  key: string;
  label: string;
  accessibilityLabel: string;
  // Raw input value after tapping, given the base value the user typed.
  apply: (base: string) => string | null;
};

const group = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// COP chips multiply what was typed: "25" + ×1k -> "25000".
// They multiply the typed base rather than the current value, so switching
// from ×1k to ×10k gives 250.000, not 25.000.000.
const multiplier = (factor: number, label: string): Chip => ({
  key: label,
  label,
  accessibilityLabel: `Multiply amount by ${group(factor)}`,
  apply: (base) => {
    const result = String((parseInt(base, 10) || 1) * factor);
    return result.length > MAX_COP_DIGITS ? null : result;
  },
});

// USD chips set a fixed amount.
const preset = (value: number): Chip => ({
  key: `$${value}`,
  label: `$${value}`,
  accessibilityLabel: `Set amount to ${value} dollars`,
  apply: () => String(value),
});

export const CHIPS: Record<Currency, Chip[]> = {
  COP: [multiplier(100, '×100'), multiplier(1_000, '×1k'), multiplier(10_000, '×10k'), multiplier(100_000, '×100k')],
  USD: [preset(10), preset(20), preset(50), preset(100)],
};

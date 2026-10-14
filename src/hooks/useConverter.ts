import { useState } from 'react';

import { Chip } from '@/constants/chips';
import { Currency, otherCurrency } from '@/constants/currencies';
import { sanitize, toNumber, toRaw } from '@/utils/format';

// Holds what the user typed and converts it with the given rate (COP per 1 USD).
export function useConverter(rate: number) {
  const [from, setFrom] = useState<Currency>('COP');
  const [raw, setRaw] = useState('');
  // What the user typed before tapping a multiplier chip, and which chip is active.
  const [base, setBase] = useState<string | null>(null);
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const to = otherCurrency(from);
  const amount = toNumber(raw);
  const converted = from === 'COP' ? amount / rate : amount * rate;

  const resetChips = () => {
    setBase(null);
    setActiveChip(null);
  };

  const type = (text: string) => {
    setRaw(sanitize(text, from));
    resetChips();
  };

  const clear = () => {
    setRaw('');
    resetChips();
  };

  const applyChip = (chip: Chip) => {
    const typed = base ?? raw;
    const next = chip.apply(typed);
    if (next === null) return;
    setRaw(next);
    setBase(from === 'COP' ? typed : null);
    setActiveChip(chip.key);
  };

  // Flips the direction and carries the converted amount into the input.
  const swap = () => {
    setRaw(toRaw(converted, to));
    setFrom(to);
    resetChips();
  };

  return { from, to, raw, converted, activeChip, type, clear, applyChip, swap };
}

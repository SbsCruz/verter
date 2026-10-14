import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { CURRENCIES, Currency } from '@/constants/currencies';
import { ClearIcon } from '@/icons';
import { createStyles, font, MAX_AMOUNT_FONT_SCALE, shadow, useStyles, useTheme } from '@/theme';
import { fitFontSize } from '@/utils/fitFontSize';
import { formatInput } from '@/utils/format';

import { CurrencyLabel } from './CurrencyLabel';

type Props = {
  currency: Currency;
  raw: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
};

// Width taken by screen insets, card padding, "$" prefix and the ✕ button.
const RESERVED_WIDTH = 146;

export function AmountInput({ currency, raw, onChangeText, onClear }: Props) {
  const s = useStyles(sheet);
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const [focused, setFocused] = useState(false);
  const input = useRef<TextInput>(null);

  const text = formatInput(raw, currency);
  const fontSize = fitFontSize(width - RESERVED_WIDTH, text.length, 26, 44);

  return (
    <Pressable onPress={() => input.current?.focus()} style={[s.card, focused && s.cardFocused]}>
      <CurrencyLabel currency={currency} />
      <View style={s.row}>
        <Text style={s.prefix}>$</Text>
        <TextInput
          ref={input}
          style={[s.input, { fontSize, letterSpacing: -0.02 * fontSize }]}
          value={text}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType={currency === 'COP' ? 'number-pad' : 'decimal-pad'}
          placeholder="0"
          placeholderTextColor={colors.ink3}
          selectionColor={colors.brandInk}
          cursorColor={colors.brandInk}
          maxFontSizeMultiplier={MAX_AMOUNT_FONT_SCALE}
          accessibilityLabel={`Amount in ${CURRENCIES[currency].name}s`}
          autoFocus
        />
        {raw !== '' && (
          <Pressable onPress={onClear} style={s.clearHit} accessibilityRole="button" accessibilityLabel="Clear amount">
            <View style={s.clear}>
              <ClearIcon color={colors.ink2} />
            </View>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const sheet = createStyles(({ colors, dark }) => ({
  // 2pt border reserved at all times so focusing doesn't shift the layout.
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: colors.cardOutline,
    ...(dark ? {} : shadow.card),
  },
  cardFocused: { borderColor: colors.brandInk },
  row: { flexDirection: 'row', alignItems: 'center', height: 52, marginTop: 6, gap: 6 },
  prefix: { fontFamily: font.semibold, fontSize: 28, lineHeight: 52, color: colors.ink2 },
  input: {
    flex: 1,
    height: 52,
    padding: 0,
    fontFamily: font.bold,
    color: colors.ink,
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },
  clearHit: { width: 44, height: 44, marginRight: -8, alignItems: 'center', justifyContent: 'center' },
  clear: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.clearBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

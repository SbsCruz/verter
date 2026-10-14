import { LinearGradient } from 'expo-linear-gradient';
import { Text, useWindowDimensions, View } from 'react-native';

import { Currency } from '@/constants/currencies';
import { brand, createStyles, font, MAX_AMOUNT_FONT_SCALE, shadow, useStyles } from '@/theme';
import { fitFontSize } from '@/utils/fitFontSize';
import { formatNumber } from '@/utils/format';

import { CurrencyLabel } from './CurrencyLabel';

type Props = {
  currency: Currency;
  amount: number;
};

// Width taken by screen insets and card padding.
const RESERVED_WIDTH = 92;

export function ResultCard({ currency, amount }: Props) {
  const s = useStyles(sheet);
  const { width } = useWindowDimensions();

  const text = formatNumber(amount, currency);
  const fontSize = fitFontSize(width - RESERVED_WIDTH, text.length, 32, 60, 0.4);

  return (
    <LinearGradient
      colors={[brand.from, brand.to]}
      // ≈155° in CSS terms
      start={{ x: 0.29, y: 0.05 }}
      end={{ x: 0.71, y: 0.95 }}
      style={s.card}
    >
      <CurrencyLabel currency={currency} onBrand />
      <View style={s.row} accessibilityLiveRegion="polite">
        <Text style={[s.prefix, { fontSize: Math.round(fontSize * 0.55) }]} maxFontSizeMultiplier={MAX_AMOUNT_FONT_SCALE}>
          $
        </Text>
        <Text
          style={[s.number, { fontSize, letterSpacing: -0.03 * fontSize }]}
          numberOfLines={1}
          maxFontSizeMultiplier={MAX_AMOUNT_FONT_SCALE}
        >
          {text}
        </Text>
      </View>
    </LinearGradient>
  );
}

const sheet = createStyles(({ dark }) => ({
  card: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: brand.to,
    ...(dark ? shadow.resultDark : shadow.result),
  },
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 3, height: 64, marginTop: 6 },
  prefix: { fontFamily: font.bold, color: brand.onBrand },
  number: {
    flexShrink: 1,
    fontFamily: font.extrabold,
    lineHeight: 64,
    color: brand.onBrand,
    fontVariant: ['tabular-nums'],
  },
}));

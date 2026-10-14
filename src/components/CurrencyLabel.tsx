import { Text, View } from 'react-native';

import { CURRENCIES, Currency } from '@/constants/currencies';
import { brand, createStyles, font, useStyles } from '@/theme';

type Props = {
  currency: Currency;
  // Use white text when placed on the blue result card.
  onBrand?: boolean;
};

export function CurrencyLabel({ currency, onBrand }: Props) {
  const s = useStyles(sheet);
  return (
    <View style={s.row}>
      <Text style={s.flag}>{CURRENCIES[currency].flag}</Text>
      <Text style={[s.code, onBrand && s.onBrand]}>{currency}</Text>
    </View>
  );
}

const sheet = createStyles(({ colors }) => ({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 20 },
  flag: { fontSize: 18, lineHeight: 20 },
  code: { fontFamily: font.extrabold, fontSize: 15, lineHeight: 20, letterSpacing: 0.3, color: colors.ink },
  onBrand: { color: brand.onBrand },
}));

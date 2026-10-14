import { Pressable, Text, View } from 'react-native';

import { Chip, CHIPS } from '@/constants/chips';
import { Currency } from '@/constants/currencies';
import { createStyles, font, shadow, useStyles } from '@/theme';

type Props = {
  currency: Currency;
  raw: string;
  activeChip: string | null;
  onSelect: (chip: Chip) => void;
};

export function QuickChips({ currency, raw, activeChip, onSelect }: Props) {
  const s = useStyles(sheet);
  return (
    <View style={s.row}>
      {CHIPS[currency].map((chip) => {
        // COP multipliers stay highlighted after tapping; USD presets light up when the amount matches.
        const on = currency === 'COP' ? activeChip === chip.key : raw === chip.apply('');
        return (
          <Pressable
            key={chip.key}
            onPress={() => onSelect(chip)}
            style={({ pressed }) => [s.chip, on && s.chipOn, pressed && s.pressed]}
            accessibilityRole="button"
            accessibilityLabel={chip.accessibilityLabel}
            accessibilityState={{ selected: on }}
          >
            <Text style={[s.label, on && s.labelOn]}>{chip.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const sheet = createStyles(({ colors, dark }) => ({
  row: { flexDirection: 'row', gap: 8, marginTop: 16 },
  chip: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...(dark ? {} : shadow.card),
  },
  chipOn: { borderColor: colors.chipOnLine, backgroundColor: colors.chipOnBg, shadowOpacity: 0, elevation: 0 },
  pressed: { opacity: 0.6 },
  label: { fontFamily: font.bold, fontSize: 16, lineHeight: 20, color: colors.ink, fontVariant: ['tabular-nums'] },
  labelOn: { color: colors.chipOnInk },
}));

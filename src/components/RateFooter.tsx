import { Pressable, Text, View } from 'react-native';

import { WarnIcon } from '@/icons';
import { createStyles, font, useStyles } from '@/theme';
import { longDate } from '@/utils/date';
import { formatNumber } from '@/utils/format';

type Props = {
  rate: number;
  // When the rate was fetched, or null when only the bundled estimate is available.
  updatedAt: number | null;
  refreshing: boolean;
  onRefresh: () => void;
};

export function RateFooter({ rate, updatedAt, refreshing, onRefresh }: Props) {
  const s = useStyles(sheet);
  const rateText = `$${formatNumber(rate, 'COP')} COP`;

  if (updatedAt === null && !refreshing) {
    return (
      <Pressable onPress={onRefresh} style={s.warn} accessibilityLabel="Estimated rate. Pull down to retry">
        <WarnIcon size={16} />
        <View style={s.warnBody}>
          <Text style={s.warnTitle}>Estimated rate, connect to the internet to update</Text>
          <Text style={s.warnText}>1 USD ≈ {rateText}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onRefresh} style={s.footer} accessibilityLabel="Exchange rate. Pull down to refresh">
      <Text style={s.text}>
        {refreshing
          ? 'Updating rate…'
          : `1 USD = ${rateText} · Updated ${updatedAt ? longDate(new Date(updatedAt)) : ''}`}
      </Text>
    </Pressable>
  );
}

const sheet = createStyles(({ colors }) => ({
  footer: { marginTop: 8, minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  text: {
    fontFamily: font.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.ink2,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  warn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: colors.warnBg,
    borderWidth: 1,
    borderColor: colors.warnLine,
  },
  warnBody: { flex: 1, gap: 2 },
  warnTitle: { fontFamily: font.bold, fontSize: 13, lineHeight: 18, color: colors.warnInk },
  warnText: { fontFamily: font.medium, fontSize: 13, lineHeight: 18, color: colors.warnInk, fontVariant: ['tabular-nums'] },
}));

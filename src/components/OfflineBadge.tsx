import { Text, View } from 'react-native';

import { WarnIcon } from '@/icons';
import { createStyles, font, useStyles } from '@/theme';
import { shortDate } from '@/utils/date';

type Props = {
  // When the cached rate was fetched, or null if there is no cached rate.
  updatedAt: number | null;
};

export function OfflineBadge({ updatedAt }: Props) {
  const s = useStyles(sheet);
  return (
    <View style={s.row} accessibilityRole="alert">
      <View style={s.badge}>
        <WarnIcon size={14} />
        <Text style={s.text}>
          {updatedAt === null ? 'Offline' : `Offline · using rate from ${shortDate(new Date(updatedAt))}`}
        </Text>
      </View>
    </View>
  );
}

const sheet = createStyles(({ colors }) => ({
  row: { alignItems: 'center', paddingBottom: 8 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 28,
    paddingLeft: 8,
    paddingRight: 10,
    borderRadius: 999,
    backgroundColor: colors.warnBg,
    borderWidth: 1,
    borderColor: colors.warnLine,
  },
  text: { fontFamily: font.bold, fontSize: 12, lineHeight: 16, color: colors.warnInk },
}));

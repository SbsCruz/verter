import { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButtons, AmountInput, OfflineBadge, QuickChips, RateFooter, ResultCard } from '@/components';
import { useConverter } from '@/hooks/useConverter';
import { useRate } from '@/hooks/useRate';
import { brand, createStyles, useStyles, useTheme } from '@/theme';

// Everything sits in the top ~60% of the screen so the keypad never covers it.
export function ConverterScreen() {
  const s = useStyles(sheet);
  const { colors } = useTheme();
  const { rate, updatedAt, offline, refresh } = useRate();
  const converter = useConverter(rate);
  const [refreshing, setRefreshing] = useState(false);

  const pullRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={s.screen} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={pullRefresh}
            tintColor={colors.ink2}
            colors={[brand.from]}
            progressBackgroundColor={colors.swapBg}
          />
        }
      >
        {offline && <OfflineBadge updatedAt={updatedAt} />}

        <AmountInput
          currency={converter.from}
          raw={converter.raw}
          onChangeText={converter.type}
          onClear={converter.clear}
        />

        <ActionButtons from={converter.from} to={converter.to} onSwap={converter.swap} onClear={converter.clear} />

        <ResultCard currency={converter.to} amount={converter.converted} />

        <QuickChips
          currency={converter.from}
          raw={converter.raw}
          activeChip={converter.activeChip}
          onSelect={converter.applyChip}
        />

        <RateFooter rate={rate} updatedAt={updatedAt} refreshing={refreshing} onRefresh={pullRefresh} />
      </ScrollView>
    </SafeAreaView>
  );
}

const sheet = createStyles(({ colors }) => ({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
}));

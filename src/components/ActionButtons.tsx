import { ReactNode, useRef, useState } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';

import { Currency } from '@/constants/currencies';
import { ClearLargeIcon, SwapIcon } from '@/icons';
import { createStyles, shadow, useStyles, useTheme } from '@/theme';

type Props = {
  from: Currency;
  to: Currency;
  onSwap: () => void;
  onClear: () => void;
};

// Swap and clear buttons, centred as a pair over the gap between the two cards.
export function ActionButtons({ from, to, onSwap, onClear }: Props) {
  const s = useStyles(sheet);
  const { colors } = useTheme();
  const [spin] = useState(() => new Animated.Value(0));
  const spinDeg = useRef(0);

  const swap = () => {
    onSwap();
    spinDeg.current += 180;
    Animated.timing(spin, {
      toValue: spinDeg.current,
      duration: 300,
      easing: Easing.bezier(0.3, 0.7, 0.3, 1),
      useNativeDriver: true,
    }).start();
  };

  const rotate = spin.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });

  return (
    <View style={s.slot}>
      <View style={s.pair}>
        <RoundButton onPress={swap} label={`Swap currencies. Now converting ${from} to ${to}`}>
          <Animated.View style={{ transform: [{ rotate }] }}>
            <SwapIcon color={colors.brandInk} />
          </Animated.View>
        </RoundButton>
        <RoundButton onPress={onClear} label="Clear amount">
          <ClearLargeIcon color={colors.redInk} />
        </RoundButton>
      </View>
    </View>
  );
}

function RoundButton({ onPress, label, children }: { onPress: () => void; label: string; children: ReactNode }) {
  const s = useStyles(sheet);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.ring, pressed && s.pressed]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={s.button}>{children}</View>
    </Pressable>
  );
}

const sheet = createStyles(({ colors, dark }) => ({
  // Takes 8pt of layout; the buttons overflow upwards and downwards onto the cards.
  slot: { height: 8, zIndex: 2, alignItems: 'center' },
  pair: { position: 'absolute', top: -26, flexDirection: 'row', gap: 28 },
  // 4pt ring in the screen color separates the button from the cards behind it.
  ring: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: colors.bg,
    backgroundColor: colors.bg,
    ...(dark ? {} : shadow.button),
  },
  pressed: { transform: [{ scale: 0.94 }] },
  button: {
    flex: 1,
    borderRadius: 26,
    backgroundColor: colors.swapBg,
    alignItems: 'center',
    justifyContent: 'center',
    ...(dark ? { borderWidth: 1, borderColor: colors.swapOutline } : {}),
  },
}));

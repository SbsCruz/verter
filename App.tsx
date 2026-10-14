import {
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { CHIPS, Chip } from './src/chips';
import { Currency, formatAmount, formatInput, sanitize, toNumber, toRaw } from './src/format';
import { ClearIcon, ClearLargeIcon, SwapIcon, WarnIcon } from './src/icons';
import { brand, Colors, font, palette, shadow } from './src/theme';
import { useRate } from './src/useRate';

const CURRENCIES: Record<Currency, { flag: string; name: string }> = {
  COP: { flag: '🇨🇴', name: 'Colombian peso' },
  USD: { flag: '🇺🇸', name: 'US dollar' },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const shortDate = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getDate()}`;
const longDate = (d: Date) => `${shortDate(d)}, ${d.getFullYear()}`;

const clamp = (min: number, max: number, n: number) => Math.max(min, Math.min(max, n));

function Converter() {
  const dark = useColorScheme() === 'dark';
  const c = dark ? palette.dark : palette.light;
  const s = makeStyles(c, dark);
  const { width } = useWindowDimensions();
  const { rate, updatedAt, offline, refresh } = useRate();

  const [from, setFrom] = useState<Currency>('COP');
  const [raw, setRaw] = useState('');
  // What the user typed before tapping a multiplier chip, and which chip is active.
  const [base, setBase] = useState<string | null>(null);
  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [spin] = useState(() => new Animated.Value(0));
  const spinDeg = useRef(0);
  const input = useRef<TextInput>(null);

  const to: Currency = from === 'COP' ? 'USD' : 'COP';
  const amount = toNumber(raw);
  const converted = from === 'COP' ? amount / rate : amount * rate;
  const firstLaunch = updatedAt === null;

  const inputText = formatInput(raw, from);
  const resultText = formatAmount(converted, to).slice(1); // "$" is rendered separately
  const inputSize = clamp(26, 44, Math.floor((width - 146) / (Math.max(1, inputText.length) * 0.62)));
  const resultSize = clamp(32, 60, Math.floor((width - 92) / (resultText.length * 0.62 + 0.4)));

  const resetChips = () => {
    setBase(null);
    setActiveChip(null);
  };

  const clearAmount = () => {
    setRaw('');
    resetChips();
  };

  const onType = (text: string) => {
    setRaw(sanitize(text, from));
    resetChips();
  };

  const onChip = (chip: Chip) => {
    const typed = base ?? raw;
    const next = chip.apply(typed);
    if (next === null) return;
    setRaw(next);
    setBase(from === 'COP' ? typed : null);
    setActiveChip(chip.key);
  };

  const swap = () => {
    setRaw(toRaw(converted, to));
    setFrom(to);
    resetChips();
    spinDeg.current += 180;
    Animated.timing(spin, {
      toValue: spinDeg.current,
      duration: 300,
      easing: Easing.bezier(0.3, 0.7, 0.3, 1),
      useNativeDriver: true,
    }).start();
  };

  const pullRefresh = async () => {
    setPulling(true);
    await refresh();
    setPulling(false);
  };

  const rateText = `1 USD = $${formatAmount(rate, 'COP').slice(1)} COP`;
  const footerText = pulling
    ? 'Updating rate…'
    : `${rateText} · Updated ${updatedAt ? longDate(new Date(updatedAt)) : ''}`;

  return (
    <SafeAreaView style={s.screen} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        refreshControl={
          <RefreshControl
            refreshing={pulling}
            onRefresh={pullRefresh}
            tintColor={c.ink2}
            colors={[brand.from]}
            progressBackgroundColor={c.swapBg}
          />
        }
      >
        {offline && (
          <View style={s.badgeRow} accessibilityRole="alert">
            <View style={s.badge}>
              <WarnIcon size={14} />
              <Text style={s.badgeText}>
                {firstLaunch ? 'Offline' : `Offline · using rate from ${shortDate(new Date(updatedAt ?? 0))}`}
              </Text>
            </View>
          </View>
        )}

        <Pressable
          onPress={() => input.current?.focus()}
          style={[s.card, s.inputCard, focused && s.inputCardFocused]}
        >
          <CurrencyLabel currency={from} styles={s} />
          <View style={s.amountRow}>
            <Text style={s.inputPrefix}>$</Text>
            <TextInput
              ref={input}
              style={[s.input, { fontSize: inputSize, letterSpacing: -0.02 * inputSize }]}
              value={inputText}
              onChangeText={onType}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              keyboardType={from === 'COP' ? 'number-pad' : 'decimal-pad'}
              placeholder="0"
              placeholderTextColor={c.ink3}
              selectionColor={c.brandInk}
              cursorColor={c.brandInk}
              maxFontSizeMultiplier={1.3}
              accessibilityLabel={`Amount in ${CURRENCIES[from].name}s`}
              autoFocus
            />
            {raw !== '' && (
              <Pressable
                onPress={clearAmount}
                style={s.clearHit}
                accessibilityRole="button"
                accessibilityLabel="Clear amount"
              >
                <View style={s.clear}>
                  <ClearIcon color={c.ink2} />
                </View>
              </Pressable>
            )}
          </View>
        </Pressable>

        <View style={s.swapSlot}>
          <View style={s.actions}>
            <Pressable
              onPress={swap}
              style={({ pressed }) => [s.actionRing, pressed && s.actionPressed]}
              accessibilityRole="button"
              accessibilityLabel={`Swap currencies. Now converting ${from} to ${to}`}
            >
              <View style={s.action}>
                <Animated.View
                  style={{
                    transform: [
                      { rotate: spin.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) },
                    ],
                  }}
                >
                  <SwapIcon color={c.brandInk} />
                </Animated.View>
              </View>
            </Pressable>
            <Pressable
              onPress={clearAmount}
              style={({ pressed }) => [s.actionRing, pressed && s.actionPressed]}
              accessibilityRole="button"
              accessibilityLabel="Clear amount"
            >
              <View style={s.action}>
                <ClearLargeIcon color={c.redInk} />
              </View>
            </Pressable>
          </View>
        </View>

        <LinearGradient
          colors={[brand.from, brand.to]}
          start={{ x: 0.29, y: 0.05 }}
          end={{ x: 0.71, y: 0.95 }}
          style={s.result}
        >
          <CurrencyLabel currency={to} styles={s} onBrand />
          <View style={s.resultRow} accessibilityLiveRegion="polite">
            <Text style={[s.resultPrefix, { fontSize: Math.round(resultSize * 0.55) }]} maxFontSizeMultiplier={1.3}>
              $
            </Text>
            <Text
              style={[s.resultNumber, { fontSize: resultSize, letterSpacing: -0.03 * resultSize }]}
              numberOfLines={1}
              maxFontSizeMultiplier={1.3}
            >
              {resultText}
            </Text>
          </View>
        </LinearGradient>

        <View style={s.chips}>
          {CHIPS[from].map((chip) => {
            const on = from === 'COP' ? activeChip === chip.key : raw === chip.apply('');
            return (
              <Pressable
                key={chip.key}
                onPress={() => onChip(chip)}
                style={({ pressed }) => [s.chip, on && s.chipOn, pressed && s.pressed]}
                accessibilityRole="button"
                accessibilityLabel={chip.accessibilityLabel}
                accessibilityState={{ selected: on }}
              >
                <Text style={[s.chipText, on && s.chipTextOn]}>{chip.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {firstLaunch && !pulling ? (
          <Pressable
            onPress={pullRefresh}
            style={s.warn}
            accessibilityLabel="Estimated rate. Pull down to retry"
          >
            <WarnIcon size={16} />
            <View style={s.warnBody}>
              <Text style={s.warnTitle}>Estimated rate, connect to the internet to update</Text>
              <Text style={s.warnText}>1 USD ≈ ${formatAmount(rate, 'COP').slice(1)} COP</Text>
            </View>
          </Pressable>
        ) : (
          <Pressable
            onPress={pullRefresh}
            style={s.footer}
            accessibilityLabel="Exchange rate. Pull down to refresh"
          >
            <Text style={s.footerText}>{footerText}</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function CurrencyLabel({
  currency,
  styles: s,
  onBrand,
}: {
  currency: Currency;
  styles: ReturnType<typeof makeStyles>;
  onBrand?: boolean;
}) {
  return (
    <View style={s.labelRow}>
      <Text style={s.flag}>{CURRENCIES[currency].flag}</Text>
      <Text style={[s.code, onBrand && s.onBrand]}>{currency}</Text>
    </View>
  );
}

export default function App() {
  const [loaded, error] = useFonts({
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  // Fall back to the system font rather than a blank screen if loading fails.
  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <Converter />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const makeStyles = (c: Colors, dark: boolean) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg },
    content: { flexGrow: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },

    badgeRow: { alignItems: 'center', paddingBottom: 8 },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      height: 28,
      paddingLeft: 8,
      paddingRight: 10,
      borderRadius: 999,
      backgroundColor: c.warnBg,
      borderWidth: 1,
      borderColor: c.warnLine,
    },
    badgeText: { fontFamily: font.bold, fontSize: 12, lineHeight: 16, color: c.warnInk },

    card: {
      backgroundColor: c.card,
      borderRadius: 20,
      ...(dark ? { borderWidth: 1, borderColor: c.cardOutline } : shadow.card),
    },
    // 2pt border reserved at all times so focusing doesn't shift the layout.
    inputCard: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderWidth: 2,
      borderColor: dark ? c.cardOutline : 'transparent',
    },
    inputCardFocused: { borderColor: c.brandInk },

    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 20 },
    flag: { fontSize: 18, lineHeight: 20 },
    code: { fontFamily: font.extrabold, fontSize: 15, lineHeight: 20, letterSpacing: 0.3, color: c.ink },
    onBrand: { color: '#FFFFFF' },

    amountRow: { flexDirection: 'row', alignItems: 'center', height: 52, marginTop: 6, gap: 6 },
    inputPrefix: { fontFamily: font.semibold, fontSize: 28, lineHeight: 52, color: c.ink2 },
    input: {
      flex: 1,
      height: 52,
      padding: 0,
      fontFamily: font.bold,
      color: c.ink,
      fontVariant: ['tabular-nums'],
      includeFontPadding: false,
    },
    clearHit: { width: 44, height: 44, marginRight: -8, alignItems: 'center', justifyContent: 'center' },
    clear: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.clearBg,
      alignItems: 'center',
      justifyContent: 'center',
    },

    swapSlot: { height: 8, zIndex: 2, alignItems: 'center' },
    actions: { position: 'absolute', top: -26, flexDirection: 'row', gap: 28 },
    actionPressed: { transform: [{ scale: 0.94 }] },
    actionRing: {
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 4,
      borderColor: c.bg,
      backgroundColor: c.bg,
      ...(dark ? {} : shadow.swap),
    },
    action: {
      flex: 1,
      borderRadius: 26,
      backgroundColor: c.swapBg,
      alignItems: 'center',
      justifyContent: 'center',
      ...(dark ? { borderWidth: 1, borderColor: c.swapOutline } : {}),
    },

    result: {
      borderRadius: 20,
      padding: 20,
      backgroundColor: brand.to,
      ...(dark
        ? { shadowColor: '#000', shadowOpacity: 0.45, shadowRadius: 14, shadowOffset: { width: 0, height: 10 } }
        : shadow.result),
    },
    resultRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3, height: 64, marginTop: 6 },
    resultPrefix: { fontFamily: font.bold, color: '#FFFFFF' },
    resultNumber: {
      flexShrink: 1,
      fontFamily: font.extrabold,
      lineHeight: 64,
      color: '#FFFFFF',
      fontVariant: ['tabular-nums'],
    },

    chips: { flexDirection: 'row', gap: 8, marginTop: 16 },
    chip: {
      flex: 1,
      height: 48,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: c.line,
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
      ...(dark ? {} : shadow.card),
    },
    chipOn: { borderColor: c.chipOnLine, backgroundColor: c.chipOnBg, shadowOpacity: 0, elevation: 0 },
    chipText: {
      fontFamily: font.bold,
      fontSize: 16,
      lineHeight: 20,
      color: c.ink,
      fontVariant: ['tabular-nums'],
    },
    chipTextOn: { color: c.chipOnInk },
    pressed: { opacity: 0.6 },

    footer: { marginTop: 8, minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
    footerText: {
      fontFamily: font.semibold,
      fontSize: 13,
      lineHeight: 18,
      color: c.ink2,
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
      backgroundColor: c.warnBg,
      borderWidth: 1,
      borderColor: c.warnLine,
    },
    warnBody: { flex: 1, gap: 2 },
    warnTitle: { fontFamily: font.bold, fontSize: 13, lineHeight: 18, color: c.warnInk },
    warnText: { fontFamily: font.medium, fontSize: 13, lineHeight: 18, color: c.warnInk, fontVariant: ['tabular-nums'] },
  });

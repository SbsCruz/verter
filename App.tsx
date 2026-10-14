import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Currency, formatAmount, formatInput, sanitize, toNumber, toRaw } from './src/format';
import { useRate } from './src/useRate';

const CHIPS: Record<Currency, number[]> = {
  COP: [10000, 20000, 50000, 100000],
  USD: [5, 10, 20, 50],
};

const FLAGS: Record<Currency, string> = { COP: '🇨🇴', USD: '🇺🇸' };

function chipLabel(value: number, currency: Currency): string {
  return currency === 'COP' ? `${value / 1000}k` : `$${value}`;
}

function Converter() {
  const { rate, updatedAt, offline, loading, refresh } = useRate();
  const [from, setFrom] = useState<Currency>('COP');
  const [raw, setRaw] = useState('');

  const to: Currency = from === 'COP' ? 'USD' : 'COP';
  const amount = toNumber(raw);
  const converted = from === 'COP' ? amount / rate : amount * rate;

  const swap = () => {
    setRaw(toRaw(converted, to));
    setFrom(to);
  };

  const rateText = `1 USD = ${formatAmount(rate, 'COP')} COP`;
  const updatedText = updatedAt
    ? `Updated ${new Date(updatedAt).toLocaleDateString()}`
    : 'Estimated rate, connect to the internet to update';

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        >
          <Text style={styles.title}>Verter</Text>

          <View style={styles.card}>
            <Text style={styles.label}>
              {FLAGS[from]}  {from === 'COP' ? 'Colombian pesos' : 'US dollars'}
            </Text>
            <View style={styles.inputRow}>
              <Text style={styles.prefix}>$</Text>
              <TextInput
                style={styles.input}
                value={formatInput(raw, from)}
                onChangeText={(t) => setRaw(sanitize(t, from))}
                keyboardType={from === 'COP' ? 'number-pad' : 'decimal-pad'}
                placeholder="0"
                placeholderTextColor="#B0B7C3"
                autoFocus
                selectionColor="#1F6FEB"
              />
              {raw !== '' && (
                <Pressable
                  onPress={() => setRaw('')}
                  hitSlop={12}
                  style={styles.clear}
                  accessibilityLabel="Clear amount"
                >
                  <Text style={styles.clearText}>✕</Text>
                </Pressable>
              )}
            </View>
          </View>

          <Pressable
            onPress={swap}
            style={({ pressed }) => [styles.swap, pressed && styles.pressed]}
            accessibilityLabel="Swap currencies"
          >
            <Text style={styles.swapText}>⇅</Text>
          </Pressable>

          <View style={[styles.card, styles.resultCard]}>
            <Text style={[styles.label, styles.resultLabel]}>
              {FLAGS[to]}  {to === 'COP' ? 'Colombian pesos' : 'US dollars'}
            </Text>
            <Text style={styles.result} numberOfLines={1} adjustsFontSizeToFit>
              {formatAmount(converted, to)}
            </Text>
          </View>

          <View style={styles.chips}>
            {CHIPS[from].map((value) => (
              <Pressable
                key={value}
                onPress={() => setRaw(String(value))}
                style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
              >
                <Text style={styles.chipText}>{chipLabel(value, from)}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.rate}>{rateText}</Text>
            <Text style={styles.updated}>
              {offline ? '⚠️ Offline · ' : ''}
              {updatedText}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Converter />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F4F6FA' },
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 20, paddingTop: 12 },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 16 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  resultCard: { backgroundColor: '#1F6FEB' },
  resultLabel: { color: '#DCE8FD' },
  label: { fontSize: 15, fontWeight: '600', color: '#6B7280', marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  prefix: { fontSize: 36, fontWeight: '700', color: '#111827', marginRight: 4 },
  input: { flex: 1, fontSize: 36, fontWeight: '700', color: '#111827', paddingVertical: 4 },
  clear: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  clearText: { fontSize: 16, color: '#4B5563', fontWeight: '700' },
  swap: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -12,
    zIndex: 1,
    borderWidth: 4,
    borderColor: '#F4F6FA',
  },
  swapText: { fontSize: 22, color: '#1F6FEB', fontWeight: '700' },
  result: { fontSize: 40, fontWeight: '800', color: '#FFFFFF' },
  chips: { flexDirection: 'row', gap: 10, marginTop: 16 },
  chip: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  chipText: { fontSize: 16, fontWeight: '700', color: '#1F6FEB' },
  pressed: { opacity: 0.6 },
  footer: { marginTop: 20, alignItems: 'center' },
  rate: { fontSize: 14, fontWeight: '600', color: '#374151' },
  updated: { fontSize: 12, color: '#6B7280', marginTop: 4, textAlign: 'center' },
});

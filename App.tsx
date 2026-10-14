import { useFonts } from '@expo-google-fonts/manrope';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ConverterScreen } from '@/screens/ConverterScreen';
import { fontAssets } from '@/theme';

export default function App() {
  const [loaded, error] = useFonts(fontAssets);
  // Fall back to the system font rather than a blank screen if loading fails.
  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <ConverterScreen />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

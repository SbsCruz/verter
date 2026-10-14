import Svg, { Path } from 'react-native-svg';

// Large ✕ on the round clear button next to swap.
export function ClearLargeIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path d="M5 5l10 10M15 5L5 15" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

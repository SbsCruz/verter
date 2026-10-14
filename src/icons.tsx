import Svg, { Path, Rect } from 'react-native-svg';

export function SwapIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M8 4v15M4 8l4-4 4 4M16 20V5M12 16l4 4 4-4"
        stroke={color}
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ClearIcon({ color }: { color: string }) {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Path d="M2 2l8 8M10 2l-8 8" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

export function ClearLargeIcon({ color }: { color: string }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path d="M5 5l10 10M15 5L5 15" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

export function WarnIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Path d="M8 1.5 15.2 14.2H.8z" fill="#FCC419" />
      <Rect x={7.2} y={5.6} width={1.6} height={4.6} rx={0.8} fill="#3A2600" />
      <Rect x={7.2} y={11.2} width={1.6} height={1.6} rx={0.8} fill="#3A2600" />
    </Svg>
  );
}

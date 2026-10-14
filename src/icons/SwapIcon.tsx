import Svg, { Path } from 'react-native-svg';

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

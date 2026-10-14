import Svg, { Path } from 'react-native-svg';

// Small ✕ inside the amount field.
export function ClearIcon({ color }: { color: string }) {
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Path d="M2 2l8 8M10 2l-8 8" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

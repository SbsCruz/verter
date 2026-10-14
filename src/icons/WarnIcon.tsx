import Svg, { Path, Rect } from 'react-native-svg';

import { warnIcon } from '@/theme';

export function WarnIcon({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16">
      <Path d="M8 1.5 15.2 14.2H.8z" fill={warnIcon.fill} />
      <Rect x={7.2} y={5.6} width={1.6} height={4.6} rx={0.8} fill={warnIcon.glyph} />
      <Rect x={7.2} y={11.2} width={1.6} height={1.6} rx={0.8} fill={warnIcon.glyph} />
    </Svg>
  );
}

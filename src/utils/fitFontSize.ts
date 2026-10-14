// Estimates the largest font size (within min..max) that fits `chars` characters
// in `available` points. Manrope digits are roughly 0.62em wide; `extra` adds room
// in em for things like a prefix gap.
export function fitFontSize(available: number, chars: number, min: number, max: number, extra = 0): number {
  const size = Math.floor(available / (Math.max(1, chars) * 0.62 + extra));
  return Math.max(min, Math.min(max, size));
}

import { StyleSheet, useColorScheme } from 'react-native';

import { Colors, palette } from './colors';

export type Theme = { dark: boolean; colors: Colors };

const themes: Record<'light' | 'dark', Theme> = {
  light: { dark: false, colors: palette.light },
  dark: { dark: true, colors: palette.dark },
};

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? themes.dark : themes.light;
}

type Themed<T> = Record<'light' | 'dark', T>;

// Builds a component's styles once per color scheme, at import time:
//   const sheet = createStyles(({ colors }) => ({ box: { backgroundColor: colors.card } }));
//   const s = useStyles(sheet);
export function createStyles<T extends StyleSheet.NamedStyles<T>>(factory: (theme: Theme) => T): Themed<T> {
  return {
    light: StyleSheet.create(factory(themes.light)),
    dark: StyleSheet.create(factory(themes.dark)),
  };
}

export function useStyles<T>(sheet: Themed<T>): T {
  return useTheme().dark ? sheet.dark : sheet.light;
}

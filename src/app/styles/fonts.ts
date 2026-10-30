import localFont from 'next/font/local'

// Onest Variable через next/font (ADR 0013) из файлов @fontsource-variable/onest: сборка не ходит в сеть за шрифтом.
// next/font не умеет unicode-range у отдельных файлов одного семейства, поэтому каждое подмножество это своё
// семейство, а --font-sans (shared/ui/tokens.css) перечисляет их подряд: браузер берёт глиф из того, чей диапазон
// его покрывает. Диапазоны и файлы как в index.css пакета. Латиница и кириллица предзагружаются (первый экран),
// расширения грузятся по требованию. Греческий и вьетнамский сайту не нужны.
// Next требует литералы в вызовах шрифтов: без общих констант и шаблонных строк.
const onestLatin = localFont({
  src: '../../../node_modules/@fontsource-variable/onest/files/onest-latin-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-onest-latin',
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
    },
  ],
})

const onestCyrillic = localFont({
  src: '../../../node_modules/@fontsource-variable/onest/files/onest-cyrillic-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-onest-cyrillic',
  declarations: [{ prop: 'unicode-range', value: 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116' }],
})

const onestCyrillicExt = localFont({
  src: '../../../node_modules/@fontsource-variable/onest/files/onest-cyrillic-ext-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  adjustFontFallback: false,
  preload: false,
  variable: '--font-onest-cyrillic-ext',
  declarations: [
    { prop: 'unicode-range', value: 'U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F' },
  ],
})

const onestLatinExt = localFont({
  src: '../../../node_modules/@fontsource-variable/onest/files/onest-latin-ext-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  adjustFontFallback: false,
  preload: false,
  variable: '--font-onest-latin-ext',
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
    },
  ],
})

// JetBrains Mono для вёрстки чека: тот же приём, только latin и cyrillic.
const jetbrainsMonoLatin = localFont({
  src: '../../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-jetbrains-mono-latin',
  declarations: [
    {
      prop: 'unicode-range',
      value:
        'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
    },
  ],
})

const jetbrainsMonoCyrillic = localFont({
  src: '../../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-cyrillic-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  adjustFontFallback: false,
  variable: '--font-jetbrains-mono-cyrillic',
  declarations: [
    {
      prop: 'unicode-range',
      value: 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116',
    },
  ],
})

/** Классы с переменными семейств: ставятся на `<html>`. */
export const fontVariables = [
  onestLatin.variable,
  onestCyrillic.variable,
  onestCyrillicExt.variable,
  onestLatinExt.variable,
  jetbrainsMonoLatin.variable,
  jetbrainsMonoCyrillic.variable,
].join(' ')

// PostCSS для CSS Modules (ADR 0009): `@custom-media` из src/shared/ui/media.css доступны в любом CSS-файле.
// Формат с именами плагинов строками поддерживают и Vite, и Next.js.
export default {
  plugins: {
    '@csstools/postcss-global-data': { files: ['src/shared/ui/media.css'] },
    'postcss-custom-media': {},
  },
}

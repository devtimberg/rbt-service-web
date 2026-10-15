/** TypeScript 6 больше не объявляет side-effect импорты стилей неявно —
 * без этого `import "./globals.css"` в app/layout.tsx не компилируется. */
declare module "*.css";

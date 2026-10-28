// Матчеры @testing-library/jest-dom для vitest 5: сам пакет (7.0.1) ещё дополняет Assertion<T>,
// а в vitest 5 у Assertion два параметра и свои матчеры ждут в Matchers
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers'

declare module 'vitest' {
  interface Matchers<R extends void | Promise<void> = void | Promise<void>, T = unknown> extends TestingLibraryMatchers<
    T,
    R
  > {}
}

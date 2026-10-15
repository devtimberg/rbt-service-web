import type { ComponentProps } from 'react'

/** Источник для `<picture>`: `media`, `srcSet`, `type`, `width`, `height`, `sizes`. */
export type ImageSource = Omit<ComponentProps<'source'>, 'children' | 'ref'>

export type ImageProps = Omit<ComponentProps<'img'>, 'alt'> & {
  /** Обязателен: описание картинки или `''` для декоративной. */
  alt: string
  /**
   * Источники `<source>` (баннеры с отдельной картинкой для мобильных). Передан, даже пустой, — `<img>`
   * оборачивается в `<picture>`; порядок важен, браузер берёт первый подошедший.
   */
  sources?: readonly ImageSource[] | undefined
  /** Класс `<picture>` (обычно не нужен: `picture` строчный и не влияет на раскладку). */
  pictureClassName?: string | undefined
}

/** Картинка `img` без своих стилей; с `sources` — `picture` с `source` и `img` внутри. */
export function Image({ sources, pictureClassName, alt, ...props }: ImageProps) {
  const img = <img alt={alt} {...props} />
  if (!sources) return img
  return (
    <picture className={pictureClassName}>
      {sources.map((source) => (
        <source key={`${source.media ?? ''} ${source.srcSet ?? ''}`} {...source} />
      ))}
      {img}
    </picture>
  )
}

/**
 * Скрытый `<svg>` с `clipPath` в долях габаритов элемента (`clipPathUnits="objectBoundingBox"`):
 * на него ссылается `style={{ clipPath: 'url(#id)' }}` (скруглённый вырез у картинки товара в корзине).
 * Это не иконка, а определение для CSS, поэтому лежит отдельно от `icons`.
 */
export function ClipPathDefs({ id, d }: { id: string; d: string }) {
  return (
    <svg className="absolute" width="0" height="0">
      <defs>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d={d} />
        </clipPath>
      </defs>
    </svg>
  )
}

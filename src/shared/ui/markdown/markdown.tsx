import ReactMarkdown, { type Components } from 'react-markdown'
import { cn } from '@/shared/lib/cn'
import { Divider } from '../divider'
import { Heading } from '../heading'
import { List, ListItem } from '../list'
import { SmartLink } from '../smart-link'
import { Text, LineBreak } from '../text'
import styles from './markdown.module.css'

type MarkdownProps = {
  children: string
  /** Сдвиг уровней, если страница уже содержит свой h1. */
  headingOffset?: 0 | 1
  className?: string
}

/** Обычный Markdown без исполнения HTML/JSX, оформленный примитивами UI-кита. */
export function Markdown({ children, headingOffset = 0, className }: MarkdownProps) {
  const heading =
    (level: 1 | 2 | 3 | 4 | 5 | 6): NonNullable<Components['h1']> =>
    ({ node: _node, ...props }) => (
      <Heading level={Math.min(6, level + headingOffset) as 1 | 2 | 3 | 4 | 5 | 6} {...props} />
    )
  const components: Components = {
    h1: heading(1),
    h2: heading(2),
    h3: heading(3),
    h4: heading(4),
    h5: heading(5),
    h6: heading(6),
    p: ({ node: _node, ...props }) => <Text {...props} />,
    strong: ({ node: _node, ...props }) => <Text as="strong" {...props} />,
    em: ({ node: _node, ...props }) => <Text as="em" {...props} />,
    ul: ({ node: _node, ...props }) => <List {...props} />,
    ol: ({ node: _node, ...props }) => <List as="ol" {...props} />,
    li: ({ node: _node, ...props }) => <ListItem {...props} />,
    a: ({ node: _node, href, ...props }) => <SmartLink href={href ?? ''} {...props} />,
    br: ({ node: _node, ...props }) => <LineBreak {...props} />,
    hr: ({ node: _node, ...props }) => <Divider {...props} />,
  }
  return (
    <div className={cn(styles.root, className)}>
      <ReactMarkdown skipHtml components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}

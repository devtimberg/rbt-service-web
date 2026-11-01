import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Box, Breadcrumb, Container, Heading, Markdown, Text } from '@/shared/ui'
import styles from './privacy-policy-page.module.css'

export async function PrivacyPolicyPage() {
  const source = await readFile(join(process.cwd(), 'src/pages/privacy-policy/content/privacy-policy.md'), 'utf8')
  const content = source.replace(/<!--[\s\S]*?-->/g, '').trim()
  return (
    <Container className={styles.root}>
      <Breadcrumb items={[{ label: 'Политика конфиденциальности' }]} />
      <Box as="article" className={styles.document}>
        <Heading level={1} className={styles.title}>
          Политика конфиденциальности
        </Heading>
        {content ? (
          <Markdown headingOffset={1}>{content}</Markdown>
        ) : (
          <Text className={styles.pending}>Текст документа готовится.</Text>
        )}
      </Box>
    </Container>
  )
}

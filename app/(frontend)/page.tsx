import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { BlockRenderer } from './components/BlockRenderer'
import './styles.css'

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  
  // Fetch the page with slug '/home'
  const result = await payload.find({
    // @ts-expect-error - Collection type will be available after types regenerate
    collection: 'page',
    where: {
      slug: {
        equals: '/home',
      },
    },
    limit: 1,
    depth: 1,
  })
  
  const page = result.docs[0] as unknown as {
    id: string
    title: string
    slug: string
    components?: Array<{
      blockType: string
      [key: string]: unknown
    }>
  }
  
  if (!page) {
    notFound()
  }
  
  return (
    <div className="page">
      {page.components && page.components.length > 0 ? (
        <BlockRenderer blocks={page.components} />
      ) : (
        <div style={{ padding: '45px', textAlign: 'center' }}>
          <h1>{page.title}</h1>
          <p>No components added to this page yet.</p>
        </div>
      )}
    </div>
  )
}

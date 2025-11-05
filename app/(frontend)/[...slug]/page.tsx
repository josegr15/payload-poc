import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { BlockRenderer } from '../components/BlockRenderer'
import '../styles.css'

type PageParams = {
  slug: string[]
}

// Enable ISR: pages will regenerate at most once every 60 seconds
// On-demand revalidation hooks in Page collection will trigger immediate updates
export const revalidate = 60

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params
  const pageSlug = slug.join('/')
  
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  
  console.log("pageSlug", pageSlug)

  // Type assertion needed until Payload regenerates types
  const result = await payload.find({
    collection: 'page',
    where: {
      slug: {
        equals: `/${pageSlug}`,
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


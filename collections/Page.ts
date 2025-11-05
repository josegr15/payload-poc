import type { CollectionConfig } from 'payload'
import { FeatureGridCardsBlock } from '../blocks/FeatureGridCardsBlock.ts'

const revalidatePage = async (slug: string) => {
  console.log('🔄 Revalidating page:', slug)
  
  try {
    // Determine the base URL for revalidation
    let baseUrl = 'http://localhost:3000'
    if (process.env.NEXT_PUBLIC_SERVER_URL) {
      baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`
    }
    
    const path = slug === '/home' ? '/' : slug
    const revalidateUrl = `${baseUrl}/api/revalidate`
    
    console.log('📍 Revalidation details:', {
      url: revalidateUrl,
      path,
    })
    
    const response = await fetch(revalidateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        type: 'path',
      }),
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      console.error('❌ Revalidation failed:', {
        status: response.status,
        statusText: response.statusText,
        result,
      })
    } else {
      console.log('✅ Revalidation successful:', result)
    }
  } catch (error) {
    console.error('❌ Error revalidating page:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
  }
}

const Page: CollectionConfig = {
  slug: 'page',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        console.log('📝 Page afterChange hook triggered:', {
          operation,
          slug: doc.slug,
          id: doc.id,
        })
        
        // Revalidate the page when it's created or updated
        if (doc.slug) {
          await revalidatePage(doc.slug)
        } else {
          console.warn('⚠️ No slug found in document, skipping revalidation')
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        // Revalidate the page when it's deleted
        if (doc.slug) {
          await revalidatePage(doc.slug)
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g., "home", "about")',
      },
    },
    {
      name: 'components',
      type: 'blocks',
      blocks: [FeatureGridCardsBlock],
      label: 'Page Components',
    },
  ],
}

export default Page
import type { CollectionConfig } from 'payload'
import { FeatureGridCardsBlock } from '../blocks/FeatureGridCardsBlock.ts'

const revalidatePage = async (slug: string) => {
  try {
    // Determine the base URL for revalidation
    let baseUrl = 'http://localhost:3000'
    if (process.env.NEXT_PUBLIC_SERVER_URL) {
      baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
    } else if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`
    }
    
    const path = slug === '/home' ? '/' : slug
    
    await fetch(`${baseUrl}/api/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': process.env.REVALIDATE_SECRET || '',
      },
      body: JSON.stringify({
        path,
        type: 'path',
      }),
    })
  } catch (error) {
    console.error('Error revalidating page:', error)
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
        // Revalidate the page when it's created or updated
        if (doc.slug) {
          await revalidatePage(doc.slug)
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
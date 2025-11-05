import type { CollectionConfig } from 'payload'
import { FeatureGridCardsBlock } from '../blocks/FeatureGridCardsBlock.ts'

const revalidatePage = async (slug: string) => {
  console.log('🔄 Revalidating page:', slug)
  
  try {
    // Determine the base URL for revalidation
    let baseUrl = 'http://localhost:3000'
    
    // Priority: NEXT_PUBLIC_SERVER_URL > VERCEL_URL > VERCEL (for internal requests)
    if (process.env.NEXT_PUBLIC_SERVER_URL) {
      baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
    } else if (process.env.VERCEL_URL) {
      // VERCEL_URL includes the protocol on Vercel
      baseUrl = process.env.VERCEL_URL.startsWith('http') 
        ? process.env.VERCEL_URL 
        : `https://${process.env.VERCEL_URL}`
    }
    
    const path = slug === '/home' ? '/' : slug
    const revalidateUrl = `${baseUrl}/api/revalidate`
    
    console.log('📍 Revalidation details:', {
      url: revalidateUrl,
      path,
      env: {
        NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
        VERCEL_URL: process.env.VERCEL_URL,
      },
    })
    
    const fetchOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add User-Agent to help identify the request source
        'User-Agent': 'PayloadCMS-Revalidation',
      },
      body: JSON.stringify({
        path,
        type: 'path',
      }),
      // Add cache and redirect options for server-to-server requests
      cache: 'no-store',
      redirect: 'follow',
    }
    
    console.log('📤 Making revalidation request:', {
      url: revalidateUrl,
      options: fetchOptions,
    })
    
    const response = await fetch(revalidateUrl, fetchOptions)
    
    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const text = await response.text()
      console.error('❌ Revalidation failed:', {
        status: response.status,
        statusText: response.statusText,
        body: text,
        headers: Object.fromEntries(response.headers.entries()),
      })
      return
    }
    
    const result = await response.json()
    console.log('✅ Revalidation successful:', result)
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
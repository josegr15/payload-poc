import type { CollectionConfig } from 'payload'

const revalidateBlog = async (slug: string) => {
  console.log('🔄 Revalidating blog:', slug)
  
  try {
    let baseUrl = 'http://localhost:3000'
    
    if (process.env.NEXT_PUBLIC_SERVER_URL) {
      baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
    } else if (process.env.VERCEL_BRANCH_URL) {
      baseUrl = process.env.VERCEL_BRANCH_URL
    } else if (process.env.VERCEL_URL) {
      baseUrl = process.env.VERCEL_URL.startsWith('http') 
        ? process.env.VERCEL_URL 
        : `https://${process.env.VERCEL_URL}`
    }
    
    const path = `/blog/${slug}`
    const revalidateUrl = `${baseUrl}/api/revalidate?path=${encodeURIComponent(path)}&type=path`
    
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: {
        'User-Agent': 'PayloadCMS-Revalidation',
      },
      cache: 'no-store',
      redirect: 'follow',
    }
    
    const response = await fetch(revalidateUrl, fetchOptions)
    
    if (!response.ok) {
      const text = await response.text()
      console.error('❌ Revalidation failed:', {
        status: response.status,
        statusText: response.statusText,
        body: text,
      })
      return
    }
    
    const result = await response.json()
    console.log('✅ Revalidation successful:', result)
  } catch (error) {
    console.error('❌ Error revalidating blog:', error)
  }
}

const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        console.log('📝 Blog afterChange hook triggered:', {
          operation,
          slug: doc.slug,
          id: doc.id,
        })
        
        if (doc.slug) {
          await revalidateBlog(doc.slug)
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        if (doc.slug) {
          await revalidateBlog(doc.slug)
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
        description: 'URL-friendly identifier (e.g., "my-first-post")',
      },
    },
    {
      name: 'headerImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Header image for the blog post',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'author',
      required: true,
      admin: {
        description: 'Select the author of this blog post',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      admin: {
        description: 'Publication date',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}

export default Blog

